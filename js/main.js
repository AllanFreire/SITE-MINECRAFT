/* =============================================================
   MineGuia — scripts usados em todas as páginas
   - frase amarela (splash) do título
   - tooltip roxa estilo Minecraft
   - "conquistas" (toasts) no canto da tela
   - curiosidades da placa
   ============================================================= */
(function () {
  "use strict";

  const MineGuia = (window.MineGuia = window.MineGuia || {});

  MineGuia.escapar = function (texto) {
    return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  };

  function sortear(lista, atual) {
    if (lista.length < 2) return lista[0];
    let item;
    do {
      item = lista[Math.floor(Math.random() * lista.length)];
    } while (item === atual);
    return item;
  }

  /* ---------- Splash: a frase amarela que pisca no título ---------- */
  const SPLASHES = [
    "100% mais diamantes!",
    "Não cave para baixo!",
    "Bloco a bloco!",
    "Creeper? Aw man!",
    "Sssss... BOOM!",
    "Cuidado com a lava!",
    "Netherite > Diamante!",
    "Também tente Terraria!",
    "Feito de pixels!",
    "Soque uma árvore!",
    "Agora com lanças!",
    "Y -59 é o lugar!",
    "Cama no Nether? Não!",
    "Os Piglins amam ouro!",
    "Leve um balde d'água!",
    "Sem creepers. Eu acho.",
    "Fortuna III, por favor!",
    "Cobre? Cobre!",
  ];

  document.querySelectorAll("[data-splash]").forEach((el) => {
    el.textContent = sortear(SPLASHES);
    el.addEventListener("click", () => {
      el.textContent = sortear(SPLASHES, el.textContent);
    });
  });

  /* ---------- Tooltip roxa (passe o mouse nos itens) ----------
     Use data-tip="Título" e data-tip-sub="linha cinza" no HTML,
     ou MineGuia.definirTooltip(elemento, html) no JavaScript. */
  const conteudos = new WeakMap();
  let tip = null;
  let alvoAtual = null;

  MineGuia.definirTooltip = function (el, html) {
    conteudos.set(el, html);
    el.classList.add("tem-tooltip");
  };

  function htmlDoTooltip(el) {
    if (conteudos.has(el)) return conteudos.get(el);
    const titulo = el.dataset.tip;
    if (!titulo) return null;
    const sub = el.dataset.tipSub;
    return (
      `<span class="t-titulo">${MineGuia.escapar(titulo)}</span>` +
      (sub ? `<span class="t-cinza">${MineGuia.escapar(sub)}</span>` : "")
    );
  }

  function posicionar(x, y) {
    const margem = 12;
    const r = tip.getBoundingClientRect();
    let left = x + 16;
    let top = y - 20;
    if (left + r.width > window.innerWidth - margem) left = x - r.width - 16;
    if (top + r.height > window.innerHeight - margem) top = window.innerHeight - r.height - margem;
    left = Math.max(margem, left);
    top = Math.max(margem, top);
    tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  }

  function mostrar(alvo, x, y) {
    const html = htmlDoTooltip(alvo);
    if (!html) return;
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tooltip";
      tip.setAttribute("aria-hidden", "true");
      document.body.appendChild(tip);
    }
    alvoAtual = alvo;
    tip.innerHTML = html;
    tip.classList.add("visivel");
    posicionar(x, y);
  }

  function esconder() {
    alvoAtual = null;
    if (tip) tip.classList.remove("visivel");
  }

  const SELETOR_TIP = "[data-tip], .tem-tooltip";

  document.addEventListener("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    const alvo = e.target.closest(SELETOR_TIP);
    if (alvo && alvo !== alvoAtual) mostrar(alvo, e.clientX, e.clientY);
  });

  document.addEventListener("pointermove", (e) => {
    if (alvoAtual && e.pointerType === "mouse") posicionar(e.clientX, e.clientY);
  });

  document.addEventListener("pointerout", (e) => {
    if (!alvoAtual) return;
    const para = e.relatedTarget;
    if (!para || !alvoAtual.contains(para)) {
      const novo = para && para.closest ? para.closest(SELETOR_TIP) : null;
      if (novo !== alvoAtual) esconder();
    }
  });

  document.addEventListener("focusin", (e) => {
    const alvo = e.target.closest(SELETOR_TIP);
    if (alvo && alvo.matches(":focus-visible")) {
      const r = alvo.getBoundingClientRect();
      mostrar(alvo, r.right, r.top + 20);
    }
  });

  document.addEventListener("focusout", esconder);
  window.addEventListener("scroll", esconder, { passive: true });

  /* Atualiza a tooltip aberta quando o conteúdo do elemento muda */
  MineGuia.atualizarTooltip = function (el) {
    if (el === alvoAtual && tip) tip.innerHTML = htmlDoTooltip(el) || "";
  };

  /* ---------- Conquistas (toasts) ---------- */
  MineGuia.toast = function (titulo, texto, icone) {
    let area = document.querySelector(".toasts");
    if (!area) {
      area = document.createElement("div");
      area.className = "toasts";
      area.setAttribute("role", "status");
      area.setAttribute("aria-live", "polite");
      document.body.appendChild(area);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML =
      (icone ? `<img src="${icone}" alt="">` : "") +
      `<div><b>${MineGuia.escapar(titulo)}</b><span>${MineGuia.escapar(texto)}</span></div>`;
    area.appendChild(t);
    while (area.children.length > 3) area.firstElementChild.remove();
    setTimeout(() => {
      t.classList.add("saindo");
      setTimeout(() => t.remove(), 320);
    }, 4200);
  };

  /* ---------- Placa "Você sabia?" ---------- */
  const CURIOSIDADES = [
    "O Creeper nasceu de um erro: era pra ser um porco, mas a altura e o comprimento foram trocados no modelo.",
    "Uma picareta de ouro minera mais rápido que uma de netherite... mas quebra depois de só 32 usos.",
    "Itens de netherite boiam na lava e não pegam fogo. Seu equipamento sobrevive (você, talvez não).",
    "Os diamantes aparecem mais perto do fundo do mundo, por volta de Y -59.",
    "Um dia inteiro no Minecraft dura 20 minutos na vida real.",
    "Com Fortuna III, um único minério de cobre pode dropar até 20 cobres brutos!",
    "Olhar nos olhos de um Enderman deixa ele muito bravo. Use uma abóbora esculpida na cabeça se precisar.",
    "Jogue uma barra de ouro para um Piglin e ele te dá alguma coisa em troca. Pode ser ótimo... ou só cascalho.",
    "Camas explodem no Nether e no End. Dormir lá não é uma boa ideia.",
    "Detritos ancestrais quase nunca aparecem encostados no ar: eles ficam escondidos dentro da pedra do Nether.",
  ];

  document.querySelectorAll("[data-curiosidade]").forEach((placa) => {
    const texto = placa.querySelector("[data-curiosidade-texto]");
    const botao = placa.querySelector("[data-curiosidade-botao]");
    if (!texto) return;
    texto.textContent = sortear(CURIOSIDADES);
    if (botao) {
      botao.addEventListener("click", () => {
        texto.textContent = sortear(CURIOSIDADES, texto.textContent);
      });
    }
  });

  /* ---------- Ano atual no rodapé ---------- */
  document.querySelectorAll("[data-ano]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
