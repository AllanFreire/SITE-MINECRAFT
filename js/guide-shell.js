(function () {
  "use strict";

  const header = document.querySelector(".topo");
  const nav = document.querySelector(".topo .menu");
  const headerInner = document.querySelector(".topo .container");

  const progress = document.createElement("div");
  progress.className = "guide-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<span></span>";
  document.body.prepend(progress);
  const progressBar = progress.firstElementChild;

  function updateScrollUi() {
    const top = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", top > 20);
    progressBar.style.transform = `scaleX(${max > 0 ? top / max : 0})`;
  }

  updateScrollUi();
  window.addEventListener("scroll", updateScrollUi, { passive: true });

  if (headerInner && nav) {
    nav.id = nav.id || "guide-menu";
    const toggle = document.createElement("button");
    toggle.className = "guide-nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    headerInner.appendChild(toggle);

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      nav.classList.remove("is-open");
      document.body.classList.remove("guide-menu-open");
    }

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("guide-menu-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }
})();
