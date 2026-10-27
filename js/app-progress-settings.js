// Touch screens of every size use the on-screen keypad (ADR-0019), so the phone keyboard never
// covers the fixed Practice layout.
function prefersTouchKeypad() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function shouldUseTouchKeypad() {
  if (state.keypadPreference === "always-on") {
    return true;
  }
  if (state.keypadPreference === "always-off") {
    return false;
  }
  return prefersTouchKeypad();
}

function updatePracticeInputMode() {
  state.useTouchKeypad = shouldUseTouchKeypad();
  if (elements.practiceKeypad) {
    elements.practiceKeypad.classList.toggle("is-hidden", !state.useTouchKeypad);
  }
  if (elements.answerInput instanceof HTMLInputElement) {
    elements.answerInput.setAttribute("inputmode", state.useTouchKeypad ? "none" : "numeric");
  }
  if (elements.practicePanel) {
    elements.practicePanel.classList.toggle("has-touch-keypad", state.useTouchKeypad);
  }
  syncKeypadSignToggleState();
}

function registerBackdropClose(dialog) {
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const isInside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    if (!isInside) {
      dialog.close();
    }
  });
}

function handleSettingsChange(event) {
  const changedField =
    event?.target?.id === "minFactor" ? "min" : event?.target?.id === "maxFactor" ? "max" : "";
  if (changedField) {
    syncIsolationRangeControls(changedField);
  }
  toggleSetupFields();
}

function handleThemeChange(event) {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const theme = sanitiseTheme(select.value);
  applyTheme(theme);
  saveTheme(theme);
}

function handleColorModeChange(event) {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const mode = sanitiseColorMode(select.value);
  applyColorMode(mode);
  saveColorMode(mode);
}

function handleKeypadPreferenceChange(event) {
  const select = event.target;
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const preference = sanitiseKeypadPreference(select.value);
  state.keypadPreference = preference;
  if (elements.keypadPreferenceSelect && elements.keypadPreferenceSelect !== select) {
    elements.keypadPreferenceSelect.value = preference;
  }
  if (elements.keypadPreferenceOptionsSelect && elements.keypadPreferenceOptionsSelect !== select) {
    elements.keypadPreferenceOptionsSelect.value = preference;
  }
  saveKeypadPreference(preference);
  updatePracticeInputMode();
}

function resetProgress() {
  const shouldReset = window.confirm("Reset all saved trainer progress on this browser?");
  if (!shouldReset) {
    return;
  }

  state.progress = defaultProgress();
  state.displayMonthKey = getMonthKey(getCurrentMonthDate());
  saveProgress();
  renderDailyProgress();
  renderOverall();
  renderMasterySystem();
  renderFocusAreas();
  renderWorkoutHistory();
  renderCoachTip();
  renderTableRadar();
  renderCalendars();
  renderStreakPanel();
  renderProgressCarousel();
  window.alert("Saved progress cleared.");
}
