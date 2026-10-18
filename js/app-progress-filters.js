const DAILY_REP_GOAL = 50;

function getOperationFilterValue(selectElement, fallback = "all") {
  if (!(selectElement instanceof HTMLSelectElement)) {
    return fallback;
  }

  const value = selectElement.value;
  return value === "addition" ||
    value === "multiplication" ||
    value === "subtraction" ||
    value === "division" ||
    value === "all"
    ? value
    : fallback;
}

function getOverviewOperationFilterValue() {
  return getOperationFilterValue(elements.overviewOperationFilter, "all");
}

function getFocusOperationFilterValue() {
  return getOperationFilterValue(elements.focusOperationFilter, "all");
}

function getCoachOperationFilterValue() {
  return getOperationFilterValue(elements.coachOperationFilter, "all");
}

function getFactOperationFilterValue() {
  if (!elements.factOperationFilter) {
    return "multiplication";
  }
  return OPERATION_OPTIONS.includes(elements.factOperationFilter.value)
    ? elements.factOperationFilter.value
    : "multiplication";
}

function syncFactDetailFilterOptions() {
  if (!elements.factDetailFilter) {
    return;
  }

  const operation = getFactOperationFilterValue();
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  const previousValue = elements.factDetailFilter.value;

  elements.factDetailFilter.innerHTML = definitions
    .map((definition) => `<option value="${definition.key}">${definition.label}</option>`)
    .join("");
  elements.factDetailFilter.value = definitions.some((definition) => definition.key === previousValue)
    ? previousValue
    : definitions[0].key;
}

function getFactDetailFilterValue() {
  const operation = getFactOperationFilterValue();
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  const fallback = definitions[0]?.key || "overall";
  if (!elements.factDetailFilter) {
    return fallback;
  }

  const value = elements.factDetailFilter.value;
  return definitions.some((definition) => definition.key === value) ? value : fallback;
}

function updateFactSelectorCarouselState() {
  const operation = getFactOperationFilterValue();
  if (elements.factOperationLabel) {
    elements.factOperationLabel.textContent = OPERATION_LABELS[operation] || "Multiplication";
  }
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  const detailValue = getFactDetailFilterValue();
  const detailIndex = definitions.findIndex((definition) => definition.key === detailValue);
  const boundedIndex = detailIndex < 0 ? 0 : detailIndex;
  const activeDefinition = definitions[boundedIndex] || definitions[0];
  const showDetailSelector = definitions.length > 1;
  const showRangeSelector = operation === "multiplication" || operation === "division";

  if (elements.factDetailLabel) {
    elements.factDetailLabel.textContent = activeDefinition?.label || "Overall";
  }
  if (elements.factDetailSelector) {
    elements.factDetailSelector.hidden = !showDetailSelector;
    elements.factDetailSelector.style.display = showDetailSelector ? "" : "none";
  }
  if (elements.factRangeNav) {
    elements.factRangeNav.hidden = !showRangeSelector;
    elements.factRangeNav.style.display = showRangeSelector ? "" : "none";
  }

  if (elements.factOperationPrevButton) {
    elements.factOperationPrevButton.disabled = false;
  }
  if (elements.factOperationNextButton) {
    elements.factOperationNextButton.disabled = false;
  }
  if (elements.factDetailPrevButton) {
    elements.factDetailPrevButton.disabled = !showDetailSelector || boundedIndex === 0;
  }
  if (elements.factDetailNextButton) {
    elements.factDetailNextButton.disabled = !showDetailSelector || boundedIndex >= definitions.length - 1;
  }

  if (elements.factsSelectorRow) {
    const widthCh = Math.max(12, "Without regrouping".length + 4);
    elements.factsSelectorRow.style.setProperty("--facts-selector-width", `${widthCh}ch`);
  }
}

const FACT_TRACKER_MULTIPLICATION_RANGES = [
  { label: "x 1 - x 6", minFactor: 1, maxFactor: 6 },
  { label: "x 7 - x 12", minFactor: 7, maxFactor: 12 },
];

