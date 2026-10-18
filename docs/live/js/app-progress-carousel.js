function buildCarouselIndicatorMarkup(currentIndex, total) {
  const dots = Array.from({ length: total }, (_, index) => {
    const active = index === currentIndex;
    return `<span class="carousel-position-dot ${active ? "is-active" : ""}" aria-hidden="true"></span>`;
  }).join("");
  return `
    <span class="carousel-position-dots" aria-hidden="true">${dots}</span>
  `;
}

function isTabletCoarsePointer() {
  return (
    window.matchMedia("(pointer: coarse)").matches &&
    window.matchMedia("(min-width: 768px)").matches
  );
}

function renderAppPageIndicator() {
  return;
}

function renderResultsCarousel() {
  elements.resultsSlides.forEach((slide) => {
    const isActiveSlide =
      slide.dataset.resultsSlide === RESULTS_SLIDES[state.resultsSlideIndex];
    slide.classList.toggle("is-active", isActiveSlide);
    slide.setAttribute("aria-hidden", isActiveSlide ? "false" : "true");
  });

  if (elements.resultsPrevButton) {
    elements.resultsPrevButton.hidden = false;
    elements.resultsPrevButton.disabled = RESULTS_SLIDES.length < 2;
  }
  if (elements.resultsNextButton) {
    elements.resultsNextButton.hidden = false;
    elements.resultsNextButton.disabled = RESULTS_SLIDES.length < 2;
  }
  if (elements.resultsCarouselIndicator) {
    elements.resultsCarouselIndicator.innerHTML = buildCarouselIndicatorMarkup(
      state.resultsSlideIndex,
      RESULTS_SLIDES.length,
    );
  }
  if (elements.resultsCarouselKickerLabel) {
    const activeSlide = elements.resultsSlides.find((slide) => slide.classList.contains("is-active"));
    const activeKicker = activeSlide?.dataset.carouselKicker?.trim();
    elements.resultsCarouselKickerLabel.textContent = activeKicker || "Results";
  }
}

function shiftResultsCarousel(direction) {
  const totalSlides = RESULTS_SLIDES.length;
  if (totalSlides < 1) {
    return;
  }
  state.resultsSlideIndex = (state.resultsSlideIndex + direction + totalSlides) % totalSlides;
  renderResultsCarousel();
}

function renderProgressCarousel() {
  elements.progressSlides.forEach((slide) => {
    const isActiveSlide =
      slide.dataset.progressSlide === PROGRESS_SLIDES[state.progressSlideIndex];
    slide.classList.toggle("is-active", isActiveSlide);
    slide.setAttribute("aria-hidden", isActiveSlide ? "false" : "true");
  });

  if (elements.progressPrevButton) {
    elements.progressPrevButton.hidden = false;
    elements.progressPrevButton.disabled = PROGRESS_SLIDES.length < 2;
  }
  if (elements.progressNextButton) {
    elements.progressNextButton.hidden = false;
    elements.progressNextButton.disabled = PROGRESS_SLIDES.length < 2;
  }
  if (elements.progressCarouselIndicator) {
    elements.progressCarouselIndicator.innerHTML = buildCarouselIndicatorMarkup(
      state.progressSlideIndex,
      PROGRESS_SLIDES.length,
    );
  }
  if (elements.progressCarouselKickerLabel) {
    const activeSlide = elements.progressSlides.find((slide) => slide.classList.contains("is-active"));
    const activeKicker = activeSlide?.dataset.carouselKicker?.trim();
    elements.progressCarouselKickerLabel.textContent = activeKicker || "My Progress";
  }
}

function shiftProgressCarousel(direction) {
  const totalSlides = PROGRESS_SLIDES.length;
  if (totalSlides < 1) {
    return;
  }
  state.progressSlideIndex = (state.progressSlideIndex + direction + totalSlides) % totalSlides;
  renderProgressCarousel();
}

function bindCarouselSwipe(container, onSwipeNext, onSwipePrev) {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const swipeState = {
    startX: 0,
    startY: 0,
    tracking: false,
  };

  container.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        swipeState.tracking = false;
        return;
      }
      swipeState.tracking = true;
      swipeState.startX = event.touches[0].clientX;
      swipeState.startY = event.touches[0].clientY;
    },
    { passive: true },
  );

  container.addEventListener(
    "touchend",
    (event) => {
      if (!swipeState.tracking || event.changedTouches.length !== 1) {
        swipeState.tracking = false;
        return;
      }

      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;
      const deltaX = endX - swipeState.startX;
      const deltaY = endY - swipeState.startY;
      swipeState.tracking = false;

      if (Math.abs(deltaX) < 56 || Math.abs(deltaY) > 76) {
        return;
      }

      if (deltaX < 0) {
        onSwipeNext();
        return;
      }

      onSwipePrev();
    },
    { passive: true },
  );
}

function initialiseCarouselGestures() {
  bindCarouselSwipe(elements.resultsCarousel, () => shiftResultsCarousel(1), () => shiftResultsCarousel(-1));
  bindCarouselSwipe(elements.progressCarousel, () => shiftProgressCarousel(1), () => shiftProgressCarousel(-1));

  if (!(elements.appShell instanceof HTMLElement)) {
    return;
  }

  const topViews = ["home", "setup", "techniques", "progress"];
  const swipeState = {
    startX: 0,
    startY: 0,
    tracking: false,
  };

  elements.appShell.addEventListener(
    "touchstart",
    (event) => {
      if (!isTabletCoarsePointer() || state.active || event.touches.length !== 1) {
        swipeState.tracking = false;
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("button, input, select, textarea, [role='button'], .results-carousel, .progress-carousel")
      ) {
        swipeState.tracking = false;
        return;
      }
      swipeState.tracking = true;
      swipeState.startX = event.touches[0].clientX;
      swipeState.startY = event.touches[0].clientY;
    },
    { passive: true },
  );

  elements.appShell.addEventListener(
    "touchend",
    (event) => {
      if (!swipeState.tracking || event.changedTouches.length !== 1) {
        swipeState.tracking = false;
        return;
      }
      const deltaX = event.changedTouches[0].clientX - swipeState.startX;
      const deltaY = event.changedTouches[0].clientY - swipeState.startY;
      swipeState.tracking = false;
      if (Math.abs(deltaX) < 64 || Math.abs(deltaY) > 72) {
        return;
      }

      const currentIndex = topViews.indexOf(state.view);
      if (currentIndex < 0) {
        return;
      }
      const nextIndex =
        deltaX < 0
          ? Math.min(topViews.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
      if (nextIndex === currentIndex) {
        return;
      }
      requestView(topViews[nextIndex]);
    },
    { passive: true },
  );
}
