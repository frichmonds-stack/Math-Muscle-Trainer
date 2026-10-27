// Page swipers split a screen into pages on phone-sized layouts. Items carry
// data-swiper-page="N" (several items can share a page) inside a [data-page-swiper] container,
// and a [data-swiper-dots] element receives one dot button per page. CSS decides when a swiper
// is paged: it shows the dots and hides items that are not on the current page. On larger
// layouts the dots stay hidden and every page shows together.

function getPageSwiperCount(swiper) {
  const pages = [...swiper.querySelectorAll("[data-swiper-page]")].map((item) => Number(item.dataset.swiperPage) || 1);
  return pages.length ? Math.max(...pages) : 1;
}

function getPageSwiperIndex(swiper) {
  return Number(swiper.dataset.pageIndex) || 0;
}

function isPageSwiperPaged(swiper) {
  const dots = swiper?.querySelector("[data-swiper-dots]");
  return Boolean(dots) && window.getComputedStyle(dots).display !== "none";
}

function renderPageSwiper(swiper) {
  const count = getPageSwiperCount(swiper);
  const index = getPageSwiperIndex(swiper);
  swiper.querySelectorAll("[data-swiper-page]").forEach((item) => {
    item.classList.toggle("is-current-page", Number(item.dataset.swiperPage) === index + 1);
  });
  const dots = swiper.querySelector("[data-swiper-dots]");
  if (dots) {
    dots.innerHTML = Array.from({ length: count }, (_, dotIndex) => {
      const isCurrent = dotIndex === index;
      return `<button class="page-swiper-dot ${isCurrent ? "is-active" : ""}" type="button" data-swiper-dot="${dotIndex}" aria-label="Page ${dotIndex + 1} of ${count}" ${isCurrent ? 'aria-current="page"' : ""}></button>`;
    }).join("");
  }
}

function setPageSwiperIndex(swiper, index) {
  const count = getPageSwiperCount(swiper);
  swiper.dataset.pageIndex = String(Math.min(count - 1, Math.max(0, index)));
  renderPageSwiper(swiper);
}

function shiftPageSwiper(swiper, direction) {
  if (isPageSwiperPaged(swiper)) {
    setPageSwiperIndex(swiper, getPageSwiperIndex(swiper) + direction);
  }
}

function initialisePageSwipers() {
  document.querySelectorAll("[data-page-swiper]").forEach((swiper) => {
    renderPageSwiper(swiper);
    swiper.querySelector("[data-swiper-dots]")?.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-swiper-dot]");
      if (dot) {
        setPageSwiperIndex(swiper, Number(dot.dataset.swiperDot));
      }
    });
    bindCarouselSwipe(
      swiper,
      () => shiftPageSwiper(swiper, 1),
      () => shiftPageSwiper(swiper, -1),
    );
  });
}
