function parseFactKey(key) {
  if (typeof key !== "string") {
    return {
      operation: "multiplication",
      symbol: "x",
      left: 0,
      right: 0,
      leftMagnitude: 0,
      rightMagnitude: 0,
    };
  }

  const modernMatch = key.match(/^(multiplication|addition|subtraction|division):(-?\d+)([x+\-\/])(-?\d+)$/i);
  if (modernMatch) {
    const operation = OPERATION_OPTIONS.includes(modernMatch[1])
      ? modernMatch[1]
      : "multiplication";
    const left = Number(modernMatch[2]);
    const symbol = getOperationDisplaySymbol(operation);
    const right = Number(modernMatch[4]);
    return {
      operation,
      symbol,
      left,
      right,
      leftMagnitude: Math.abs(left),
      rightMagnitude: Math.abs(right),
    };
  }

  const legacyMatch = key.match(/^(-?\d+)x(-?\d+)$/i);
  const left = legacyMatch ? Number(legacyMatch[1]) : 0;
  const right = legacyMatch ? Number(legacyMatch[2]) : 0;
  return {
    operation: "multiplication",
    symbol: "x",
    left,
    right,
    leftMagnitude: Math.abs(left),
    rightMagnitude: Math.abs(right),
  };
}

function formatFactLabelFromKey(key) {
  const parsed = parseFactKey(key);
  return `${parsed.left} ${parsed.symbol} ${parsed.right}`;
}

function getTableStatus(table) {
  return getBucketStatus(table.attempts, table.accuracy);
}

function getMultiplicationFactEntries() {
  return Object.entries(state.progress.facts)
    .map(([key]) => ({
      key,
      progress: getFactProgress(key),
      ...parseFactKey(key),
    }))
    .filter((entry) => entry.operation === "multiplication");
}

function getSignedFactGroupKey(entry) {
  const left = `${entry.left >= 0 ? "+" : "-"}${entry.leftMagnitude}`;
  const right = `${entry.right >= 0 ? "+" : "-"}${entry.rightMagnitude}`;
  return [left, right].sort().join("x");
}

function getTableStats(detailMode = "overall") {
  const trackerMode =
    detailMode === "positive" || detailMode === "all-integers" ? detailMode : "overall";
  const allFactEntries = getMultiplicationFactEntries();
  const factEntries =
    trackerMode === "positive"
      ? allFactEntries.filter((entry) => entry.left >= 0 && entry.right >= 0)
      : allFactEntries;

  return TABLE_FACTORS.map((factor) => {
    const relatedEntries = factEntries.filter(
      (entry) => entry.leftMagnitude === factor || entry.rightMagnitude === factor,
    );
    const seenGroupKeys = new Set(
      relatedEntries.map((entry) => {
        if (trackerMode === "all-integers") {
          return getSignedFactGroupKey(entry);
        }
        const low = Math.min(entry.leftMagnitude, entry.rightMagnitude);
        const high = Math.max(entry.leftMagnitude, entry.rightMagnitude);
        return `${low}x${high}`;
      }),
    );
    const totals = relatedEntries.reduce(
      (summary, entry) => {
        summary.attempts += entry.progress.attempts;
        summary.correct += entry.progress.correct;
        summary.misses += entry.progress.misses;
        return summary;
      },
      {
        attempts: 0,
        correct: 0,
        misses: 0,
      },
    );

    const accuracy = getAccuracy(totals.correct, totals.attempts);
    const totalFacts =
      trackerMode === "all-integers" ? MULTIPLICATION_SIGNED_TOTAL_FACTS : TABLE_FACTORS.length;
    const detailLabel =
      trackerMode === "all-integers"
        ? `${seenGroupKeys.size}/${totalFacts} signed facts`
        : trackerMode === "positive"
          ? `${seenGroupKeys.size}/${totalFacts} positive facts`
          : `${seenGroupKeys.size}/${totalFacts} fact groups`;

    return {
      factor,
      totalFacts,
      detailLabel,
      accuracy,
      seenFacts: seenGroupKeys.size,
      ...totals,
      ...getTableStatus({
        attempts: totals.attempts,
        accuracy,
      }),
    };
  });
}

function getDigitBucket(value) {
  const magnitude = Math.abs(Number(value));
  if (magnitude <= 9) {
    return 1;
  }
  if (magnitude <= 99) {
    return 2;
  }
  return 3;
}

function hasAdditionRegrouping(left, right) {
  const sum = left + right;
  // Sums of exactly 10 are the Make 10 skill, taught before regrouping, so they count as no-regrouping.
  if (sum === 10) {
    return false;
  }

  let carry = 0;
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (a > 0 || b > 0) {
    const column = (a % 10) + (b % 10) + carry;
    if (column >= 10) {
      return true;
    }
    carry = Math.floor(column / 10);
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }

  return false;
}

function getAdditionTrackerBucketKey(left, right) {
  const sum = left + right;
  if (sum === 10 && !(left === 0 && right === 0)) {
    return "make-10";
  }

  const first = getDigitBucket(left);
  const second = getDigitBucket(right);
  const low = Math.min(first, second);
  const high = Math.max(first, second);
  return `${low}-${high}`;
}

