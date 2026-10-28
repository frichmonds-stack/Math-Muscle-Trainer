function startAdditionTrackerTraining(bucketKey, detailMode) {
  const bucketDifficultyMap = {
    "make-10": ["easy"],
    "1-1": ["easy"],
    "1-2": ["medium"],
    "2-2": ["medium"],
    "1-3": ["hard"],
    "2-3": ["hard"],
    "3-3": ["hard"],
  };
  const additionDifficulties = bucketDifficultyMap[bucketKey] || ["easy"];
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "addition",
    sessionType: "question-goal",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    additionDifficulty: additionDifficulties[0],
    additionDifficulties,
    additionRegrouping: detailMode !== "without-regrouping",
    negativesMode: false,
  });
  toggleSetupFields();
  requestView("setup");
}

function inferSubtractionDifficulty(entry) {
  const leftDigits = String(Math.abs(Number(entry.left) || 0)).length;
  const rightDigits = String(Math.abs(Number(entry.right) || 0)).length;
  if (leftDigits <= 1 && rightDigits <= 1) {
    return "easy";
  }
  if (leftDigits <= 2 && rightDigits <= 2) {
    return "medium";
  }
  return "hard";
}

function startGenericTrackerTraining(operation, entry) {
  if (operation === "subtraction") {
    const subtractionDifficulty = inferSubtractionDifficulty(entry);
    applySettingsSnapshot({
      ...getFormSettingsSnapshot(),
      operation: "subtraction",
      sessionType: "question-goal",
      questionPreset: "20",
      questionTarget: 20,
      timePreset: "3",
      timeLimitMinutes: 3,
      subtractionDifficulty,
      subtractionDifficulties: [subtractionDifficulty],
      negativesMode: false,
    });
    toggleSetupFields();
    requestView("setup");
    return;
  }

  if (operation === "division") {
    const divisor = clampNumber(Number(entry.right), 1, FACTOR_LIMIT, 2);
    applySettingsSnapshot({
      ...getFormSettingsSnapshot(),
      operation: "division",
      sessionType: "isolation",
      questionPreset: "20",
      questionTarget: 20,
      timePreset: "3",
      timeLimitMinutes: 3,
      focusFactor: divisor,
      minFactor: 1,
      maxFactor: FACTOR_LIMIT,
      negativesMode: false,
    });
    toggleSetupFields();
    requestView("setup");
  }
}

function startSubtractionTrackerTraining(bucketKey) {
  const bucketDifficultyMap = {
    "1-1": ["easy"],
    "2-1": ["medium"],
    "2-2": ["medium"],
    "3-1": ["hard"],
    "3-2": ["hard"],
    "3-3": ["hard"],
  };
  const subtractionDifficulties = bucketDifficultyMap[bucketKey] || ["easy"];
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "subtraction",
    sessionType: "question-goal",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    subtractionDifficulty: subtractionDifficulties[0],
    subtractionDifficulties,
    negativesMode: false,
  });
  toggleSetupFields();
  requestView("setup");
}

function startDivisionTrackerTraining(factor) {
  const safeFactor = clampNumber(Number(factor), 1, FACTOR_LIMIT, 1);
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "division",
    sessionType: "isolation",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    focusFactor: safeFactor,
    minFactor: 1,
    maxFactor: FACTOR_LIMIT,
    negativesMode: false,
  });
  toggleSetupFields();
  requestView("setup");
}

