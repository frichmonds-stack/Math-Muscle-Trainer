(function () {
  const DEBUG_PASSWORD = "N0v4r3";
  const DEBUG_UNLOCK_KEY = "math-muscle-trainer-debug-unlocked-v1";
  const DEBUG_PREVIEW_KEY = "math-muscle-trainer-debug-preview-v1";
  const DEBUG_PARAMS = new URLSearchParams(window.location.search);
  // The screen-size preview shows the app in an iframe at an exact device size. The framed copy
  // loads with debugPreview=1 and is driven from the parent page's debug panel.
  const IS_PREVIEW_FRAME = DEBUG_PARAMS.get("debugPreview") === "1";
  const DEBUG_ENABLED =
    !IS_PREVIEW_FRAME &&
    (DEBUG_PARAMS.get("debug") === "1" || window.location.hash.toLowerCase() === "#debug");
  // Keep in step with tools/visual-check/lib/viewports.js (checked by tests/viewports.test.js).
  const DEBUG_PREVIEW_SIZES = [
    { key: "phone-small", label: "Small phone", width: 375, height: 667, touch: true },
    { key: "phone", label: "Phone", width: 390, height: 844, touch: true },
    { key: "phone-landscape", label: "Phone landscape", width: 844, height: 390, touch: true },
    { key: "ipad-portrait", label: "iPad portrait", width: 820, height: 1180, touch: true },
    { key: "ipad-landscape", label: "iPad landscape", width: 1180, height: 820, touch: true },
    { key: "laptop", label: "Laptop", width: 1366, height: 768, touch: false },
    { key: "desktop", label: "Desktop", width: 1920, height: 1080, touch: false },
  ];
  let debugRequested = DEBUG_ENABLED;
  let previewSettings = { size: null, touch: false };
  let previewWasShown = false;

  function isUnlocked() {
    try {
      return window.sessionStorage.getItem(DEBUG_UNLOCK_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      window.sessionStorage.setItem(DEBUG_UNLOCK_KEY, "true");
    } catch (error) {
      // Session storage can be unavailable in some browser modes.
    }
  }

  function clearUnlocked() {
    try {
      window.sessionStorage.removeItem(DEBUG_UNLOCK_KEY);
    } catch (error) {
      // Session storage can be unavailable in some browser modes.
    }
  }

  function refreshAppAfterDebugChange() {
    state.displayMonthKey = getMonthKey(getCurrentMonthDate());
    renderDailyProgress();
    renderOverall();
    renderMasterySystem();
    renderFocusAreas();
    renderWorkoutHistory();
    renderCoachTip();
    renderTableRadar();
    renderCalendars();
    renderStreakPanel();
    renderHomeWeeklyStrip();
    renderHomeRepsGraph();
    const weekly = getLastSevenDailyRecords().reduce(
      (summary, day) => ({
        attempted: summary.attempted + Number(day.record?.attempted || 0),
        correct: summary.correct + Number(day.record?.correct || 0),
      }),
      { attempted: 0, correct: 0 },
    );
    renderHomeAccuracyVisual(getAccuracy(weekly.correct, weekly.attempted));
    renderResultsCarousel();
    renderProgressCarousel();
  }

  function getDateKeyDaysAgo(daysAgo) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);
    return formatDateKey(date);
  }

  function getTimestampForDateKey(dateKey, offsetMinutes = 0) {
    return new Date(`${dateKey}T12:00:00`).getTime() + offsetMinutes * 60000;
  }

  function getDebugFactParts(operation, index) {
    if (operation === "addition") {
      return { left: index + 3, right: 10 - ((index + 3) % 10 || 10) };
    }
    if (operation === "subtraction") {
      return { left: index + 12, right: (index % 8) + 3 };
    }
    if (operation === "division") {
      const divisor = (index % 12) + 1;
      const quotient = (index % 10) + 2;
      return { left: divisor * quotient, right: divisor };
    }
    return { left: (index % 12) + 1, right: ((index + 6) % 12) + 1 };
  }

  function getDebugFactKey(operation, left, right) {
    return `${operation}:${left}${getOperationStorageSymbol(operation)}${right}`;
  }

  function createDebugFactProgress(operation, index, attempts, accuracy, averageMs, timestamp) {
    const { left, right } = getDebugFactParts(operation, index);
    const correct = Math.max(0, Math.min(attempts, Math.round(attempts * accuracy)));
    const factKey = getDebugFactKey(operation, left, right);
    return [
      factKey,
      normaliseFactProgressEntry(factKey, {
        operation,
        attempts,
        correct,
        magnitudeCorrect: correct,
        signCorrect: correct,
        misses: attempts - correct,
        currentStreak: Math.min(correct, 6),
        bestStreak: Math.min(correct, 10),
        averageMs,
        firstSeenAt: timestamp - 86400000 * 6,
        lastSeenAt: timestamp,
      }),
    ];
  }

  function createDebugTelemetry(operation, dateKey, count, accuracy, averageMs, options = {}) {
    const entries = [];
    const offset = options.offset || 0;
    const difficultyBand = options.difficultyBand || "standard";
    for (let index = 0; index < count; index += 1) {
      const { left, right } = getDebugFactParts(operation, index + offset);
      const factKey = getDebugFactKey(operation, left, right);
      const correct = index < Math.round(count * accuracy);
      entries.push({
        id: `debug-${operation}-${dateKey}-${index}-${offset}`,
        sessionId: `debug-${operation}-${dateKey}`,
        sessionSource: "debug-persona",
        sessionPosition: index + 1,
        operation,
        factKey,
        skillKey: getLearningSkillKey({ operation, a: left, b: right }),
        difficultyBand,
        correct,
        skipped: false,
        responseTimeMs: correct ? averageMs + (index % 5) * 120 : averageMs + 900,
        timestamp: getTimestampForDateKey(dateKey, index + offset),
        dateKey,
      });
    }
    return entries;
  }

  function createDebugWorkout(operation, dateKey, attempted, accuracy, averageMs, index, modeKey = "question-goal") {
    const correct = Math.round(attempted * accuracy);
    return normaliseWorkoutRecord({
      id: `debug-workout-${operation}-${dateKey}-${index}`,
      operation,
      modeKey,
      modeLabel: modeKey === "timed" ? "H.I.T" : "Target Reps",
      dateKey,
      recordedAt: getTimestampForDateKey(dateKey, 40 + index),
      attempted,
      correct,
      accuracy,
      skipped: Math.max(0, attempted - correct - 1),
      bestStreak: Math.max(1, Math.min(correct, Math.round(correct / 2))),
      averageMs,
      medianMs: averageMs,
      fastCorrect: Math.round(correct * 0.45),
      sessionSource: "debug-persona",
      reason: "debug",
      freeTrainingMode: "zen",
      timeLimitMinutes: modeKey === "timed" ? 1 : 0,
    });
  }

  function createDebugProgressPersona(persona) {
    const progress = defaultProgress();
    const facts = {};
    const telemetry = [];
    const workouts = [];
    const dayPlans = [];

    if (persona === "new-user") {
      return progress;
    }

    if (persona === "division-struggler") {
      dayPlans.push(
        { operation: "addition", attempted: 32, accuracy: 0.9, averageMs: 2700 },
        { operation: "multiplication", attempted: 34, accuracy: 0.88, averageMs: 3100 },
        { operation: "division", attempted: 28, accuracy: 0.54, averageMs: 6800 },
        { operation: "division", attempted: 26, accuracy: 0.58, averageMs: 6400 },
        { operation: "subtraction", attempted: 24, accuracy: 0.8, averageMs: 4200 },
      );
    } else if (persona === "multiplication-specialist") {
      dayPlans.push(
        { operation: "multiplication", attempted: 45, accuracy: 0.94, averageMs: 2300, difficultyBand: "hard" },
        { operation: "multiplication", attempted: 42, accuracy: 0.92, averageMs: 2500, difficultyBand: "hard" },
        { operation: "addition", attempted: 20, accuracy: 0.84, averageMs: 3300 },
        { operation: "division", attempted: 18, accuracy: 0.7, averageMs: 5200 },
      );
    } else if (persona === "power-user") {
      OPERATION_OPTIONS.forEach((operation, operationIndex) => {
        for (let day = 0; day < 7; day += 1) {
          dayPlans.push({
            operation,
            attempted: 24 + operationIndex * 4,
            accuracy: 0.86 + operationIndex * 0.02,
            averageMs: 2600 + operationIndex * 280,
            difficultyBand: day % 2 === 0 ? "hard" : "medium",
          });
        }
      });
      progress.techniques = {
        2: { completed: true },
        5: { completed: true },
        10: { completed: true },
        "addition:make-10": { completed: true },
        "addition:add-by-10": { completed: true },
      };
    } else {
      dayPlans.push(
        { operation: "addition", attempted: 20, accuracy: 0.82, averageMs: 3900 },
        { operation: "subtraction", attempted: 18, accuracy: 0.72, averageMs: 4700 },
        { operation: "multiplication", attempted: 22, accuracy: 0.78, averageMs: 4300 },
        { operation: "division", attempted: 16, accuracy: 0.69, averageMs: 5600 },
        { operation: "addition", attempted: 20, accuracy: 0.86, averageMs: 3600 },
      );
      progress.techniques = {
        "addition:make-10": { completed: true },
      };
    }

    for (let dayOffset = 8; dayOffset <= 42; dayOffset += 3) {
      const operation = OPERATION_OPTIONS[dayOffset % OPERATION_OPTIONS.length];
      const wave = dayOffset % 5;
      dayPlans.push({
        operation,
        attempted: 12 + wave * 4,
        accuracy: 0.66 + wave * 0.05,
        averageMs: 5200 - wave * 340,
        difficultyBand: wave >= 3 ? "medium" : "standard",
        dateOffset: dayOffset,
      });
    }

    dayPlans.forEach((plan, index) => {
      const dateKey = getDateKeyDaysAgo(Number.isFinite(plan.dateOffset) ? plan.dateOffset : index % 7);
      const correct = Math.round(plan.attempted * plan.accuracy);
      const existing = progress.dailyRecords[dateKey] || defaultDailyRecord();
      progress.dailyRecords[dateKey] = normaliseDailyRecord({
        attempted: existing.attempted + plan.attempted,
        correct: existing.correct + correct,
        skipped: existing.skipped,
        sessionsCompleted: existing.sessionsCompleted + 1,
      });
      workouts.push(createDebugWorkout(
        plan.operation,
        dateKey,
        plan.attempted,
        plan.accuracy,
        plan.averageMs,
        index,
        index % 3 === 0 ? "timed" : "question-goal",
      ));
      telemetry.push(
        ...createDebugTelemetry(
          plan.operation,
          dateKey,
          plan.attempted,
          plan.accuracy,
          plan.averageMs,
          { offset: index * 3, difficultyBand: plan.difficultyBand },
        ),
      );

      for (let factIndex = 0; factIndex < Math.min(12, Math.ceil(plan.attempted / 3)); factIndex += 1) {
        const [factKey, factProgress] = createDebugFactProgress(
          plan.operation,
          factIndex + index,
          6 + (factIndex % 6),
          plan.accuracy,
          plan.averageMs,
          getTimestampForDateKey(dateKey, factIndex),
        );
        facts[factKey] = factProgress;
      }
    });

    progress.workoutHistory = workouts.sort((left, right) => right.recordedAt - left.recordedAt).slice(0, 50);
    progress.answerTelemetry = normaliseAnswerTelemetry(telemetry);
    progress.facts = compactFactProgressMap(facts);
    progress.totalAnswered = progress.answerTelemetry.length;
    progress.totalAttempted = progress.totalAnswered;
    progress.totalCorrect = progress.answerTelemetry.filter((entry) => entry.correct).length;
    progress.totalSkipped = 0;
    progress.sessionsCompleted = progress.workoutHistory.length;
    progress.bestStreak = Math.max(
      0,
      ...progress.workoutHistory.map((record) => record.bestStreak || 0),
    );
    progress.bestAccuracy = Math.max(
      0,
      ...progress.workoutHistory.map((record) => record.accuracy || 0),
    );
    const responseTimes = progress.answerTelemetry
      .filter((entry) => entry.correct && entry.responseTimeMs !== null)
      .map((entry) => entry.responseTimeMs);
    progress.fastestAverageMs = responseTimes.length ? Math.min(...responseTimes) : null;
    return pruneProgressForRollingWindow(syncProgressMetricAliases(progress));
  }

  function setDebugStatus(message) {
    const status = document.querySelector("[data-debug-status]");
    if (status) {
      status.textContent = message;
    }
  }

  function loadDebugPersona(persona) {
    state.progress = createDebugProgressPersona(persona);
    saveProgress();
    refreshAppAfterDebugChange();
    setDebugStatus(`Loaded ${persona.replace(/-/g, " ")}.`);
  }

  function clearDebugProgress() {
    const shouldClear = window.confirm("Clear saved progress on this browser?");
    if (!shouldClear) {
      return;
    }
    state.progress = defaultProgress();
    saveProgress();
    refreshAppAfterDebugChange();
    setDebugStatus("Progress cleared.");
  }

  function startDebugWorkout(operation, sessionType = "question-goal") {
    const settings = sanitiseSettingsSnapshot({
      ...defaultSettingsSnapshot(),
      operation,
      sessionType,
      questionPreset: sessionType === "question-goal" ? "custom" : "20",
      questionTarget: 20,
      timePreset: sessionType === "timed" ? "1" : "3",
      timeLimitMinutes: sessionType === "timed" ? 1 : 3,
      freeTrainingMode: "zen",
      minFactor: 1,
      maxFactor: operation === "multiplication" || operation === "division" ? 12 : 10,
      focusFactor: operation === "division" ? 7 : 10,
      additionDifficulty: "medium",
      additionDifficulties: ["easy", "medium"],
      subtractionDifficulty: "medium",
      subtractionDifficulties: ["easy", "medium"],
    });
    applySettingsSnapshot(settings);
    toggleSetupFields();
    startSession(settings);
    setDebugStatus(`Started ${operation} ${sessionType === "timed" ? "timed" : "target reps"} workout.`);
  }

  function openDebugPanel() {
    document.body.classList.add("debug-panel-open");
  }

  function closeDebugPanel() {
    document.body.classList.remove("debug-panel-open");
  }

  function exitDebugMode() {
    clearUnlocked();
    debugRequested = false;
    document.body.classList.remove("debug-mode", "debug-panel-open");
    document.querySelector("[data-debug-open]")?.remove();
    document.querySelector(".debug-panel")?.remove();
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("debug");
    if (cleanUrl.hash.toLowerCase() === "#debug") {
      cleanUrl.hash = "";
    }
    window.history.replaceState({}, "", cleanUrl.toString());
  }

  function applyDebugAppearance(theme, colorMode) {
    if (theme) {
      const nextTheme = sanitiseTheme(theme);
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    }
    if (colorMode) {
      const nextMode = sanitiseColorMode(colorMode);
      applyColorMode(nextMode);
      saveColorMode(nextMode);
    }
    const themeSelect = document.querySelector('[data-debug-select="theme"]');
    if (themeSelect instanceof HTMLSelectElement) {
      themeSelect.value = state.theme;
    }
    const colorModeSelect = document.querySelector('[data-debug-select="color-mode"]');
    if (colorModeSelect instanceof HTMLSelectElement) {
      colorModeSelect.value = state.colorMode;
    }
    setDebugStatus("Appearance updated.");
  }

  // Actions that change the app itself. While a preview is showing they run inside the preview.
  const PREVIEW_FORWARDED_ACTIONS = [
    "color-mode",
    "select-color-mode",
    "theme",
    "cycle-theme",
    "feedback",
    "clear-progress",
    "jump",
    "persona",
    "workout",
  ];

  function runDebugAction(action, data) {
    if (action === "color-mode") {
      applyDebugAppearance(null, data.debugColorMode || "light");
      return;
    }
    if (action === "cycle-theme") {
      const currentIndex = THEME_OPTIONS.findIndex((theme) => theme.key === state.theme);
      const nextTheme = THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length]?.key || "original";
      applyDebugAppearance(nextTheme, null);
      return;
    }
    if (action === "theme") {
      applyDebugAppearance(data.value, null);
      return;
    }
    if (action === "select-color-mode") {
      applyDebugAppearance(null, data.value);
      return;
    }
    if (action === "feedback") {
      if (typeof showFeedbackDialog === "function") {
        showFeedbackDialog();
      } else {
        window.alert("Put up your hand and tell Mr Foo");
      }
      setDebugStatus("Classroom feedback message shown.");
      return;
    }
    if (action === "clear-progress") {
      clearDebugProgress();
      return;
    }
    if (action === "jump") {
      requestView(data.debugView || "home");
      setDebugStatus(`Jumped to ${data.debugView || "home"}.`);
      return;
    }
    if (action === "persona") {
      loadDebugPersona(data.debugPersona || "active-week");
      return;
    }
    if (action === "workout") {
      startDebugWorkout(data.debugOperation || "addition", data.debugSession || "question-goal");
    }
  }

  // Run an app action in the preview when one is showing, otherwise on this page.
  function routeDebugAction(action, data, description) {
    const frame = document.querySelector("[data-debug-preview-frame]");
    if (!previewSettings.size || !frame || !PREVIEW_FORWARDED_ACTIONS.includes(action)) {
      runDebugAction(action, data);
      return;
    }
    try {
      frame.contentWindow.mathMuscleDebugPreview.run(action, data);
      setDebugStatus(`Preview: ${description}.`);
    } catch (error) {
      setDebugStatus("Could not reach the preview. Open the app through a web server (not as a file) to control it from here.");
    }
  }

  function handleDebugAction(event) {
    const button = event.target.closest("[data-debug-action]");
    if (!button) {
      return;
    }

    const action = button.dataset.debugAction;
    if (action === "close") {
      closeDebugPanel();
      return;
    }
    if (action === "exit-debug") {
      const reloadAfterPreview = previewWasShown;
      previewWasShown = false;
      setPreviewSettings({ size: null, touch: false });
      exitDebugMode();
      if (reloadAfterPreview) {
        // Reload after the debug flag has left the URL, so the page reopens as the normal app.
        window.location.reload();
      }
      return;
    }
    if (action === "preview-size") {
      const size = DEBUG_PREVIEW_SIZES.find((item) => item.key === button.dataset.debugSize);
      setPreviewSettings({ size: size ? size.key : null, touch: size ? size.touch : false });
      return;
    }
    if (action === "preview-touch") {
      setPreviewSettings({ ...previewSettings, touch: !previewSettings.touch });
      return;
    }
    if (action === "preview-reload") {
      document.querySelector("[data-debug-preview-frame]")?.contentWindow?.location.reload();
      return;
    }
    routeDebugAction(action, { ...button.dataset }, button.textContent.trim());
  }

  function handleDebugChange(event) {
    const select = event.target.closest("[data-debug-select]");
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }
    if (select.dataset.debugSelect === "theme") {
      routeDebugAction("theme", { value: select.value }, `palette ${select.value}`);
      return;
    }
    if (select.dataset.debugSelect === "color-mode") {
      routeDebugAction("select-color-mode", { value: select.value }, `${select.value} mode`);
    }
  }

  function loadPreviewSettings() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(DEBUG_PREVIEW_KEY) || "null");
      if (saved && DEBUG_PREVIEW_SIZES.some((item) => item.key === saved.size)) {
        return { size: saved.size, touch: Boolean(saved.touch) };
      }
    } catch (error) {
      // Saved preview settings are a convenience only.
    }
    return { size: null, touch: false };
  }

  function savePreviewSettings() {
    try {
      if (previewSettings.size) {
        window.localStorage.setItem(DEBUG_PREVIEW_KEY, JSON.stringify(previewSettings));
      } else {
        window.localStorage.removeItem(DEBUG_PREVIEW_KEY);
      }
    } catch (error) {
      // Local storage can be unavailable in some browser modes.
    }
  }

  function getPreviewFrameUrl(touch) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("debugPreview", "1");
    if (touch) {
      url.searchParams.set("debugTouch", "1");
    }
    return url.toString();
  }

  function setPreviewSettings(nextSettings) {
    previewSettings = nextSettings;
    savePreviewSettings();
    renderPreviewControls();
    if (!previewSettings.size) {
      document.querySelector("[data-debug-preview]")?.remove();
      document.body.classList.remove("debug-preview-active");
      if (previewWasShown) {
        // Progress, palette or mode may have changed inside the preview; reload to pick them up.
        window.location.reload();
      }
      return;
    }
    previewWasShown = true;
    let overlay = document.querySelector("[data-debug-preview]");
    if (!overlay) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
          <div class="debug-preview" data-debug-preview>
            <p class="debug-preview-label" data-debug-preview-label></p>
            <div class="debug-preview-device" data-debug-preview-device>
              <iframe title="App preview" data-debug-preview-frame></iframe>
            </div>
          </div>
        `,
      );
      overlay = document.querySelector("[data-debug-preview]");
    }
    document.body.classList.add("debug-preview-active");
    const frame = overlay.querySelector("[data-debug-preview-frame]");
    const frameUrl = getPreviewFrameUrl(previewSettings.touch);
    // Changing only the size keeps the preview's current screen; touch emulation needs a reload.
    if (frame.dataset.src !== frameUrl) {
      frame.dataset.src = frameUrl;
      frame.src = frameUrl;
    }
    layoutPreview();
  }

  function layoutPreview() {
    const overlay = document.querySelector("[data-debug-preview]");
    const size = DEBUG_PREVIEW_SIZES.find((item) => item.key === previewSettings.size);
    if (!overlay || !size) {
      return;
    }
    const label = overlay.querySelector("[data-debug-preview-label]");
    const device = overlay.querySelector("[data-debug-preview-device]");
    const frame = overlay.querySelector("[data-debug-preview-frame]");
    const availableWidth = window.innerWidth - 32;
    const availableHeight = window.innerHeight - label.offsetHeight - 40;
    const scale = Math.min(1, availableWidth / size.width, availableHeight / size.height);
    frame.style.width = `${size.width}px`;
    frame.style.height = `${size.height}px`;
    frame.style.transform = `scale(${scale})`;
    device.style.width = `${Math.floor(size.width * scale)}px`;
    device.style.height = `${Math.floor(size.height * scale)}px`;
    label.textContent = [
      size.label,
      `${size.width}\u00d7${size.height}`,
      previewSettings.touch ? "touch" : "mouse",
      scale < 1 ? `shown at ${Math.round(scale * 100)}%` : "actual size",
    ].join(" \u00b7 ");
  }

  function renderPreviewControls() {
    document.querySelectorAll('[data-debug-action="preview-size"]').forEach((button) => {
      const isActive = (button.dataset.debugSize || null) === (previewSettings.size || "off");
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    const touchButton = document.querySelector('[data-debug-action="preview-touch"]');
    if (touchButton) {
      touchButton.textContent = `Touch: ${previewSettings.touch ? "On" : "Off"}`;
      touchButton.setAttribute("aria-pressed", previewSettings.touch ? "true" : "false");
      touchButton.disabled = !previewSettings.size;
    }
    const reloadButton = document.querySelector('[data-debug-action="preview-reload"]');
    if (reloadButton) {
      reloadButton.disabled = !previewSettings.size;
    }
  }

  // Inside the preview: make the page behave as on a touch screen. Media queries for pointer and
  // hover are rewritten in place, and mouse presses are echoed as touch events so swipes work.
  function emulateTouchScreen() {
    const TRUE_QUERY = "(min-width: 0px)";
    const FALSE_QUERY = "(max-width: 0px)";
    const toTouchQuery = (query) =>
      query
        .replace(/\(\s*(any-)?pointer\s*:\s*coarse\s*\)/g, TRUE_QUERY)
        .replace(/\(\s*(any-)?pointer\s*:\s*fine\s*\)/g, FALSE_QUERY)
        .replace(/\(\s*(any-)?hover\s*:\s*hover\s*\)/g, FALSE_QUERY)
        .replace(/\(\s*(any-)?hover\s*:\s*none\s*\)/g, TRUE_QUERY);
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => nativeMatchMedia(toTouchQuery(String(query)));

    const rewriteRules = (rules) => {
      for (const rule of rules) {
        if (rule.media && typeof rule.media.mediaText === "string") {
          rule.media.mediaText = toTouchQuery(rule.media.mediaText);
        }
        if (rule.cssRules) {
          rewriteRules(rule.cssRules);
        }
      }
    };
    for (const sheet of document.styleSheets) {
      try {
        rewriteRules(sheet.cssRules);
      } catch (error) {
        // Browsers block stylesheet access for pages opened as files; media queries stay as they are.
      }
    }

    let touchTarget = null;
    const echoTouch = (type, event) => {
      if (event.button !== 0) {
        return;
      }
      try {
        const target = type === "touchstart" ? event.target : touchTarget || event.target;
        const touch = new Touch({
          identifier: 1,
          target,
          clientX: event.clientX,
          clientY: event.clientY,
          pageX: event.pageX,
          pageY: event.pageY,
        });
        const active = type === "touchend" ? [] : [touch];
        touchTarget = type === "touchend" ? null : target;
        target.dispatchEvent(
          new TouchEvent(type, { bubbles: true, cancelable: true, touches: active, targetTouches: active, changedTouches: [touch] }),
        );
      } catch (error) {
        // Touch events cannot be built in this browser; clicks still work.
      }
    };
    document.addEventListener("mousedown", (event) => echoTouch("touchstart", event), true);
    document.addEventListener("mouseup", (event) => echoTouch("touchend", event), true);
    document.documentElement.classList.add("debug-touch-emulation");

    if (typeof updatePracticeInputMode === "function") {
      updatePracticeInputMode();
    }
  }

  function initialisePreviewFrame() {
    if (DEBUG_PARAMS.get("debugTouch") === "1") {
      emulateTouchScreen();
    }
    if (isUnlocked()) {
      window.mathMuscleDebugPreview = { run: runDebugAction };
    }
  }

  function renderDebugTools() {
    if (document.querySelector("[data-debug-open]")) {
      return;
    }
    document.body.classList.add("debug-mode");
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <button class="debug-toggle" type="button" data-debug-open>
          DEBUG
        </button>
        <aside class="debug-panel" aria-label="Teacher debug tools">
          <div class="debug-panel-head">
            <div>
              <p class="debug-kicker">Teacher tools</p>
              <h2>Debug Mode</h2>
            </div>
            <button class="debug-icon-button" type="button" data-debug-action="close" aria-label="Close debug tools">
              &#10005;
            </button>
          </div>
          <p class="debug-note">
            Client-side classroom gate only. These tools affect progress saved in this browser.
          </p>

          <section class="debug-section">
            <h3>Screen size</h3>
            <div class="debug-button-grid">
              ${DEBUG_PREVIEW_SIZES.map(
                (size) =>
                  `<button type="button" data-debug-action="preview-size" data-debug-size="${size.key}">${size.label}</button>`,
              ).join("")}
              <button type="button" data-debug-action="preview-size" data-debug-size="off">Off</button>
            </div>
            <div class="debug-button-grid debug-appearance-actions">
              <button type="button" data-debug-action="preview-touch">Touch: Off</button>
              <button type="button" data-debug-action="preview-reload">Reload Preview</button>
            </div>
          </section>

          <section class="debug-section">
            <h3>Jump</h3>
            <div class="debug-button-grid">
              <button type="button" data-debug-action="jump" data-debug-view="home">Home</button>
              <button type="button" data-debug-action="jump" data-debug-view="setup">Workout</button>
              <button type="button" data-debug-action="jump" data-debug-view="techniques">Learn</button>
              <button type="button" data-debug-action="jump" data-debug-view="progress">Progress</button>
            </div>
          </section>

          <section class="debug-section">
            <h3>Personas</h3>
            <div class="debug-button-grid">
              <button type="button" data-debug-action="persona" data-debug-persona="new-user">New User</button>
              <button type="button" data-debug-action="persona" data-debug-persona="active-week">Active Week</button>
              <button type="button" data-debug-action="persona" data-debug-persona="division-struggler">Division Struggler</button>
              <button type="button" data-debug-action="persona" data-debug-persona="multiplication-specialist">Multiplication Specialist</button>
              <button type="button" data-debug-action="persona" data-debug-persona="power-user">Power User</button>
            </div>
          </section>

          <section class="debug-section">
            <h3>Quick Workouts</h3>
            <div class="debug-button-grid">
              <button type="button" data-debug-action="workout" data-debug-operation="addition">Addition Reps</button>
              <button type="button" data-debug-action="workout" data-debug-operation="division" data-debug-session="timed">Division Timed</button>
            </div>
          </section>

          <section class="debug-section">
            <h3>Appearance</h3>
            <div class="debug-select-grid">
              <label>
                <span>Mode</span>
                <select data-debug-select="color-mode">
                  ${COLOR_MODE_OPTIONS.map((mode) => `<option value="${mode}" ${state.colorMode === mode ? "selected" : ""}>${mode}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Palette</span>
                <select data-debug-select="theme">
                  ${THEME_OPTIONS.map((theme) => `<option value="${theme.key}" ${state.theme === theme.key ? "selected" : ""}>${theme.label}</option>`).join("")}
                </select>
              </label>
            </div>
            <div class="debug-button-grid debug-appearance-actions">
              <button type="button" data-debug-action="color-mode" data-debug-color-mode="light">Light</button>
              <button type="button" data-debug-action="color-mode" data-debug-color-mode="dark">Dark</button>
              <button type="button" data-debug-action="cycle-theme">Cycle Theme</button>
            </div>
          </section>

          <section class="debug-section">
            <h3>Classroom</h3>
            <div class="debug-button-grid">
              <button type="button" data-debug-action="feedback">Feedback Message</button>
              <button type="button" data-debug-action="clear-progress">Clear Progress</button>
              <button type="button" data-debug-action="exit-debug">Exit Debug</button>
            </div>
          </section>

          <p class="debug-status" data-debug-status>Debug tools ready.</p>
        </aside>
      `,
    );

    document.querySelector("[data-debug-open]")?.addEventListener("click", openDebugPanel);
    document.querySelector(".debug-panel")?.addEventListener("click", handleDebugAction);
    document.querySelector(".debug-panel")?.addEventListener("change", handleDebugChange);
    window.addEventListener("resize", layoutPreview);
    setPreviewSettings(loadPreviewSettings());
  }

  function renderDebugLock() {
    if (document.querySelector("[data-debug-lock-dialog]")) {
      document.querySelector("[data-debug-lock-dialog]")?.showModal();
      return;
    }
    document.body.classList.add("debug-mode");
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <dialog class="debug-lock-dialog" data-debug-lock-dialog>
          <form method="dialog" class="debug-lock-card" data-debug-lock-form>
            <p class="debug-kicker">Teacher tools</p>
            <h2>Unlock Debug Mode</h2>
            <p class="debug-note">
              This is a classroom gate, not real security. Do not store secrets in debug tools.
            </p>
            <label class="debug-lock-field">
              <span>Password</span>
              <input type="password" autocomplete="off" data-debug-password />
            </label>
            <p class="debug-lock-error" data-debug-lock-error aria-live="polite"></p>
            <div class="debug-lock-actions">
              <button class="ghost-button" type="button" data-debug-cancel>Cancel</button>
              <button class="primary-button" type="submit">Unlock</button>
            </div>
          </form>
        </dialog>
      `,
    );

    const dialog = document.querySelector("[data-debug-lock-dialog]");
    const form = document.querySelector("[data-debug-lock-form]");
    const input = document.querySelector("[data-debug-password]");
    const error = document.querySelector("[data-debug-lock-error]");

    document.querySelector("[data-debug-cancel]")?.addEventListener("click", () => {
      dialog.close();
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value === DEBUG_PASSWORD) {
        setUnlocked();
        dialog.close();
        dialog.remove();
        renderDebugTools();
        return;
      }
      error.textContent = "Password incorrect.";
      input.select();
    });

    dialog?.showModal();
    input?.focus();
  }

  function requestDebugAccess() {
    debugRequested = true;
    if (isUnlocked()) {
      renderDebugTools();
    } else {
      renderDebugLock();
    }
  }

  function bindHiddenArmTrigger() {
    document.querySelector(".home-brand-mark")?.addEventListener("dblclick", (event) => {
      event.preventDefault();
      requestDebugAccess();
    });
  }

  if (IS_PREVIEW_FRAME) {
    initialisePreviewFrame();
  }

  window.addEventListener("load", () => {
    if (IS_PREVIEW_FRAME) {
      return;
    }
    bindHiddenArmTrigger();
    if (debugRequested) {
      requestDebugAccess();
    }
  });
})();