function getSubtractionTrackerBucketKey(left, right) {
  const leftDigits = getDigitBucket(left);
  const rightDigits = getDigitBucket(right);
  return `${leftDigits}-${rightDigits}`;
}

function buildAdditionTrackerStats() {
  const summary = Object.fromEntries(
    ADDITION_TRACKER_BUCKETS.map((bucket) => [
      bucket.key,
      {
        attempts: 0,
        correct: 0,
        regroupAttempts: 0,
        regroupCorrect: 0,
        noRegroupAttempts: 0,
        noRegroupCorrect: 0,
      },
    ]),
  );

  const additionFacts = getFactEntriesByOperation("addition");
  additionFacts.forEach((fact) => {
    if (!fact.attempts) {
      return;
    }

    const bucketKey = getAdditionTrackerBucketKey(fact.left, fact.right);
    if (!summary[bucketKey]) {
      return;
    }

    const bucket = summary[bucketKey];
    bucket.attempts += fact.attempts;
    bucket.correct += fact.correct;

    const regrouping = hasAdditionRegrouping(fact.left, fact.right);
    if (regrouping) {
      bucket.regroupAttempts += fact.attempts;
      bucket.regroupCorrect += fact.correct;
    } else {
      bucket.noRegroupAttempts += fact.attempts;
      bucket.noRegroupCorrect += fact.correct;
    }
  });

  return summary;
}

function getRatioLabel(correct, attempts) {
  if (!attempts) {
    return "No attempts yet";
  }
  return `${correct} / ${attempts} (${formatPercent(getAccuracy(correct, attempts))})`;
}

function getAdditionMetricSummary(bucket, detailMode) {
  if (detailMode === "with-regrouping") {
    return {
      key: "with-regrouping",
      label: "With regrouping",
      attempts: bucket.regroupAttempts,
      correct: bucket.regroupCorrect,
    };
  }

  if (detailMode === "without-regrouping") {
    return {
      key: "without-regrouping",
      label: "Without regrouping",
      attempts: bucket.noRegroupAttempts,
      correct: bucket.noRegroupCorrect,
    };
  }

  return {
    key: "overall",
    label: "Overall",
    attempts: bucket.attempts,
    correct: bucket.correct,
  };
}

function getAdditionBucketExamples(bucketKey, detailMode = "overall") {
  const source = Array.isArray(state.progress.additionBucketExamples?.[bucketKey])
    ? state.progress.additionBucketExamples[bucketKey]
    : [];

  const filtered =
    detailMode === "with-regrouping"
      ? source.filter((entry) => entry.regrouping)
      : detailMode === "without-regrouping"
        ? source.filter((entry) => !entry.regrouping)
        : source;

  return filtered.slice(0, ADDITION_BUCKET_EXAMPLE_DISPLAY_LIMIT);
}

function getAdditionTrackerFlipKey(bucketKey, detailMode) {
  return `${detailMode}:${bucketKey}`;
}

function isAdditionTrackerBucketFlipped(bucketKey, detailMode) {
  return Boolean(state.additionTrackerFlipMap?.[getAdditionTrackerFlipKey(bucketKey, detailMode)]);
}

function toggleAdditionTrackerBucketFlip(bucketKey, detailMode) {
  const key = getAdditionTrackerFlipKey(bucketKey, detailMode);
  const nextMap = {
    ...(state.additionTrackerFlipMap || {}),
  };
  nextMap[key] = !nextMap[key];
  state.additionTrackerFlipMap = nextMap;
}

function formatAdditionExampleEquation(entry) {
  const left = Number(entry.left);
  const right = Number(entry.right);
  const answer = left + right;
  return `${left} + ${right} = ${answer}`;
}

function buildSubtractionTrackerStats() {
  const summary = Object.fromEntries(
    SUBTRACTION_TRACKER_BUCKETS.map((bucket) => [
      bucket.key,
      {
        attempts: 0,
        correct: 0,
      },
    ]),
  );

  const subtractionFacts = getFactEntriesByOperation("subtraction");
  subtractionFacts.forEach((fact) => {
    if (!fact.attempts) {
      return;
    }
    const bucketKey = getSubtractionTrackerBucketKey(fact.left, fact.right);
    if (!SUBTRACTION_TRACKER_BUCKET_KEYS.has(bucketKey) || !summary[bucketKey]) {
      return;
    }
    summary[bucketKey].attempts += fact.attempts;
    summary[bucketKey].correct += fact.correct;
  });

  return summary;
}

function buildDivisionTrackerStats() {
  const summary = Object.fromEntries(
    TABLE_FACTORS.map((factor) => [
      factor,
      {
        attempts: 0,
        correct: 0,
      },
    ]),
  );

  const divisionFacts = getFactEntriesByOperation("division");
  divisionFacts.forEach((fact) => {
    if (!fact.attempts) {
      return;
    }
    const divisor = clampNumber(Number(fact.right), 1, FACTOR_LIMIT, 1);
    if (!summary[divisor]) {
      return;
    }
    summary[divisor].attempts += fact.attempts;
    summary[divisor].correct += fact.correct;
  });

  return summary;
}
