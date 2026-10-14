/* =============================================================
   MineGuia — página inicial
     1. a foto do topo cresce enquanto você rola (e os itens flutuam)
     2. os números contam até o valor quando aparecem
     3. as abas das três dimensões
   ============================================================= */
(function () {
  "use strict";

  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Foto que cresce ---------- */
  const palco = document.querySelector("[data-palco]");
  if (palco && !reduzir) {
    let pedido = 0;
    const atualizar = () => {
      pedido = 0;
      const r = palco.getBoundingClientRect();
      const alto = window.innerHeight;
      // 0 quando o topo da foto está a 85% da tela; 1 quando chega a 10%
      const p = Math.min(1, Math.max(0, (alto * 0.85 - r.top) / (alto * 0.75)));
      palco.style.setProperty("--p", p.toFixed(4));
      palco.style.setProperty("--rolagem", Math.round(alto - r.top));
    };
    const agendar = () => {
      if (!pedido) pedido = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
  }

  /* ---------- 2. Números que contam ---------- */
  const numeros = document.querySelectorAll("[data-conta]");
  const contar = (el) => {
    const alvo = Number(el.dataset.conta);
    const inicio = performance.now();
    const duracao = 1400;
    const passo = (agora) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const suave = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(alvo * suave);
      if (t < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  if (!reduzir && "IntersectionObserver" in window) {
    numeros.forEach((el) => (el.textContent = "0"));
    const obs = new IntersectionObserver(
      (entradas, o) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          contar(e.target);
          o.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    numeros.forEach((el) => obs.observe(el));
  }

  /* ---------- 3. Abas das dimensões ---------- */
  const lista = document.querySelector("[data-abas]");
  if (!lista) return;
  const abas = Array.from(lista.querySelectorAll("[data-aba]"));
  const paineis = Array.from(document.querySelectorAll("[data-painel]"));
  const marcador = lista.querySelector(".h-abas-marcador");

  function moverMarcador() {
    const ativa = abas.find((a) => a.getAttribute("aria-selected") === "true");
    if (!ativa || !marcador) return;
    marcador.style.setProperty("--x", `${ativa.offsetLeft}px`);
    marcador.style.setProperty("--w", `${ativa.offsetWidth}px`);
  }

  function ativar(nome, focar) {
    abas.forEach((a) => {
      const ativa = a.dataset.aba === nome;
      a.setAttribute("aria-selected", String(ativa));
      a.tabIndex = ativa ? 0 : -1;
      if (ativa && focar) a.focus();
    });
    paineis.forEach((p) => {
      const ativo = p.dataset.painel === nome;
      p.hidden = !ativo;
      p.classList.toggle("is-ativo", ativo);
    });
    moverMarcador();
  }

  abas.forEach((aba, i) => {
    aba.addEventListener("click", () => ativar(aba.dataset.aba, false));
    aba.addEventListener("keydown", (e) => {
      const teclas = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: abas.length - 1 };
      if (!(e.key in teclas)) return;
      e.preventDefault();
      const prox = (teclas[e.key] + abas.length) % abas.length;
      ativar(abas[prox].dataset.aba, true);
    });
  });

  moverMarcador();
  window.addEventListener("resize", moverMarcador);
  if (document.fonts) document.fonts.ready.then(moverMarcador);
})();
