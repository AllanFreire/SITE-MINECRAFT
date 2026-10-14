/* =============================================================
   MineGuia — comportamento comum de todas as páginas
     1. menu do topo no celular
     2. barra de seções dos guias (título, seções e atalho)
     3. entrada suave dos elementos ao rolar
   ============================================================= */
(function () {
  "use strict";

  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, raiz = document) => raiz.querySelector(sel);

  /* ---------- 1. Menu do topo no celular ---------- */
  const abrir = $(".gnav-abrir");
  const links = $(".gnav-links");

  function fecharMenu() {
    if (!abrir) return;
    abrir.setAttribute("aria-expanded", "false");
    abrir.setAttribute("aria-label", "Abrir menu");
    links.classList.remove("is-aberto");
    document.body.classList.remove("menu-aberto");
  }

  if (abrir && links) {
    abrir.addEventListener("click", () => {
      const aberto = abrir.getAttribute("aria-expanded") === "true";
      abrir.setAttribute("aria-expanded", String(!aberto));
      abrir.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
      links.classList.toggle("is-aberto", !aberto);
      document.body.classList.toggle("menu-aberto", !aberto);
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) fecharMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fecharMenu();
    });
    window.matchMedia("(min-width: 834px)").addEventListener("change", fecharMenu);
  }

  /* ---------- 2. Barra de seções dos guias ----------
     Cada <section data-subnav="Nome curto"> vira um link. O botão da
     direita vem de <body data-subnav-acao="Texto|#alvo">. */
  const secoes = Array.from(document.querySelectorAll("section[data-subnav][id]"));
  const hero = $(".guia-hero");

  if (secoes.length && hero) {
    const titulo = $(".guia-titulo");
    const [acaoTexto, acaoAlvo] = (document.body.dataset.subnavAcao || "").split("|");
    const barra = document.createElement("nav");
    barra.className = "subnav";
    barra.setAttribute("aria-label", "Seções deste guia");
    barra.innerHTML =
      `<div class="subnav-barra">` +
      `<a class="subnav-titulo" href="#topo">${titulo ? titulo.textContent.trim() : document.title}</a>` +
      `<button class="subnav-abrir" type="button" aria-expanded="false" aria-controls="subnav-links" aria-label="Mostrar as seções">` +
      `<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 4l4.5 4.5L10.5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` +
      `<ul class="subnav-links" id="subnav-links">${secoes
        .map((s) => `<li><a href="#${s.id}">${s.dataset.subnav}</a></li>`)
        .join("")}</ul>` +
      (acaoAlvo ? `<a class="subnav-acao" href="${acaoAlvo}">${acaoTexto}</a>` : "") +
      `</div>`;
    const gnav = $(".gnav");
    (gnav || document.body.firstElementChild).after(barra);
    hero.id = hero.id || "topo";
    document.documentElement.classList.add("tem-subnav");

    const botao = $(".subnav-abrir", barra);
    const lista = $(".subnav-links", barra);
    botao.addEventListener("click", () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      botao.setAttribute("aria-expanded", String(!aberto));
      lista.classList.toggle("is-aberto", !aberto);
    });
    barra.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        botao.setAttribute("aria-expanded", "false");
        lista.classList.remove("is-aberto");
      }
    });

    // barra escura sobre o topo do guia, clara sobre o conteúdo
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([e]) => barra.classList.toggle("is-claro", !e.isIntersecting),
        { rootMargin: "-56px 0px 0px 0px", threshold: 0 }
      ).observe(hero);

      // link da seção que está na tela
      const ativos = new Map();
      const linksSecao = new Map(secoes.map((s) => [s, $(`a[href="#${s.id}"]`, lista)]));
      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => ativos.set(e.target, e.isIntersecting));
          const atual = secoes.find((s) => ativos.get(s));
          linksSecao.forEach((a, s) => a.classList.toggle("is-ativo", s === atual));
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      secoes.forEach((s) => observador.observe(s));
    }
  }

  /* ---------- 3. Entrada suave ao rolar ----------
     Na página inicial os elementos já vêm com data-reveal; nos guias,
     os títulos e as descrições das seções ganham o efeito. */
  document.querySelectorAll(".secao > .container > .titulo-secao, .secao > .container > .secao-desc").forEach((el) => {
    el.setAttribute("data-reveal", "");
  });

  const revelar = document.querySelectorAll("[data-reveal]");
  if (reduzir || !("IntersectionObserver" in window)) {
    revelar.forEach((el) => el.classList.add("is-visible"));
  } else {
    const obs = new IntersectionObserver(
      (entradas, o) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          o.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revelar.forEach((el) => obs.observe(el));
  }
})();
