/* =============================================================
   As Poções
   Monta, a partir de js/dados-pocoes.js:
     1. o seletor "Qual poção você quer fazer?" e o passo a passo
     2. a seção "Como fazer poções"
     3. a lista com todas as poções
   ============================================================= */
(function () {
  "use strict";

  const D = window.MINEGUIA_POCOES;
  const MG = window.MineGuia || {};
  if (!D) return;

  const IMG = "assets/img/itens/";
  const esc = MG.escapar || ((t) => String(t));
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const POCAO = Object.fromEntries(D.pocoes.map((p) => [p.id, p]));

  /* ---------- peças pequenas ---------- */
  const nome = (k) => (D.itens[k] ? D.itens[k][0] : k);
  const src = (k) => IMG + (D.itens[k] ? D.itens[k][1] : k + ".png");

  function slot(k, classe = "slot--p", qtd) {
    return (
      `<span class="slot ${classe}" data-tip="${esc(nome(k))}"><img src="${src(k)}" alt="${esc(nome(k))}">` +
      (qtd ? `<span class="qtd">${qtd}</span>` : "") +
      `</span>`
    );
  }

  function grade3x3(celulas) {
    return `<span class="grade3" aria-hidden="true">${celulas
      .map((k) => `<span class="slot slot--r">${k ? `<img src="${src(k)}" alt="">` : ""}</span>`)
      .join("")}</span>`;
  }

  const chave = (id) => (id === "agua" || id === "estranha" ? "base:" + id : "potion:" + id);
  const nomeCurto = (p) => p.nome.replace(/^Poção (de |do |da )?/, "").replace(/^./, (c) => c.toUpperCase());

  // segundos -> "3:00" (as poções II de veneno e regeneração têm frações: o jogo mostra arredondado para baixo)
  function tempo(s) {
    if (s === null || s === undefined) return null;
    const t = Math.floor(s);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  }

  // do frasco de água até a poção: [de, ingrediente, para]
  function cadeia(p) {
    const passos = [];
    if (p.base === "estranha") passos.push(["base:agua", "nether_wart", "base:estranha"]);
    else if (p.base !== "agua") passos.push(...cadeia(POCAO[p.base]));
    passos.push([chave(p.base), p.ingrediente, "potion:" + p.id]);
    return passos;
  }

  function peca(k, legenda) {
    return `<span class="peca">${slot(k, "slot--g")}<small>${esc(legenda || nome(k))}</small></span>`;
  }

  /* =========================================================
     1. O PASSO A PASSO
     ========================================================= */
  function textoDoPasso([de, ing, para]) {
    if (ing === "nether_wart") return `Coloque até 3 Frascos de Água embaixo e o Fungo do Nether em cima. Sai a ${nome(para)}, a base de quase todas as poções.`;
    if (de === "base:agua") return `Coloque até 3 Frascos de Água embaixo e o ${nome(ing)} em cima.`;
    return `Coloque até 3 frascos de ${nome(de)} embaixo e ${artigo(ing)} ${nome(ing)} em cima.`;
  }

  // "o" ou "a" antes do ingrediente
  function artigo(k) {
    const n = nome(k);
    return /^(Fatia|Lágrima|Cenoura|Membrana|Vara|Teia|Pedra)/.test(n) ? "a" : "o";
  }

  function variantes(p) {
    const v = [];
    if (p.segundos[1]) v.push(["redstone", "potion:" + p.id, "Mais tempo", `${p.nome} que dura ${tempo(p.segundos[1])}`]);
    if (p.forte) {
      const quanto = p.segundos[2] ? `, mas dura só ${tempo(p.segundos[2])}` : "";
      v.push(["glowstone_dust", "potion:" + p.id, "Mais forte", `${p.nome} ${p.forte}${quanto}`]);
    }
    v.push(["gunpowder", "splash_potion:" + p.id, "Para arremessar", `${nome("splash_potion:" + p.id)}: afeta quem estiver perto de onde ela cair`]);
    v.push(["dragon_breath", "lingering_potion:" + p.id, "Nuvem no chão", `Na arremessável, vira a ${nome("lingering_potion:" + p.id)}, que deixa no chão uma nuvem com o efeito`]);
    return v;
  }

  function tabelaTempos(p) {
    const inst = p.segundos[0] === null;
    const col = (s, div) => (inst ? "na hora" : s ? tempo(s / div) : "—");
    const linhas = [
      ["Para beber", 1],
      ["Arremessável", 1],
      ["Prolongada (nuvem)", 4],
      ["Flecha", 8],
    ];
    const temLonga = !!p.segundos[1];
    const temForte = !!p.forte;
    const th = `<tr><th>Versão</th><th>Normal</th>${temLonga ? "<th>Com redstone</th>" : ""}${temForte ? `<th>${esc(p.forte)} (pedra-luminosa)</th>` : ""}</tr>`;
    const tds = linhas
      .map(([rot, div]) => {
        const forte = inst ? "na hora" : col(p.segundos[2], div);
        return `<tr><th>${rot}</th><td>${col(p.segundos[0], div)}</td>${temLonga ? `<td>${col(p.segundos[1], div)}</td>` : ""}${temForte ? `<td>${forte}</td>` : ""}</tr>`;
      })
      .join("");
    return `<div class="tabela-rolagem"><table class="tempos">${th}${tds}</table></div>`;
  }

  function resultado(id) {
    const p = POCAO[id];
    const passos = cadeia(p)
      .map(
        (ps, i) => `<li class="passo-pocao"><span class="passo-num">${i + 1}</span>
          <div><div class="receita-pocao">${peca(ps[0])}<span class="mais" aria-hidden="true">+</span>${peca(ps[1])}<span class="seta" aria-hidden="true"></span>${peca(ps[2])}</div>
          <p>${esc(textoDoPasso(ps))}</p></div></li>`
      )
      .join("");
    const turbo = variantes(p)
      .map(([ing, res, rot, txt]) => `<li>${slot(ing)}<span class="mais" aria-hidden="true">→</span>${slot(res)}<span><b>${rot}:</b> ${esc(txt)}</span></li>`)
      .join("");
    const flecha =
      `<li>${slot("arrow", "slot--p", 8)}<span class="mais" aria-hidden="true">+</span>${slot("lingering_potion:" + p.id)}` +
      `<span class="mais" aria-hidden="true">→</span>${slot("tipped_arrow:" + p.id, "slot--p", 8)}` +
      `<span><b>Flechas:</b> 8 flechas em volta de 1 Poção Prolongada, na bancada, viram 8 ${esc(nome("tipped_arrow:" + p.id).replace(/^Flecha/, "Flechas"))}</span></li>`;
    return `<div class="painel melhor-painel receita-painel" id="receita-${p.id}">
        <div class="melhor-topo">
          ${slot("potion:" + p.id, "slot--g")}
          <div>
            <small class="melhor-rotulo">Como fazer</small>
            <h3>${esc(p.nome)}</h3>
            <span class="efeito-tag">Efeito: ${esc(p.efeitoNome)}</span>
          </div>
        </div>
        <p class="receita-efeito">${esc(p.efeito)}</p>
        <div class="melhor-colunas">
          <div>
            <h4>Passo a passo</h4>
            <ol class="passos-pocao">${passos}</ol>
          </div>
          <div>
            <h4>Turbine a sua poção</h4>
            <ul class="variantes">${turbo}${flecha}</ul>
            ${p.segundos[1] && p.forte ? `<p class="obs">Redstone e pedra-luminosa não se somam: ou a poção dura mais, ou fica mais forte.</p>` : ""}
            <p class="minerio-dica"><img src="${IMG}brewing_stand.png" alt=""><span><b>Dica:</b> ${esc(p.dica)}</span></p>
          </div>
        </div>
        <h4>Quanto tempo dura</h4>
        ${tabelaTempos(p)}
      </div>`;
  }

  function selecionar(id, atualizarEndereco, rolar) {
    if (!POCAO[id]) return;
    document.querySelectorAll("[data-pocao]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.pocao === id ? "true" : "false"));
    $("#receita-resultado").innerHTML = resultado(id);
    if (atualizarEndereco) history.replaceState(null, "", "#receita-" + id);
    if (rolar) {
      // leva até o passo a passo se ele estiver lá embaixo, fora da tela
      const alvo = $("#receita-resultado");
      if (alvo.getBoundingClientRect().top > window.innerHeight * 0.55) alvo.scrollIntoView({ block: "start" });
    }
  }

  function montarSeletor() {
    $("#seletor-pocoes").innerHTML = D.grupos
      .map((g) => {
        const botoes = D.pocoes
          .filter((p) => p.grupo === g.id)
          .map(
            (p) => `<button type="button" class="escolha-item" data-pocao="${p.id}" aria-pressed="false">
              <span class="passo-icone"><img src="${src("potion:" + p.id)}" alt=""></span><b>${esc(nomeCurto(p))}</b></button>`
          )
          .join("");
        return `<div class="grupo-escolha"><h3 class="grupo-escolha-titulo">${esc(g.nome)} <small>${esc(g.desc)}</small></h3>
          <div class="seletor seletor--pocoes" role="group" aria-label="${esc(g.nome)}">${botoes}</div></div>`;
      })
      .join("");
    $("#seletor-pocoes").addEventListener("click", (e) => {
      const b = e.target.closest("[data-pocao]");
      if (b) selecionar(b.dataset.pocao, true, true);
    });
    const doEndereco = location.hash.startsWith("#receita-") ? location.hash.slice(9) : "";
    selecionar(POCAO[doEndereco] ? doEndereco : D.pocoes[0].id, false, false);
  }

  /* =========================================================
     2. COMO FAZER POÇÕES
     ========================================================= */
  function montarComo() {
    const mods = [
      ["redstone", "Mais tempo", "A poção dura mais (quase sempre 8 minutos em vez de 3)."],
      ["glowstone_dust", "Mais forte", "O efeito sobe para o nível II, mas dura menos."],
      ["gunpowder", "Arremessável", "Vira uma poção de jogar, que afeta quem estiver perto."],
      ["dragon_breath", "Prolongada", "Na arremessável, vira uma nuvem que fica no chão. O Bafo do Dragão é pego com um frasco de vidro no End."],
      ["fermented_spider_eye", "Inverte o efeito", "Agilidade vira Lentidão, Cura vira Dano, Visão Noturna vira Invisibilidade."],
    ]
      .map(([k, t, txt]) => `<li>${slot(k)}<span><b>${t}:</b> ${esc(txt)}</span></li>`)
      .join("");

    $("#como-app").innerHTML = `<div class="como-grade">
        <article class="painel como">
          <h3>${slot("brewing_stand")}Suporte de Poções</h3>
          <div class="receita-corpo">${grade3x3([null, null, null, null, "blaze_rod", null, "cobblestone", "cobblestone", "cobblestone"])}<span class="seta" aria-hidden="true"></span>${slot("brewing_stand", "slot--g")}</div>
          <ul class="como-lista">
            <li>1 <b>Vara de Blaze</b> e 3 pedregulhos (comum, de pedra-negra ou de ardosiabissal).</li>
            <li>Embaixo vão até <b>3 frascos</b> de uma vez; em cima, o <b>ingrediente</b>; e no canto, o <b>combustível</b>.</li>
            <li>O ingrediente vale para os 3 frascos: faça sempre de 3 em 3.</li>
          </ul>
        </article>

        <article class="painel como">
          <h3>${slot("blaze_powder")}Combustível: Pó de Blaze</h3>
          <div class="receita-corpo">${slot("blaze_rod", "slot--g")}<span class="seta" aria-hidden="true"></span>${slot("blaze_powder", "slot--g", 2)}</div>
          <ul class="como-lista">
            <li>Cada Vara de Blaze vira <b>2 Pós de Blaze</b>.</li>
            <li>Cada pó dá para <b>20 preparos</b>.</li>
            <li>As varas vêm dos Blazes, que só aparecem nas <a href="nether.html#estrutura-fortaleza">Fortalezas do Nether</a>.</li>
          </ul>
        </article>

        <article class="painel como">
          <h3>${slot("glass_bottle")}Frascos de Água</h3>
          <div class="receita-corpo">${grade3x3(["glass", null, "glass", null, "glass", null, null, null, null])}<span class="seta" aria-hidden="true"></span>${slot("glass_bottle", "slot--g", 3)}</div>
          <ul class="como-lista">
            <li>3 blocos de vidro fazem <b>3 frascos</b>.</li>
            <li>Use o frasco na água (rio, lago ou um caldeirão cheio) para ter o <b>${esc(nome("base:agua"))}</b>.</li>
            <li>Uma fonte infinita de água (2 baldes num buraco 2×2) ajuda muito.</li>
          </ul>
        </article>

        <article class="painel como">
          <h3>${slot("nether_wart")}A base de tudo: Poção Estranha</h3>
          <div class="receita-corpo">${slot("base:agua", "slot--g")}<span class="troca-mais">+</span>${slot("nether_wart", "slot--g")}<span class="seta" aria-hidden="true"></span>${slot("base:estranha", "slot--g")}</div>
          <ul class="como-lista">
            <li>Quase toda poção começa com o <b>Fungo do Nether</b> no frasco de água.</li>
            <li>Ele nasce nas <a href="nether.html#estrutura-fortaleza">Fortalezas do Nether</a>, perto das escadas. Plante na <b>areia das almas</b> para nunca mais faltar.</li>
            <li>Errou o ingrediente? Sem o fungo, sai a <b>Poção Comum</b> ou a <b>Espessa</b>, que não fazem nada.</li>
          </ul>
        </article>

        <article class="painel como como--largo">
          <h3>${slot("redstone")}Os modificadores</h3>
          <p class="como-obs">Coloque em cima de uma poção pronta para mudar o jeito como ela funciona:</p>
          <ul class="como-fontes">${mods}</ul>
          <p class="como-obs"><b>Duração:</b> a arremessável dura o mesmo que a de beber; a prolongada, 1/4; e a flecha, 1/8.</p>
        </article>

        <article class="painel como">
          <h3>${slot("tipped_arrow:veneno")}Flechas com efeito</h3>
          <div class="receita-corpo">${grade3x3(["arrow", "arrow", "arrow", "arrow", "lingering_potion:veneno", "arrow", "arrow", "arrow", "arrow"])}<span class="seta" aria-hidden="true"></span>${slot("tipped_arrow:veneno", "slot--g", 8)}</div>
          <ul class="como-lista">
            <li>8 flechas em volta de 1 <b>Poção Prolongada</b>, na bancada, viram 8 flechas com o efeito.</li>
            <li>Funciona com qualquer poção: flechas de Lentidão e de Dano são ótimas contra mobs difíceis.</li>
          </ul>
        </article>
      </div>`;
  }

  /* =========================================================
     3. TODAS AS POÇÕES
     ========================================================= */
  function cardPocao(p) {
    const ultimo = cadeia(p).pop();
    const tempos = [
      ["Normal", p.segundos[0] === null ? "na hora" : tempo(p.segundos[0])],
      p.segundos[1] ? ["Com redstone", tempo(p.segundos[1])] : null,
      p.forte ? [p.forte, p.segundos[2] ? tempo(p.segundos[2]) : "na hora"] : null,
    ].filter(Boolean);
    return `<article class="painel pocao-card" id="pocao-${p.id}">
        <header class="pocao-topo">${slot("potion:" + p.id)}<div><h4>${esc(p.nome)}</h4><span class="efeito-tag">${esc(p.efeitoNome)}</span></div></header>
        <p class="pocao-desc">${esc(p.efeito)}</p>
        <div class="mini-receita">${slot(ultimo[0])}<span class="mais" aria-hidden="true">+</span>${slot(ultimo[1])}<span class="mais" aria-hidden="true">→</span>${slot(ultimo[2])}
          <small>${esc(nome(ultimo[0]))} + ${esc(nome(ultimo[1]))}</small></div>
        <ul class="pocao-tempos">${tempos.map(([r, t]) => `<li><b>${esc(r)}</b> ${t}</li>`).join("")}</ul>
        <a class="botao botao--pequeno" href="#receita-${p.id}"><img src="${IMG}brewing_stand.png" alt="">Ver o passo a passo</a>
      </article>`;
  }

  function montarTodas() {
    $("#todas-app").innerHTML = D.grupos
      .map(
        (g) => `<div class="grupo-pocoes">
          <h3 class="grupo-enc-titulo">${esc(g.nome)} <small>${esc(g.desc)}</small></h3>
          <div class="pocoes-grade">${D.pocoes.filter((p) => p.grupo === g.id).map(cardPocao).join("")}</div>
        </div>`
      )
      .join("");
  }

  /* ---------- links #receita-xxx (os botões dos cards) ---------- */
  function irParaReceita(id) {
    if (!POCAO[id]) return;
    selecionar(id, true, false);
    $("#receita-resultado").scrollIntoView({ block: "start" });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#receita-"]');
    if (!a) return;
    e.preventDefault();
    irParaReceita(a.getAttribute("href").slice(9));
  });
  window.addEventListener("hashchange", () => {
    if (location.hash.startsWith("#receita-")) irParaReceita(location.hash.slice(9));
  });

  montarSeletor();
  montarComo();
  montarTodas();

  // link direto (pocoes.html#receita-forca ou #pocao-forca)
  const h = location.hash;
  if (h.startsWith("#receita-") || h.startsWith("#pocao-")) {
    const alvo = h.startsWith("#receita-") ? "#receita-resultado" : h;
    let posicao = -1;
    const ir = () => {
      if (posicao !== -1 && Math.abs(window.scrollY - posicao) > 4) return; // a pessoa já rolou
      const el = document.querySelector(alvo);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "instant" });
        posicao = window.scrollY;
      }
    };
    ir();
    if (document.fonts) document.fonts.ready.then(ir);
    window.addEventListener("load", ir, { once: true });
  }
})();