function renderSubtractionTracker() {
  updateFactTrackerRangeControls(false);
  const statsByBucket = buildSubtractionTrackerStats();
  elements.tableGrid.classList.add("addition-table-grid");
  elements.tableGrid.innerHTML = SUBTRACTION_TRACKER_BUCKETS.map((bucketMeta) => {
    const bucket = statsByBucket[bucketMeta.key];
    const attempts = bucket?.attempts || 0;
    const correct = bucket?.correct || 0;
    const accuracy = attempts ? correct / attempts : 0;
    const status = getBucketStatus(attempts, accuracy);
    return `
      <article
        class="table-card ${status.tone}"
        data-train-subtraction-bucket="${bucketMeta.key}"
        role="button"
        tabindex="0"
      >
        <div class="table-card-top table-zone table-zone-head">
          <div class="table-name">${bucketMeta.label}</div>
          <span class="table-pill ${status.tone}">${status.label}</span>
        </div>
        <div class="fact-meta table-card-middle table-zone table-zone-summary">
          ${correct} / ${attempts} correct
        </div>
        <div class="bar-track table-zone table-zone-progress" aria-hidden="true">
          <div class="bar-fill ${status.tone}" style="width: ${Math.round(accuracy * 100)}%"></div>
        </div>
        <div class="table-card-stats table-zone table-zone-footer">
          <span>${formatPercent(accuracy)} accuracy</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderDivisionTracker() {
  updateFactTrackerRangeControls(true);
  elements.tableGrid.classList.add("multiplication-table-grid");
  const statsByFactor = buildDivisionTrackerStats();
  const activeRange = FACT_TRACKER_MULTIPLICATION_RANGES[clampFactTrackerRangeIndex(state.factTrackerRangeIndex)];
  const visibleFactors = TABLE_FACTORS.filter(
    (factor) => factor >= activeRange.minFactor && factor <= activeRange.maxFactor,
  );

  elements.tableGrid.innerHTML = visibleFactors.map((factor) => {
    const bucket = statsByFactor[factor] || { attempts: 0, correct: 0 };
    const attempts = bucket.attempts || 0;
    const correct = bucket.correct || 0;
    const accuracy = attempts ? correct / attempts : 0;
    const status = getBucketStatus(attempts, accuracy);
    return `
      <article
          class="table-card ${status.tone}"
          data-train-division-factor="${factor}"
          role="button"
          tabindex="0"
        >
          <div class="table-card-top table-zone table-zone-head">
          <div class="table-name">${getOperationDisplaySymbol("division")} ${factor}</div>
          <span class="table-pill ${status.tone}">${status.label}</span>
          </div>
        <div class="fact-meta table-card-middle table-zone table-zone-summary">
          ${correct} / ${attempts} correct
        </div>
        <div class="bar-track table-zone table-zone-progress" aria-hidden="true">
          <div class="bar-fill ${status.tone}" style="width: ${Math.round(accuracy * 100)}%"></div>
        </div>
        <div class="table-card-stats table-zone table-zone-footer">
          <span>${formatPercent(accuracy)} accuracy</span>
        </div>
      </article>
    `;
  }).join("");
}

function startMultiplicationTrackerTraining(factor, detailMode) {
  applySettingsSnapshot({
    ...getFormSettingsSnapshot(),
    operation: "multiplication",
    sessionType: "isolation",
    questionPreset: "20",
    questionTarget: 20,
    timePreset: "3",
    timeLimitMinutes: 3,
    focusFactor: factor,
    minFactor: 1,
    maxFactor: FACTOR_LIMIT,
    negativesMode: detailMode === "all-integers",
  });
  toggleSetupFields();
  requestView("setup");
}

function renderAdditionTracker(detailMode = "overall") {
  const activeMode =
    detailMode === "with-regrouping" || detailMode === "without-regrouping"
      ? detailMode
      : "overall";
  const statsByBucket = buildAdditionTrackerStats();
  elements.tableGrid.classList.add("addition-table-grid");

  elements.tableGrid.innerHTML = ADDITION_TRACKER_BUCKETS.map((bucketMeta) => {
    const bucket = statsByBucket[bucketMeta.key];
    const metric = getAdditionMetricSummary(bucket, activeMode);
    const ratio = metric.attempts ? metric.correct / metric.attempts : 0;
    const status = getBucketStatus(metric.attempts, ratio);
    const examples = getAdditionBucketExamples(bucketMeta.key, activeMode);
    const flipped = isAdditionTrackerBucketFlipped(bucketMeta.key, activeMode);
    const examplesMarkup = examples.length
      ? `
        <ul class="addition-example-list">
          ${examples
            .map(
              (entry) =>
                `<li class="addition-example-item">${formatAdditionExampleEquation(entry)}</li>`,
            )
            .join("")}
        </ul>
      `
      : `<div class="fact-meta addition-example-empty">No recent examples yet.</div>`;

    return `
      <article
        class="table-card addition-bucket-card ${status.tone} ${flipped ? "is-flipped" : ""}"
        data-addition-bucket="${bucketMeta.key}"
        data-addition-detail="${activeMode}"
        role="button"
        tabindex="0"
        aria-pressed="${flipped ? "true" : "false"}"
        aria-label="${flipped ? "Show summary" : "Show recent examples"} for ${bucketMeta.label}"
      >
        <div class="addition-bucket-face addition-bucket-front">
          <div class="addition-bucket-head">
            <div class="addition-bucket-title-row">
              <div class="table-name">${bucketMeta.label}</div>
              <button class="addition-card-toggle-button" type="button" data-addition-toggle="${bucketMeta.key}" data-addition-detail="${activeMode}" aria-label="More information">
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <circle cx="8" cy="3.6" r="1.8" fill="currentColor" />
                  <rect x="6.9" y="6.1" width="2.2" height="6.1" rx="1.1" fill="currentColor" />
                </svg>
              </button>
            </div>
            <span class="table-pill ${status.tone}">${status.label}</span>
          </div>
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill ${status.tone}" style="width: ${Math.round(ratio * 100)}%"></div>
          </div>
          <div class="table-card-stats">
            <span>${getRatioLabel(metric.correct, metric.attempts)}</span>
          </div>
        </div>
        <div class="addition-bucket-face addition-bucket-back">
          <div class="addition-bucket-head">
            <div class="addition-bucket-title-row">
              <div class="table-name">${bucketMeta.label}</div>
              <button class="addition-card-toggle-button" type="button" data-addition-toggle="${bucketMeta.key}" data-addition-detail="${activeMode}" aria-label="Return to summary">
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <circle cx="8" cy="3.6" r="1.8" fill="currentColor" />
                  <rect x="6.9" y="6.1" width="2.2" height="6.1" rx="1.1" fill="currentColor" />
                </svg>
              </button>
            </div>
            <span class="table-pill subtle-chip">Recent</span>
          </div>
          ${examplesMarkup}
        </div>
      </article>
    `;
  }).join("");
}

function handleAdditionTrackerCardClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  const toggleButton = target.closest("[data-addition-toggle]");
  if (toggleButton instanceof HTMLElement) {
    const bucketKey = toggleButton.dataset.additionToggle || "";
    const detailMode = toggleButton.dataset.additionDetail || "overall";
    if (!bucketKey) {
      return;
    }
    toggleAdditionTrackerBucketFlip(bucketKey, detailMode);
    renderAdditionTracker(getFactDetailFilterValue());
    return;
  }

  const card = target.closest("[data-addition-bucket]");
  if (card instanceof HTMLElement) {
    const bucketKey = card.dataset.additionBucket || "";
    const detailMode = card.dataset.additionDetail || "overall";
    if (!bucketKey) {
      return;
    }
    startAdditionTrackerTraining(bucketKey, detailMode);
    return;
  }

  const multiplicationCard = target.closest("[data-train-multiplication]");
  if (multiplicationCard instanceof HTMLElement) {
    const factor = clampNumber(Number(multiplicationCard.dataset.trainMultiplication), 1, FACTOR_LIMIT, 1);
    const detailMode = multiplicationCard.dataset.trainDetail || "overall";
    startMultiplicationTrackerTraining(factor, detailMode);
    return;
  }

  const subtractionBucketCard = target.closest("[data-train-subtraction-bucket]");
  if (subtractionBucketCard instanceof HTMLElement) {
    const bucketKey = subtractionBucketCard.dataset.trainSubtractionBucket || "";
    if (bucketKey) {
      startSubtractionTrackerTraining(bucketKey);
      return;
    }
  }

  const divisionCard = target.closest("[data-train-division-factor]");
  if (divisionCard instanceof HTMLElement) {
    const factor = clampNumber(Number(divisionCard.dataset.trainDivisionFactor), 1, FACTOR_LIMIT, 1);
    startDivisionTrackerTraining(factor);
    return;
  }

  const genericCard = target.closest("[data-train-operation]");
  if (!(genericCard instanceof HTMLElement)) {
    return;
  }
  const operation = genericCard.dataset.trainOperation || "";
  const entry = {
    left: Number(genericCard.dataset.trainLeft),
    right: Number(genericCard.dataset.trainRight),
    answer: Number(genericCard.dataset.trainAnswer),
  };
  if (operation === "subtraction" || operation === "division") {
    startGenericTrackerTraining(operation, entry);
  }
}

function handleAdditionTrackerCardKeydown(event) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  if (target.closest("[data-addition-toggle]")) {
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  const card =
    target.closest(
      "[data-addition-bucket], [data-train-subtraction-bucket], [data-train-multiplication], [data-train-division-factor], [data-train-operation]",
    );
  if (!(card instanceof HTMLElement)) {
    return;
  }
  card.click();
}

function getAdditionTechniqueCardStatus(lesson) {
  if (!lesson.selectable) {
    return {
      classes: "",
      pill: "Coming Soon",
      note: lesson.description || "Coming soon.",
    };
  }

  const progress = getTechniqueProgressRecord(`addition:${lesson.id}`);
  if (progress.completed) {
    return {
      classes: " is-completed",
      pill: "",
      note: "Review lesson.",
    };
  }

  return {
    classes: " is-active",
    pill: "",
    note: lesson.description,
  };
}

function getAdditionTechniqueGridMarkup() {
  return ADDITION_LESSONS.map((lesson, index) => {
    const status = getAdditionTechniqueCardStatus(lesson);

    return `
      <button
        class="technique-card${status.classes}"
        type="button"
        data-addition-technique="${lesson.id}"
        data-swiper-page="${Math.floor(index / 6) + 1}"
        ${lesson.selectable ? "" : "disabled"}
      >
        ${status.pill ? `<span class="technique-card-pill">${status.pill}</span>` : ""}
        <strong>${escapeHtml(lesson.title)}</strong>
        <span class="technique-card-note">${escapeHtml(status.note)}</span>
      </button>
    `;
  }).join("");
}

function renderTableRadar() {
  const factOperation = getFactOperationFilterValue();
  const factDetail = getFactDetailFilterValue();
  updateFactSelectorCarouselState();
  elements.tableGrid.classList.remove("multiplication-table-grid");
  elements.tableGrid.classList.remove("addition-table-grid");
  if (elements.factsSlideTitle) {
    const operationCopy =
      factOperation === "addition"
        ? "addition"
        : factOperation === "multiplication"
          ? "multiplication"
          : factOperation === "subtraction"
            ? "subtraction"
            : factOperation === "division"
              ? "division"
              : "";
    elements.factsSlideTitle.textContent = operationCopy
      ? `Track your ${operationCopy} skills.`
      : "Track your skills.";
  }
  if (elements.trackerActionHint) {
    elements.trackerActionHint.textContent =
      factOperation === "addition"
        ? "Click a category to train it. Click the i for more information."
        : "Click a category to train it.";
  }

  if (factOperation === "addition") {
    updateFactTrackerRangeControls(false);
    renderAdditionTracker(factDetail);
    return;
  }

  if (factOperation === "subtraction" || factOperation === "division") {
    if (factOperation === "subtraction") {
      renderSubtractionTracker();
    } else {
      renderDivisionTracker();
    }
    return;
  }

  updateFactTrackerRangeControls(true);
  elements.tableGrid.classList.add("multiplication-table-grid");

  const tableStats = getTableStats(factDetail);
  if (!tableStats.some((table) => table.attempts > 0)) {
    const emptyDetailCopy =
      factDetail === "positive"
        ? "No positive-integer attempts yet."
        : factDetail === "all-integers"
          ? "No signed-integer attempts yet."
          : "The fact tracker fills in after you answer a few facts.";
    elements.tableGrid.innerHTML = `
      <div class="table-card unseen">
        <div class="table-name">Start a workout</div>
        <div class="fact-meta">${emptyDetailCopy}</div>
      </div>
    `;
    return;
  }

  const activeRange = FACT_TRACKER_MULTIPLICATION_RANGES[clampFactTrackerRangeIndex(state.factTrackerRangeIndex)];
  const visibleTables = tableStats.filter(
    (table) => table.factor >= activeRange.minFactor && table.factor <= activeRange.maxFactor,
  );

  elements.tableGrid.innerHTML = visibleTables
    .map((table) => {
      const accuracyLabel = table.attempts
        ? `${formatPercent(table.accuracy)} accuracy`
        : "No attempts yet";
      const detailLabel = table.attempts ? table.detailLabel : "Fresh range";

      return `
        <article
          class="table-card ${table.tone}"
          data-train-multiplication="${table.factor}"
          data-train-detail="${factDetail}"
          role="button"
          tabindex="0"
        >
          <div class="table-card-top table-zone table-zone-head">
            <div class="table-name">x ${table.factor}</div>
            <span class="table-pill ${table.tone}">${table.label}</span>
          </div>
          <div class="fact-meta table-card-middle table-zone table-zone-summary">${detailLabel}</div>
          <div class="bar-track table-zone table-zone-progress" aria-hidden="true">
            <div class="bar-fill ${table.tone}" style="width: ${Math.round(table.accuracy * 100)}%"></div>
          </div>
          <div class="table-card-stats table-zone table-zone-footer">
            <span>${accuracyLabel}</span>
          </div>
        </article>
      `;
    })
    .join("");
}
