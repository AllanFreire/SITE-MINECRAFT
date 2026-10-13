(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-scroll-progress]");

  function updateScrollUi() {
    const top = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", top > 20);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? top / max : 0})`;
  }

  updateScrollUi();
  window.addEventListener("scroll", updateScrollUi, { passive: true });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -8%" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const tabList = document.querySelector("[data-world-tabs]");
  const tabs = tabList ? Array.from(tabList.querySelectorAll("[data-world-tab]")) : [];
  const panels = Array.from(document.querySelectorAll("[data-world-panel]"));

  function activateWorld(name, focusTab) {
    tabs.forEach((tab) => {
      const active = tab.dataset.worldTab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    });

    panels.forEach((panel) => {
      const active = panel.dataset.worldPanel === name;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateWorld(tab.dataset.worldTab, false));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      activateWorld(tabs[next].dataset.worldTab, true);
    });
  });

  const track = document.querySelector("[data-guide-track]");
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");

  function moveGuides(direction) {
    if (!track) return;
    const card = track.querySelector(".guide-card");
    const amount = card ? card.getBoundingClientRect().width + 22 : 380;
    track.scrollBy({ left: amount * direction, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (prev) prev.addEventListener("click", () => moveGuides(-1));
  if (next) next.addEventListener("click", () => moveGuides(1));
})();
