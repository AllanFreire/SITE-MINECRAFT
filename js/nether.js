/* =============================================================
   Rumo ao Nether
   Monta, a partir de js/dados-nether.js:
     1. o guia rápido (clique num bioma ou numa estrutura)
     2. os cards dos biomas, com os mobs de cada um
     3. os cards das estruturas, com os mobs e os baús
     4. a lista de mobs do Nether
   ============================================================= */
(function () {
  "use strict";

  const D = window.MINEGUIA_NETHER;
  const MG = window.MineGuia || {};
  if (!D) return;

  const IMG = "assets/img/itens/";
  const FOTO = "assets/img/nether/";
  const esc = MG.escapar || ((t) => String(t));
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const BIOMA = Object.fromEntries(D.biomas.map((b) => [b.id, b]));
  const ESTRUTURA = Object.fromEntries(D.estruturas.map((e) => [e.id, e]));
  // [nome, plural, o que faz]
  const TIPOS = {
    passivo: ["Passivo", "Passivos", "Nunca ataca"],
    neutro: ["Neutro", "Neutros", "Só ataca se você provocar"],
    hostil: ["Hostil", "Hostis", "Ataca assim que te vê"],
  };

  /* ---------- peças pequenas ---------- */
  const nomeItem = (id) => (D.itens[id] ? D.itens[id][0] : id);
  const srcItem = (id) => IMG + (D.itens[id] ? D.itens[id][1] : id + ".png");

  function brilho(src) {
    return `<span class="brilho" style="-webkit-mask-image: url('${src}'); mask-image: url('${src}')"></span>`;
  }

  function slot(id, { classe = "slot--p", encantado = false, sub = "" } = {}) {
    const src = srcItem(id);
    return (
      `<span class="slot ${classe}" data-tip="${esc(nomeItem(id))}"${sub ? ` data-tip-sub="${esc(sub)}"` : ""}>` +
      `<img src="${src}" alt="${esc(nomeItem(id))}">${encantado ? brilho(src) : ""}</span>`
    );
  }

  const rosto = (id) => `<img class="rosto" src="${FOTO}mob-${id}.png" alt="">`;

  function dica(texto, icone) {
    return `<p class="minerio-dica"><img src="${icone || IMG + "torch.png"}" alt="">${esc(texto)}</p>`;
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

  /* chips de mob que levam até o card do mob */
  function chipMob(id, extra) {
    const m = D.mobs[id];
    const freq = extra ? `<span class="freq freq--${extra.replace(/\s+/g, "-").normalize("NFD").replace(/[̀-ͯ]/g, "")}">${esc(extra)}</span>` : "";
    return `<li><a class="chip chip--${m.tipo}" href="#mob-${id}">${rosto(id)}<span>${esc(m.nome)}</span>${freq}</a></li>`;
  }

  function chipLugar(tipo, id) {
    const x = tipo === "bioma" ? BIOMA[id] : ESTRUTURA[id];
    return `<li><a class="chip" href="#${tipo}-${id}"><img src="${srcItem(x.icone)}" alt=""><span>${esc(x.nome)}</span></a></li>`;
  }

  function foto(x, rotulo) {
    return (
      `<figure class="card-foto"><img src="${FOTO}${x.img}" alt="${esc(rotulo + ": " + x.nome)}" width="720" height="405" loading="lazy">` +
      `<figcaption>${esc(rotulo)}</figcaption></figure>`
    );
  }

  function topo(x) {
    return (
      `<header class="card-topo"><span class="slot"><img src="${srcItem(x.icone)}" alt=""></span>` +
      `<div><h3>${esc(x.nome)}</h3><p class="apelido">${esc(x.apelido)}</p></div></header>`
    );
  }

  /* =========================================================
     1. GUIA RÁPIDO
     ========================================================= */
  function atalho(tipo, x, legenda) {
    return (
      `<a class="atalho" href="#${tipo}-${x.id}">` +
      `<span class="passo-icone"><img src="${srcItem(x.icone)}" alt=""></span>` +
      `<b>${esc(x.nome)}</b><small>${esc(legenda)}</small></a>`
    );
  }

  function montarGuiaRapido() {
    $("#atalhos-biomas").innerHTML = D.biomas.map((b) => atalho("bioma", b, b.apelido)).join("");
    $("#atalhos-estruturas").innerHTML = D.estruturas.map((e) => atalho("estrutura", e, e.apelido)).join("");
  }

  /* =========================================================
     2. BIOMAS
     ========================================================= */
  function perigo(n) {
    let fogo = "";
    for (let i = 1; i <= 5; i++) fogo += `<img class="${i <= n ? "" : "apagado"}" src="${IMG}fire_charge.png" alt="">`;
    const texto = ["", "Tranquilo", "Fácil", "Médio", "Difícil", "Muito difícil"][n];
    return `<p class="perigo"><span class="perigo-rotulo">Perigo</span><span class="perigo-fogo" role="img" aria-label="${n} de 5">${fogo}</span><b>${texto}</b></p>`;
  }

  function cardBioma(b) {
    return (
      `<article class="painel card-mundo" id="bioma-${b.id}" style="--cor: ${b.neblina}">` +
      topo(b) +
      foto(b, "Bioma") +
      `<div class="card-ficha">` +
      perigo(b.perigo) +
      `<p class="clima"><span class="amostra" style="background: ${b.neblina}" aria-hidden="true"></span>${esc(b.clima)}</p>` +
      `<h4 class="rotulo">Blocos que você encontra</h4>` +
      `<div class="blocos">${b.blocos.map((x) => slot(x)).join("")}</div>` +
      `</div>` +
      `<div class="card-corpo">` +
      `<p class="card-desc">${esc(b.descricao)}</p>` +
      `<h4 class="rotulo">Mobs que aparecem</h4>` +
      `<ul class="chips">${b.mobs.map(([m, f]) => chipMob(m, f)).join("")}</ul>` +
      `<h4 class="rotulo">Estruturas que podem aparecer</h4>` +
      `<ul class="chips">${b.estruturas.map((e) => chipLugar("estrutura", e)).join("")}</ul>` +
      dica(b.dica) +
      `</div></article>`
    );
  }

  /* =========================================================
     3. ESTRUTURAS E BAÚS
     ========================================================= */
  function listaBau(bau) {
    const itens = bau.itens
      .map(([id, a, b, p, enc]) => {
        const nome = nomeItem(id) + (enc ? " (encantado)" : "");
        return (
          `<li class="loot" style="--p: ${Math.min(p, 100)}%">` +
          slot(id, { encantado: !!enc, sub: enc ? "Pode vir encantado" : "" }) +
          `<span class="loot-nome">${esc(nome)}<small>${quantidade(a, b)}</small></span>` +
          `<b class="loot-chance">${chance(p)}</b></li>`
        );
      })
      .join("");
    return `<p class="bau-desc">${esc(bau.descricao)}</p><ul class="loot-lista">${itens}</ul>`;
  }

  function blocoBaus(e) {
    if (!e.baus.length) return "";
    const abas =
      e.baus.length > 1
        ? `<div class="bau-abas" role="group" aria-label="Tipo de baú">${e.baus
            .map((b, i) => `<button type="button" class="botao botao--pequeno" data-bau="${i}" aria-pressed="${i === 0}">${esc(b.nome)}</button>`)
            .join("")}</div>`
        : "";
    return (
      `<div class="baus" data-estrutura="${e.id}">` +
      `<h4 class="baus-titulo">${slot("chest", { classe: "slot--p" })}O que tem ${e.baus.length > 1 ? "nos baús" : "no baú"}</h4>` +
      abas +
      `<div class="bau-conteudo" aria-live="polite">${listaBau(e.baus[0])}</div>` +
      `<p class="baus-legenda">A porcentagem é a chance de o item aparecer em um baú. Item com brilho roxo vem encantado.</p>` +
      `</div>`
    );
  }

  function cardEstrutura(e) {
    const onde = D.biomas.filter((b) => b.estruturas.includes(e.id));
    const mobs = e.mobs.length
      ? `<ul class="chips">${e.mobs.map((m) => chipMob(m)).join("")}</ul>`
      : `<p class="nenhum">Nenhum mob próprio: só os mobs do bioma em volta.</p>`;
    const icone = e.id === "fossil" ? FOTO + "mob-happy_ghast.png" : "";
    return (
      `<article class="painel card-mundo${e.baus.length ? "" : " card-mundo--sem-bau"}" id="estrutura-${e.id}">` +
      topo(e) +
      foto(e, "Estrutura") +
      `<div class="card-ficha">` +
      `<h4 class="rotulo">Onde aparece</h4>` +
      `<ul class="chips">${onde.map((b) => chipLugar("bioma", b.id)).join("")}</ul>` +
      `</div>` +
      `<div class="card-corpo">` +
      `<p class="card-desc">${esc(e.descricao)}</p>` +
      `<h4 class="rotulo">Mobs que aparecem</h4>` +
      mobs +
      `<h4 class="rotulo">Destaques</h4>` +
      `<ul class="destaques">${e.destaques.map(([id, t]) => `<li>${slot(id)}<span>${esc(t)}</span></li>`).join("")}</ul>` +
      dica(e.dica, icone) +
      `</div>` +
      blocoBaus(e) +
      `</article>`
    );
  }

  /* =========================================================
     4. MOBS
     ========================================================= */
  function cardMob(id) {
    const m = D.mobs[id];
    const lugares = m.biomas.map((b) => chipLugar("bioma", b)).concat(m.estruturas.map((e) => chipLugar("estrutura", e)));
    return (
      `<article class="painel mob" id="mob-${id}">` +
      `<header class="mob-topo"><span class="passo-icone">${rosto(id)}</span>` +
      `<div><h4>${esc(m.nome)}</h4><span class="tag-tipo tag-tipo--${m.tipo}">${TIPOS[m.tipo][0]}</span></div></header>` +
      `<p class="mob-desc">${esc(m.descricao)}</p>` +
      `<p class="mob-rotulo">Onde aparece</p><ul class="chips chips--p">${lugares.join("")}</ul>` +
      `<p class="mob-rotulo">Pode soltar</p><div class="blocos">${m.drops.map((x) => slot(x)).join("")}</div>` +
      `</article>`
    );
  }

  function montarMobs() {
    const grupos = ["passivo", "neutro", "hostil"].map((tipo) => {
      const ids = Object.keys(D.mobs).filter((id) => D.mobs[id].tipo === tipo);
      return (
        `<div class="grupo-mobs">` +
        `<h3 class="grupo-mobs-titulo"><span class="tag-tipo tag-tipo--${tipo}">${TIPOS[tipo][ids.length > 1 ? 1 : 0]}</span><small>${TIPOS[tipo][2]}</small></h3>` +
        `<div class="mobs-grade">${ids.map(cardMob).join("")}</div></div>`
      );
    });
    $("#lista-mobs").innerHTML = grupos.join("");
  }

  /* ---------- troca de baú (bastião tem 4 tipos) ---------- */
  document.addEventListener("click", (ev) => {
    const bt = ev.target.closest("[data-bau]");
    if (!bt) return;
    const caixa = bt.closest(".baus");
    const e = ESTRUTURA[caixa.dataset.estrutura];
    caixa.querySelectorAll("[data-bau]").forEach((b) => b.setAttribute("aria-pressed", String(b === bt)));
    $(".bau-conteudo", caixa).innerHTML = listaBau(e.baus[+bt.dataset.bau]);
  });

  /* ---------- ir até um card (e piscar) ---------- */
  const ALVOS = /^#(bioma|estrutura|mob)-[a-z_-]+$/;

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
  $("#lista-biomas").innerHTML = D.biomas.map(cardBioma).join("");
  $("#lista-estruturas").innerHTML = D.estruturas.map(cardEstrutura).join("");
  montarMobs();

  // link direto (nether.html#estrutura-bastiao): os cards só existem depois do JS
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
