/* =============================================================
   A Superfície
   Monta, a partir de js/dados-superficie.js:
     1. o guia rápido (clique numa estrutura ou num tipo de bioma)
     2. os cards dos biomas, separados por tipo
     3. os cards das estruturas, com os mobs e os baús
   ============================================================= */
(function () {
  "use strict";

  const D = window.MINEGUIA_SUPERFICIE;
  const MG = window.MineGuia || {};
  if (!D) return;

  const IMG = "assets/img/itens/";
  const FOTO = "assets/img/superficie/";
  const esc = MG.escapar || ((t) => String(t));
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const BIOMA = Object.fromEntries(D.biomas.map((b) => [b.id, b]));
  const ESTRUTURA = Object.fromEntries(D.estruturas.map((e) => [e.id, e]));
  const TIPO = { passivo: "Passivo", neutro: "Neutro", hostil: "Hostil" };
  const CLIMA = { seco: "dead_bush", chuva: "water_bucket", neve: "snowball" };
  const GRUPOS_ESTRUTURA = [
    ["superficie", "Na superfície", "grass_block"],
    ["agua", "Na água", "water_bucket"],
    ["subsolo", "Embaixo da terra", "stone"],
  ];
  const LEGENDA = {
    bau: "A porcentagem é a chance de o item aparecer em um baú.",
    bloco: "A porcentagem é a chance de sair esse item ao passar o pincel em um bloco suspeito.",
  };

  /* ---------- peças pequenas ---------- */
  const nomeItem = (id) => (D.itens[id] ? D.itens[id][0] : id);
  const arquivoItem = (id) => (D.itens[id] ? D.itens[id][1] : id + ".png");
  const subItem = (id) => (D.itens[id] && D.itens[id][2]) || "";

  function brilho(src) {
    return `<span class="brilho" style="-webkit-mask-image: url('${src}'); mask-image: url('${src}')"></span>`;
  }

  // itens que brilham no jogo mesmo sem estar encantados
  const SEMPRE_BRILHA = new Set(["enchanted_book.png", "enchanted_golden_apple.png"]);

  function slot(id, { classe = "slot--p", encantado = false, sub = "" } = {}) {
    const arquivo = arquivoItem(id);
    const src = IMG + arquivo;
    const brilha = encantado || SEMPRE_BRILHA.has(arquivo);
    const linha = sub || subItem(id);
    return (
      `<span class="slot ${classe}" data-tip="${esc(nomeItem(id))}"${linha ? ` data-tip-sub="${esc(linha)}"` : ""}>` +
      `<img src="${src}" alt="${esc(nomeItem(id))}">${brilha ? brilho(src) : ""}</span>`
    );
  }

  const rosto = (id) => `<img class="rosto" src="${FOTO}mob-${id}.png" alt="">`;

  // chip de mob (não é link: a tooltip mostra o tipo)
  function chip(id, nota) {
    const m = D.mobs[id];
    const sub = TIPO[m.tipo] + (nota ? " · " + nota : "");
    return `<span class="chip chip--${m.tipo}" data-tip="${esc(m.nome)}" data-tip-sub="${esc(sub)}">${rosto(id)}<span>${esc(m.nome)}</span></span>`;
  }

  const chipMob = (id) => `<li>${chip(id)}</li>`;

  function chipLugar(tipo, id) {
    const x = tipo === "bioma" ? BIOMA[id] : ESTRUTURA[id];
    return `<li><a class="chip" href="#${tipo}-${id}"><img src="${IMG}${arquivoItem(x.icone)}" alt=""><span>${esc(x.nome)}</span></a></li>`;
  }

  function dica(texto) {
    return `<p class="minerio-dica"><img src="${IMG}torch.png" alt="">${esc(texto)}</p>`;
  }

  const numero = (n) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

  function chance(p) {
    if (p >= 99.95) return "Sempre";
    return (p >= 10 ? Math.round(p) : numero(p)) + "%";
  }

  function quantidade(a, b) {
    const n = a === b ? String(a) : `${a} a ${b}`;
    return `${n} ${a === 1 && b === 1 ? "unidade" : "unidades"}`;
  }

  /* =========================================================
     1. GUIA RÁPIDO
     ========================================================= */
  function atalho(href, icone, nome, legenda) {
    return (
      `<a class="atalho" href="${href}">` +
      `<span class="passo-icone"><img src="${IMG}${arquivoItem(icone)}" alt=""></span>` +
      `<b>${esc(nome)}</b>${legenda ? `<small>${esc(legenda)}</small>` : ""}</a>`
    );
  }

  function montarGuiaRapido() {
    for (const [grupo] of GRUPOS_ESTRUTURA) {
      $("#atalhos-" + grupo).innerHTML = D.estruturas
        .filter((e) => e.grupo === grupo)
        .map((e) => atalho("#estrutura-" + e.id, e.icone, e.nome))
        .join("");
    }
    $("#atalhos-biomas").innerHTML = D.grupos
      .map((g) => {
        const n = D.biomas.filter((b) => b.grupo === g.id).reduce((s, b) => s + 1 + b.variantes.length, 0);
        return atalho("#grupo-" + g.id, g.icone, g.nome, `${n} ${n > 1 ? "biomas" : "bioma"}`);
      })
      .join("");
  }

  /* =========================================================
     2. BIOMAS
     ========================================================= */
  function montarIntroBiomas() {
    const total = D.biomas.reduce((s, b) => s + 1 + b.variantes.length, 0);
    $("#biomas-intro").innerHTML =
      `<p class="secao-desc">São ${total} biomas, separados aqui por tipo. Em quase todos eles, à noite ou no escuro das cavernas, aparecem os monstros de sempre:</p>` +
      `<div class="painel comuns"><ul class="chips chips--p">${D.monstrosComuns.map((m) => chipMob(m)).join("")}</ul>` +
      `<p>Por isso, nos cards só aparecem os <b>monstros diferentes</b> de cada bioma. Mina, fortaleza, câmaras do desafio, masmorra e portal em ruínas podem aparecer embaixo de quase todos.</p></div>`;
  }

  function cardBioma(b) {
    const nomeCompleto = b.variantes.length ? `${b.nome} e ${b.variantes.join(", ")}` : b.nome;
    const animais = b.animais.length
      ? `<ul class="chips chips--p">${b.animais.map((m) => chipMob(m)).join("")}</ul>`
      : `<p class="nenhum">Nenhum animal aparece aqui.</p>`;
    let monstros = "";
    if (b.semMonstros) {
      monstros = `<h5 class="rotulo">Monstros</h5><p class="sem-monstros">Nenhum monstro nasce aqui sozinho!</p>`;
    } else if (b.monstros.length) {
      monstros =
        `<h5 class="rotulo">Monstros diferentes</h5><ul class="lista-monstros">` +
        b.monstros.map(([m, nota]) => `<li>${chip(m, nota)}${nota ? `<small>${esc(nota)}</small>` : ""}</li>`).join("") +
        `</ul>`;
    }
    const estruturas = b.estruturas.length
      ? `<h5 class="rotulo">Estruturas</h5><ul class="chips chips--p">${b.estruturas.map((e) => chipLugar("estrutura", e)).join("")}</ul>`
      : "";
    return (
      `<article class="painel bioma" id="bioma-${b.id}">` +
      `<figure class="bioma-foto"><img src="${FOTO}${b.img}" alt="${esc("Captura de tela: " + nomeCompleto)}" width="640" height="360" loading="lazy"></figure>` +
      `<div class="bioma-corpo">` +
      `<header class="card-topo"><span class="slot slot--p"><img src="${IMG}${arquivoItem(b.icone)}" alt=""></span>` +
      `<div><h4>${esc(b.nome)}</h4><p class="apelido">${esc(b.apelido)}</p></div></header>` +
      (b.variantes.length ? `<p class="variantes">Vale também para: <b>${esc(b.variantes.join(", "))}</b></p>` : "") +
      `<p class="card-desc">${esc(b.descricao)}</p>` +
      `<p class="clima"><img src="${IMG}${arquivoItem(CLIMA[b.clima[0]])}" alt="">${esc(b.clima[1])}</p>` +
      `<h5 class="rotulo">Animais</h5>${animais}` +
      monstros +
      estruturas +
      dica(b.dica) +
      `</div></article>`
    );
  }

  function montarBiomas() {
    $("#lista-biomas").innerHTML = D.grupos
      .map((g) => {
        const lista = D.biomas.filter((b) => b.grupo === g.id);
        return (
          `<div class="grupo-biomas" id="grupo-${g.id}">` +
          `<h3 class="grupo-titulo"><img src="${IMG}${arquivoItem(g.icone)}" alt="">${esc(g.nome)}</h3>` +
          `<div class="biomas-grade">${lista.map(cardBioma).join("")}</div></div>`
        );
      })
      .join("");
  }

  /* =========================================================
     3. ESTRUTURAS E BAÚS
     ========================================================= */
  function listaBau(bau) {
    const itens = bau.itens
      .map(([id, a, b, p, enc]) => {
        const sub = subItem(id);
        return (
          `<li class="loot" style="--p: ${Math.min(p, 100)}%">` +
          slot(id, { encantado: !!enc, sub: enc ? "Pode vir encantado" : "" }) +
          `<span class="loot-nome">${esc(nomeItem(id) + (enc ? " (pode vir encantado)" : ""))}` +
          `<small>${quantidade(a, b)}</small>${sub ? `<small class="loot-sub">${esc(sub)}</small>` : ""}</span>` +
          `<b class="loot-chance">${chance(p)}</b></li>`
        );
      })
      .join("");
    return (
      (bau.descricao ? `<p class="bau-desc">${esc(bau.descricao)}</p>` : "") +
      `<ul class="loot-lista">${itens}</ul>` +
      `<p class="baus-legenda">${LEGENDA[bau.por]}${bau.por === "bau" ? " Item com brilho roxo vem encantado." : ""}</p>`
    );
  }

  function blocoBaus(e) {
    if (!e.baus.length) return "";
    const abas =
      e.baus.length > 1
        ? `<div class="bau-abas" role="group" aria-label="Tipo de baú">${e.baus
            .map((b, i) => `<button type="button" class="botao botao--pequeno" data-bau="${i}" aria-pressed="${i === 0}">${esc(b.nome)}</button>`)
            .join("")}</div>`
        : "";
    const soEscavacao = e.baus.every((b) => b.por === "bloco");
    const titulo = soEscavacao ? "O que dá para achar escavando" : e.baus.length > 1 ? "O que tem nos baús" : "O que tem no baú";
    return (
      `<div class="baus" data-estrutura="${e.id}">` +
      `<h4 class="baus-titulo">${slot(soEscavacao ? "brush" : "chest")}${titulo}</h4>` +
      abas +
      `<div class="bau-conteudo" aria-live="polite">${listaBau(e.baus[0])}</div>` +
      `</div>`
    );
  }

  function cardEstrutura(e) {
    const mobs = e.mobs.length
      ? `<ul class="chips chips--p">${e.mobs.map((m) => chipMob(m)).join("")}</ul>`
      : `<p class="nenhum">Nenhum mob próprio: só os do bioma em volta.</p>`;
    const destaque = ([id, t]) => {
      const icone = id.startsWith("mob:") ? `<span class="slot slot--p">${rosto(id.slice(4))}</span>` : slot(id);
      return `<li>${icone}<span>${esc(t)}</span></li>`;
    };
    return (
      `<article class="painel card-mundo${e.baus.length ? "" : " card-mundo--sem-bau"}" id="estrutura-${e.id}">` +
      `<header class="card-topo"><span class="slot"><img src="${IMG}${arquivoItem(e.icone)}" alt=""></span>` +
      `<div><h3>${esc(e.nome)}</h3><p class="apelido">${esc(e.apelido)}</p></div></header>` +
      `<figure class="card-foto"><img src="${FOTO}${e.img}" alt="${esc("Captura de tela: " + e.nome)}" width="640" height="360" loading="lazy">` +
      `<figcaption>Estrutura</figcaption></figure>` +
      `<div class="card-ficha">` +
      `<h4 class="rotulo">Onde encontrar</h4><p class="onde">${esc(e.onde)}</p>` +
      (e.biomas.length ? `<ul class="chips chips--p">${e.biomas.map((b) => chipLugar("bioma", b)).join("")}</ul>` : "") +
      `</div>` +
      `<div class="card-corpo">` +
      `<p class="card-desc">${esc(e.descricao)}</p>` +
      `<h4 class="rotulo">Mobs que aparecem</h4>${mobs}` +
      `<h4 class="rotulo">Destaques</h4><ul class="destaques">${e.destaques.map(destaque).join("")}</ul>` +
      dica(e.dica) +
      `</div>` +
      blocoBaus(e) +
      `</article>`
    );
  }

  function montarEstruturas() {
    $("#lista-estruturas").innerHTML = GRUPOS_ESTRUTURA.map(([grupo, nome, icone]) => {
      const lista = D.estruturas.filter((e) => e.grupo === grupo);
      return (
        `<div class="grupo-estruturas">` +
        `<h3 class="grupo-titulo"><img src="${IMG}${arquivoItem(icone)}" alt="">${nome}</h3>` +
        `<div class="lista-cards">${lista.map(cardEstrutura).join("")}</div></div>`
      );
    }).join("");
  }

  /* ---------- troca de baú ---------- */
  document.addEventListener("click", (ev) => {
    const bt = ev.target.closest("[data-bau]");
    if (!bt) return;
    const caixa = bt.closest(".baus");
    const e = ESTRUTURA[caixa.dataset.estrutura];
    caixa.querySelectorAll("[data-bau]").forEach((b) => b.setAttribute("aria-pressed", String(b === bt)));
    $(".bau-conteudo", caixa).innerHTML = listaBau(e.baus[+bt.dataset.bau]);
  });

  /* ---------- ir até um card (e piscar) ---------- */
  const ALVOS = /^#(bioma|estrutura|grupo)-[a-z-]+$/;

  function irPara(hash) {
    const alvo = ALVOS.test(hash) && document.getElementById(hash.slice(1));
    if (!alvo) return false;
    alvo.scrollIntoView({ block: "start" });
    if (!hash.startsWith("#grupo-")) {
      alvo.classList.remove("piscar");
      void alvo.offsetWidth; // reinicia a animação
      alvo.classList.add("piscar");
    }
    return true;
  }

  document.addEventListener("click", (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a || !ALVOS.test(a.getAttribute("href"))) return;
    ev.preventDefault();
    const hash = a.getAttribute("href");
    if (irPara(hash)) history.replaceState(null, "", hash);
  });

  window.addEventListener("hashchange", () => irPara(location.hash));

  montarGuiaRapido();
  montarIntroBiomas();
  montarBiomas();
  montarEstruturas();

  // link direto (superficie.html#estrutura-vila): os cards só existem depois do JS
  if (ALVOS.test(location.hash)) {
    let posicao = -1;
    const ir = () => {
      if (posicao !== -1 && Math.abs(window.scrollY - posicao) > 4) return; // a pessoa já rolou
      const alvo = document.getElementById(location.hash.slice(1));
      if (alvo) {
        alvo.scrollIntoView({ block: "start", behavior: "instant" });
        posicao = window.scrollY;
      }
    };
    ir();
    if (document.fonts) document.fonts.ready.then(ir);
    window.addEventListener("load", ir, { once: true });
  }
})();