function getFactTrackerRangeCount() {
  return FACT_TRACKER_MULTIPLICATION_RANGES.length;
}

function clampFactTrackerRangeIndex(index) {
  const maxIndex = getFactTrackerRangeCount() - 1;
  return Math.max(0, Math.min(maxIndex, Number(index) || 0));
}

function resetFactTrackerRange() {
  state.factTrackerRangeIndex = 0;
}

function updateFactTrackerRangeControls(isMultiplicationView) {
  if (!elements.factRangeNav || !elements.factRangeLabel) {
    return;
  }

  if (!isMultiplicationView) {
    elements.factRangeNav.hidden = true;
    elements.factRangeLabel.textContent = "all";
    if (elements.factRangePrevButton) {
      elements.factRangePrevButton.disabled = true;
    }
    if (elements.factRangeNextButton) {
      elements.factRangeNextButton.disabled = true;
    }
    updateFactSelectorCarouselState();
    return;
  }

  elements.factRangeNav.hidden = false;
  state.factTrackerRangeIndex = clampFactTrackerRangeIndex(state.factTrackerRangeIndex);
  const activeRange = FACT_TRACKER_MULTIPLICATION_RANGES[state.factTrackerRangeIndex];
  elements.factRangeLabel.textContent = activeRange.label;

  if (elements.factRangePrevButton) {
    elements.factRangePrevButton.disabled = state.factTrackerRangeIndex === 0;
  }
  if (elements.factRangeNextButton) {
    elements.factRangeNextButton.disabled =
      state.factTrackerRangeIndex >= getFactTrackerRangeCount() - 1;
  }
  updateFactSelectorCarouselState();
}

function shiftFactTrackerRange(direction) {
  const operation = getFactOperationFilterValue();
  if (operation !== "multiplication" && operation !== "division") {
    return;
  }

  const nextIndex = clampFactTrackerRangeIndex(state.factTrackerRangeIndex + direction);
  if (nextIndex === state.factTrackerRangeIndex) {
    return;
  }
  state.factTrackerRangeIndex = nextIndex;
  renderTableRadar();
}

function shiftFactOperation(direction) {
  if (!elements.factOperationFilter) {
    return;
  }
  const current = getFactOperationFilterValue();
  const currentIndex = Math.max(0, OPERATION_OPTIONS.indexOf(current));
  const nextIndex = (currentIndex + direction + OPERATION_OPTIONS.length) % OPERATION_OPTIONS.length;
  elements.factOperationFilter.value = OPERATION_OPTIONS[nextIndex];
  handleFactOperationFilterChange();
}

function shiftFactDetail(direction) {
  if (!elements.factDetailFilter) {
    return;
  }
  const operation = getFactOperationFilterValue();
  const definitions = FACT_TRACKER_DETAIL_OPTIONS[operation] || FACT_TRACKER_DETAIL_OPTIONS.multiplication;
  if (definitions.length <= 1) {
    return;
  }
  const current = getFactDetailFilterValue();
  const currentIndex = Math.max(
    0,
    definitions.findIndex((definition) => definition.key === current),
  );
  const nextIndex = (currentIndex + direction + definitions.length) % definitions.length;
  if (nextIndex === currentIndex) {
    return;
  }
  elements.factDetailFilter.value = definitions[nextIndex].key;
  handleFactDetailFilterChange();
}

function shiftSelectValue(selectElement, direction) {
  if (!(selectElement instanceof HTMLSelectElement)) {
    return false;
  }
  const options = Array.from(selectElement.options);
  if (!options.length) {
    return false;
  }
  const currentIndex = Math.max(0, options.findIndex((option) => option.value === selectElement.value));
  const nextIndex = (currentIndex + direction + options.length) % options.length;
  if (nextIndex === currentIndex) {
    return false;
  }
  selectElement.value = options[nextIndex].value;
  return true;
}

