/* =============================================================
   The End
   Monta, a partir de js/dados-end.js:
     1. o guia rápido (passos, itens e lugares)
     2. o passo a passo para derrotar o Dragão de Ender
     3. o que dá para conseguir no End
     4. os lugares do End, com os baús
   ============================================================= */
(function () {
  "use strict";

  const D = window.MINEGUIA_END;
  const MG = window.MineGuia || {};
  if (!D) return;

  const IMG = "assets/img/itens/";
  const FOTO = "assets/img/end/";
  const esc = MG.escapar || ((t) => String(t));
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const LUGAR = Object.fromEntries(D.lugares.map((l) => [l.id, l]));
  const TIPO = { passivo: "Passivo", neutro: "Neutro", hostil: "Hostil" };

  /* ---------- peças pequenas ---------- */
  const nome = (k) => (D.icones[k] ? D.icones[k][0] : k);
  const src = (k) => IMG + (D.icones[k] ? D.icones[k][1] : k + ".png");

  function brilho(s) {
    return `<span class="brilho" style="-webkit-mask-image: url('${s}'); mask-image: url('${s}')"></span>`;
  }

  function slot(k, { classe = "slot--p", qtd = 0, encantado = false, sub = "" } = {}) {
    return (
      `<span class="slot ${classe}" data-tip="${esc(nome(k))}"${sub ? ` data-tip-sub="${esc(sub)}"` : ""}><img src="${src(k)}" alt="${esc(nome(k))}">` +
      (encantado ? brilho(src(k)) : "") +
      (qtd > 1 ? `<span class="qtd">${qtd}</span>` : "") +
      `</span>`
    );
  }

  function grade3x3(celulas) {
    return `<span class="grade3" aria-hidden="true">${celulas
      .map((k) => `<span class="slot slot--r">${k ? `<img src="${src(k)}" alt="">` : ""}</span>`)
      .join("")}</span>`;
  }

  const rosto = (m) => `<img class="rosto" src="${FOTO}mob-${m}.png" alt="">`;

  function chipMob(m) {
    const x = D.mobs[m];
    return `<li><span class="chip chip--${x.tipo}" data-tip="${esc(x.nome)}" data-tip-sub="${esc(TIPO[x.tipo] + " · " + x.desc)}">${rosto(m)}<span>${esc(x.nome)}</span></span></li>`;
  }

  function dica(texto) {
    return `<p class="minerio-dica"><img src="${IMG}ender_eye.png" alt=""><span><b>Dica:</b> ${esc(texto)}</span></p>`;
  }

  const numero = (n) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const chance = (p) => (p >= 99.95 ? "Sempre" : (p >= 10 ? Math.round(p) : numero(p)) + "%");
  const quantidade = (a, b) => `${a === b ? a : `${a} a ${b}`} ${a === 1 && b === 1 ? "unidade" : "unidades"}`;

  /* =========================================================
     1. GUIA RÁPIDO
     ========================================================= */
  function atalho(href, icone, texto) {
    return `<a class="atalho" href="${href}"><span class="passo-icone"><img src="${src(icone)}" alt=""></span><b>${esc(texto)}</b></a>`;
  }

  function montarGuiaRapido() {
    $("#trilha-end").innerHTML = D.passos
      .map(
        (p, i) => `<li class="passo"><a href="#passo-${p.id}">
          <span class="passo-icone"><img src="${src(p.icone)}" alt=""></span>
          <b>${i + 1}. ${esc(p.titulo)}</b><small>${esc(p.curto)}</small></a></li>`
      )
      .join("");
    $("#atalhos-itens").innerHTML = D.itens.map((i) => atalho("#item-" + i.id, i.icone, i.nome)).join("");
    $("#atalhos-lugares").innerHTML = D.lugares.map((l) => atalho("#lugar-" + l.id, l.icone, l.nome)).join("");
  }

  /* =========================================================
     2. PASSO A PASSO
     ========================================================= */
  function kit() {
    const linha = ([k, n, motivo, essencial]) =>
      `<li class="kit-item${essencial ? "" : " kit-item--extra"}">${slot(k, { classe: "" })}<div><b>${esc(n)}</b>` +
      `<span class="kit-tag">${essencial ? "Essencial" : "Ajuda muito"}</span><small>${esc(motivo)}</small></div></li>`;
    return `<ul class="kit">${D.kit.map(linha).join("")}</ul>`;
  }

  function cardPasso(p, i) {
    const textos = p.id === "preparar" ? `<p class="passo-intro">${esc(p.texto[0])}</p>${kit()}` : `<ul class="lista-passo">${p.texto.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    const facil = p.facil
      ? `<div class="caixa-facil"><h4>${slot("diamond_sword")}O jeito mais fácil</h4><ol>${p.facil.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>`
      : "";
    const avancado = p.avancado ? `<div class="caixa-avancado"><h4>${slot("red_bed")}Jeito rápido (para quem tem experiência)</h4><p>${esc(p.avancado)}</p></div>` : "";
    const link = p.link ? `<a class="botao botao--pequeno" href="${p.link[0]}"><img src="${IMG}compass.gif" alt="">${esc(p.link[1])}</a>` : "";
    const foto = p.img ? `<figure class="passo-foto"><img src="${FOTO}${p.img}" alt="${esc("Captura de tela: " + p.titulo)}" width="640" height="360" loading="lazy"></figure>` : "";
    return (
      `<article class="painel passo-end${p.img ? " passo-end--foto" : ""}" id="passo-${p.id}">` +
      `<header class="passo-end-topo"><span class="passo-num">${i + 1}</span>${slot(p.icone, { classe: "" })}<h3>${esc(p.titulo)}</h3></header>` +
      `<div class="passo-end-corpo">${textos}${facil}${avancado}${link}${dica(p.dica)}</div>` +
      foto +
      `</article>`
    );
  }

  function montarPassos() {
    $("#lista-passos").innerHTML = `<div class="passos-end">${D.passos.map(cardPasso).join("")}</div>`;
  }

  /* =========================================================
     3. ITENS
     ========================================================= */
  function cardItem(it) {
    const l = LUGAR[it.lugar];
    const receita = it.receita
      ? `<div class="receita-corpo">${grade3x3(it.receita[0])}<span class="seta" aria-hidden="true"></span>${slot(it.receita[1], { classe: "slot--g", qtd: it.receita[2] || 1 })}</div>`
      : "";
    const link = it.link ? `<a class="botao botao--pequeno" href="${it.link[0]}">${esc(it.link[1])}</a>` : "";
    return (
      `<article class="painel item-end" id="item-${it.id}">` +
      `<header class="item-end-topo">${slot(it.icone, { classe: "slot--g" })}<h3>${esc(it.nome)}</h3></header>` +
      `<p class="item-onde"><b>Onde:</b> ${esc(it.onde)}</p>` +
      `<p class="item-uso"><b>Para que serve:</b> ${esc(it.uso)}</p>` +
      receita +
      `<div class="item-rodape"><a class="chip" href="#lugar-${l.id}"><img src="${src(l.icone)}" alt=""><span>${esc(l.nome)}</span></a>${link}</div>` +
      `</article>`
    );
  }

  function montarItens() {
    $("#lista-itens").innerHTML = `<div class="itens-end">${D.itens.map(cardItem).join("")}</div>`;
  }

  /* =========================================================
     4. LUGARES E BAÚS
     ========================================================= */
  function listaBau(bau) {
    const itens = bau.itens
      .map(([id, a, b, p, enc]) => {
        return (
          `<li class="loot" style="--p: ${Math.min(p, 100)}%">` +
          slot(id, { encantado: !!enc, sub: enc ? "Vem encantado" : "" }) +
          `<span class="loot-nome">${esc(nome(id) + (enc ? " (encantado)" : ""))}<small>${quantidade(a, b)}</small></span>` +
          `<b class="loot-chance">${chance(p)}</b></li>`
        );
      })
      .join("");
    return (
      `<p class="bau-desc">${esc(bau.descricao)}</p><ul class="loot-lista">${itens}</ul>` +
      `<p class="baus-legenda">A porcentagem é a chance de o item aparecer em um baú. Item com brilho roxo vem encantado.</p>`
    );
  }

  function cardLugar(l) {
    const mobs = l.mobs.length ? `<ul class="chips chips--p">${l.mobs.map(chipMob).join("")}</ul>` : `<p class="nenhum">Nenhum mob mora aqui.</p>`;
    const biomas = l.biomas ? `<ul class="biomas-end">${l.biomas.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "";
    const baus = l.baus.length
      ? `<div class="baus"><h4 class="baus-titulo">${slot("chest")}O que tem nos baús</h4><div class="bau-conteudo">${listaBau(l.baus[0])}</div></div>`
      : "";
    return (
      `<article class="painel card-mundo${l.baus.length ? "" : " card-mundo--sem-bau"}" id="lugar-${l.id}">` +
      `<header class="card-topo"><span class="slot"><img src="${src(l.icone)}" alt=""></span><div><h3>${esc(l.nome)}</h3><p class="apelido">${esc(l.apelido)}</p></div></header>` +
      `<figure class="card-foto"><img src="${FOTO}${l.img}" alt="${esc("Captura de tela: " + l.nome)}" width="640" height="360" loading="lazy"><figcaption>The End</figcaption></figure>` +
      `<div class="card-ficha"><h4 class="rotulo">Onde fica</h4><p class="onde">${esc(l.onde)}</p>${biomas}</div>` +
      `<div class="card-corpo"><p class="card-desc">${esc(l.descricao)}</p>` +
      `<h4 class="rotulo">Mobs</h4>${mobs}` +
      `<h4 class="rotulo">Destaques</h4><ul class="destaques">${l.destaques.map(([k, t]) => `<li>${slot(k)}<span>${esc(t)}</span></li>`).join("")}</ul>` +
      dica(l.dica) +
      `</div>` +
      baus +
      `</article>`
    );
  }

  function montarLugares() {
    $("#lista-lugares").innerHTML = D.lugares.map(cardLugar).join("");
  }

  /* ---------- ir até um card (e piscar) ---------- */
  const ALVOS = /^#(passo|item|lugar)-[a-z-]+$/;

  function irPara(hash) {
    const alvo = ALVOS.test(hash) && document.getElementById(hash.slice(1));
    if (!alvo) return false;
    alvo.scrollIntoView({ block: "start" });
    alvo.classList.remove("piscar");
    void alvo.offsetWidth; // reinicia a animação
    alvo.classList.add("piscar");
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
  montarPassos();
  montarItens();
  montarLugares();

  // link direto (end.html#item-elitros): os cards só existem depois do JS
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