function syncOverviewSelectorLabel() {
  if (!elements.overviewOperationLabel) {
    return;
  }
  const value = getOverviewOperationFilterValue();
  elements.overviewOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
}

function syncFocusSelectorLabel() {
  if (!elements.focusOperationLabel) {
    return;
  }
  const value = getFocusOperationFilterValue();
  elements.focusOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
}

function syncCoachSelectorLabel() {
  if (!elements.coachOperationLabel) {
    return;
  }
  const value = getCoachOperationFilterValue();
  elements.coachOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
}

function syncRecordsSelectorLabels() {
  if (elements.recordsOperationLabel) {
    const value = getRecordsOperationFilterValue();
    elements.recordsOperationLabel.textContent = value === "all" ? "All Operations" : getOperationLabel(value);
  }
  if (elements.recordsModeLabel && elements.recordsModeSelect instanceof HTMLSelectElement) {
    const selected = Array.from(elements.recordsModeSelect.options).find(
      (option) => option.value === elements.recordsModeSelect.value,
    );
    elements.recordsModeLabel.textContent = selected?.textContent?.trim() || "Workout Type";
  }
}

function shiftOverviewOperation(direction) {
  if (shiftSelectValue(elements.overviewOperationFilter, direction)) {
    handleOverviewOperationFilterChange();
  }
}

function shiftFocusOperation(direction) {
  if (shiftSelectValue(elements.focusOperationFilter, direction)) {
    handleFocusOperationFilterChange();
  }
}

function shiftCoachOperation(direction) {
  if (shiftSelectValue(elements.coachOperationFilter, direction)) {
    handleCoachOperationFilterChange();
  }
}

function shiftRecordsOperation(direction) {
  if (shiftSelectValue(elements.recordsOperationSelect, direction)) {
    handleRecordsFilterChange();
  }
}

function shiftRecordsMode(direction) {
  if (shiftSelectValue(elements.recordsModeSelect, direction)) {
    renderWorkoutHistory();
    syncRecordsSelectorLabels();
  }
}

function getRecordsOperationFilterValue() {
  if (!elements.recordsOperationSelect) {
    return "all";
  }
  const value = elements.recordsOperationSelect.value;
  return value === "addition" ||
    value === "multiplication" ||
    value === "subtraction" ||
    value === "division" ||
    value === "all"
    ? value
    : "all";
}

function matchesOperationFilter(operation, filterValue) {
  return filterValue === "all" ? true : operation === filterValue;
}

function getFactEntriesByOperation(filterValue = "all") {
  return Object.entries(state.progress.facts)
    .map(([key, value]) => {
      const parsed = parseFactKey(key);
      const progress = getFactProgress(key);
      return {
        key,
        ...parsed,
        ...progress,
        operation: progress.operation || parsed.operation || "multiplication",
        symbol: progress.symbol || parsed.symbol || "x",
      };
    })
    .filter((entry) => matchesOperationFilter(entry.operation, filterValue));
}

function getWorkoutHistoryByOperation(filterValue = "all") {
  return state.progress.workoutHistory.filter((record) =>
    matchesOperationFilter(record.operation || "multiplication", filterValue),
  );
}

function handleOverviewOperationFilterChange() {
  renderOverall();
  syncOverviewSelectorLabel();
}

function handleFocusOperationFilterChange() {
  renderProgressFocusAreas();
  syncFocusSelectorLabel();
}

function handleCoachOperationFilterChange() {
  renderCoachTip();
  syncCoachSelectorLabel();
}

function handleFactOperationFilterChange() {
  resetFactTrackerRange();
  syncFactDetailFilterOptions();
  renderTableRadar();
  updateFactSelectorCarouselState();
}

function handleFactDetailFilterChange() {
  resetFactTrackerRange();
  renderTableRadar();
  updateFactSelectorCarouselState();
}

function handleRecordsFilterChange() {
  syncRecordsModeOptions();
  renderWorkoutHistory();
  syncRecordsSelectorLabels();
}
