/* =============================================================
   Guia de Minérios
   Monta a página a partir de js/dados-minerios.js:
     1. a regra geral (quanto custa cada peça)
     2. um card por minério, com armadura e ferramentas
     3. a calculadora
     4. as receitas da bancada e da mesa de ferraria
   ============================================================= */
(function () {
  "use strict";

  const D = window.MINEGUIA_DADOS;
  const MG = window.MineGuia || {};
  if (!D) return;

  const IMG = "assets/img/itens/";
  const GUI = "assets/img/gui/";
  const ARMADURA = D.pecas.filter((p) => p.tipo === "armadura");
  const FERRAMENTAS = D.pecas.filter((p) => p.tipo === "ferramenta");
  const NETH = D.netherite;
  const MAX_DUR = Math.max(...D.materiais.map((m) => m.durFerramenta));
  const MAX_DUR_ARMADURA = Math.max(...D.materiais.map((m) => Math.max(...m.durArmadura)));

  /* ---------- Ajudantes ---------- */
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const esc = MG.escapar || ((t) => String(t));
  const fmt = (n) => n.toLocaleString("pt-BR");
  const qtd = (n, sing, plur) => `${fmt(n)} ${n === 1 ? sing : plur}`;
  const soma = (lista, campo) => lista.reduce((t, p) => t + p[campo], 0);
  const src = (id) => `${IMG}${id}.png`;
  const ico = (id, alt = "") => `<img class="ico" src="${src(id)}" alt="${esc(alt)}">`;
  const slot = (id, classe = "", alt = "", n = "") =>
    `<span class="slot ${classe}"><img src="${src(id)}" alt="${esc(alt)}">${n ? `<span class="qtd">${n}</span>` : ""}</span>`;
  const material = (id) => D.materiais.find((m) => m.id === id);
  const nomePeca = (p, m) => `${p.nome} de ${m.nome}`;
  const idPeca = (p, m) => `${m.prefixo}_${p.id}`;
  const DIAMANTE = material("diamante");
  const NETHERITE = material("netherite");
  const SETA = '<span class="seta-mini" aria-hidden="true">→</span>';

  /* 130 → "2 packs + 2" (1 pack = 64 itens, como no jogo) */
  function packs(n) {
    if (n < 64) return "";
    const p = Math.floor(n / 64);
    const resto = n % 64;
    return `${p} ${p === 1 ? "pack" : "packs"}${resto ? ` + ${resto}` : ""}`;
  }

  /* Quantos blocos de minério quebrar para ter n itens (sem Fortuna) */
  function blocosDeMinerio(m, n) {
    const [min, max] = m.drop;
    if (min === max) return { media: Math.ceil(n / min) };
    return {
      media: Math.ceil(n / ((min + max) / 2)),
      de: Math.ceil(n / max),
      ate: Math.ceil(n / min),
    };
  }

  function textoMinerios(m, n) {
    const b = blocosDeMinerio(m, n);
    if (!b.de) return `${ico(m.minerio.id)} = ${qtd(b.media, m.minerio.sing, m.minerio.plur)} para quebrar (sem Fortuna)`;
    return `${ico(m.minerio.id)} ≈ ${qtd(b.media, m.minerio.sing, m.minerio.plur)} para quebrar (entre ${b.de} e ${b.ate})`;
  }

  /* Barrinha de armadura do jogo: 10 ícones, cada um vale 2 pontos */
  function barraArmadura(pontos) {
    let html = "";
    for (let i = 0; i < 10; i++) {
      const v = pontos - i * 2;
      html += `<img src="${GUI}armor_${v >= 2 ? "full" : v === 1 ? "half" : "empty"}.png" alt="">`;
    }
    return `<span class="icones-hud" role="img" aria-label="Proteção ${pontos} de 20">${html}</span>`;
  }

  /* Corações de dano: cada coração = 2 de dano */
  function coracoes(dano) {
    let html = "";
    for (let i = 0; i < Math.floor(dano / 2); i++) html += `<img src="${GUI}heart_full.png" alt="">`;
    if (dano % 2) html += `<img src="${GUI}heart_half.png" alt="">`;
    return `<span class="icones-hud" role="img" aria-label="${dano} de dano">${html}</span>`;
  }

  function custoTexto(p, m) {
    if (m.upgrade) return `Upgrade: ${nomePeca(p, DIAMANTE).toLowerCase()} + 1 barra de netherite + 1 molde`;
    let t = `Custo: ${qtd(p.custo, m.material.sing, m.material.plur)}`;
    if (p.gravetos) t += ` + ${qtd(p.gravetos, "graveto", "gravetos")}`;
    return t;
  }

  /* Tooltip roxa com as linhas que o próprio jogo mostra */
  function tooltipPeca(p, m) {
    const linhas = [`<span class="t-titulo">${esc(nomePeca(p, m))}</span>`];
    if (p.tipo === "armadura") {
      const i = ARMADURA.indexOf(p);
      linhas.push(`<span class="t-cinza">${p.equipado}</span>`);
      linhas.push(`<span class="t-azul">+${m.protecao[i]} de Armadura</span>`);
      if (m.resistencia) linhas.push(`<span class="t-azul">+${m.resistencia} de Resistência</span>`);
      if (m.repulsao) linhas.push(`<span class="t-azul">+${m.repulsao} de Resistência a Repulsão</span>`);
      linhas.push(`<span class="t-cinza">Durabilidade: ${fmt(m.durArmadura[i])}</span>`);
    } else {
      if (p.id === "sword") {
        linhas.push('<span class="t-cinza">Quando na mão principal:</span>');
        linhas.push(`<span class="t-verde">${m.danoEspada} de Dano de Ataque</span>`);
      }
      linhas.push(`<span class="t-cinza">Durabilidade: ${fmt(m.durFerramenta)} usos</span>`);
      if (p.nova) linhas.push('<span class="t-aqua">Novidade da versão 1.21.11!</span>');
    }
    linhas.push(`<span class="t-ouro">${esc(custoTexto(p, m))}</span>`);
    return linhas.join("");
  }

  function aplicarTooltips(raiz) {
    if (!MG.definirTooltip) return;
    raiz.querySelectorAll("[data-peca]").forEach((el) => {
      const [mId, pId] = el.dataset.peca.split(":");
      MG.definirTooltip(el, tooltipPeca(D.pecas.find((p) => p.id === pId), material(mId)));
    });
  }

  /* =========================================================
     1. REGRA GERAL
     ========================================================= */
  function renderRegra() {
    const el = $("#regra");
    if (!el) return;
    // cada peça aparece num material diferente, para mostrar que a receita é a mesma
    const vitrine = D.materiais.filter((m) => !m.upgrade);
    const itens = (lista, deslocamento) =>
      lista
        .map((p, i) => {
          const m = vitrine[(i + deslocamento) % vitrine.length];
          const gravetos = p.gravetos ? `<small>+${p.gravetos} ${ico("stick", "gravetos")}</small>` : "";
          return `<li class="regra-item" data-peca="${m.id}:${p.id}">${slot(idPeca(p, m), "slot--p")}<span>${p.nome}</span><b>${p.custo}</b>${gravetos}</li>`;
        })
        .join("");

    el.innerHTML = `
      <div class="painel regra">
        <div class="regra-bloco">
          <h3>Armadura completa = <span class="regra-total">${soma(ARMADURA, "custo")}</span></h3>
          <ul class="regra-lista">${itens(ARMADURA, 0)}</ul>
        </div>
        <div class="regra-bloco">
          <h3>Ferramentas e armas = <span class="regra-total">${soma(FERRAMENTAS, "custo")}</span> + ${soma(FERRAMENTAS, "gravetos")} gravetos</h3>
          <ul class="regra-lista">${itens(FERRAMENTAS, 2)}</ul>
        </div>
        <p class="regra-nota">${ico("netherite_upgrade_smithing_template")} Vale para cobre, ferro, ouro e diamante — só troca o material. A netherite é diferente: ela é um <a href="#netherite">upgrade do diamante</a>.</p>
      </div>`;
    aplicarTooltips(el);
  }

  /* =========================================================
     2. UM CARD PARA CADA MINÉRIO
     ========================================================= */
  function linhaKit(p, m) {
    let custo;
    if (m.upgrade) {
      custo = `<b>1</b> ${ico("netherite_ingot", "barra de netherite")} + ${ico(idPeca(p, DIAMANTE), nomePeca(p, DIAMANTE))}`;
    } else {
      custo = `<b>${p.custo}</b> ${ico(m.material.id, m.material.plur)}`;
      if (p.gravetos) custo += ` + <b>${p.gravetos}</b> ${ico("stick", "gravetos")}`;
    }
    return `<li class="kit-item" data-peca="${m.id}:${p.id}">
        ${slot(idPeca(p, m), "slot--p")}
        <span class="kit-nome">${p.nome}${p.nova ? '<span class="tag-nova">nova</span>' : ""}</span>
        <span class="kit-custo">${custo}</span>
      </li>`;
  }

  function rodapeKit(m, lista) {
    const total = soma(lista, "custo");
    const gravetos = soma(lista, "gravetos");
    if (m.upgrade) {
      const barras = lista.length;
      const pecasDiamante = gravetos
        ? `${qtd(total, "diamante", "diamantes")} + ${gravetos} gravetos`
        : qtd(total, "diamante", "diamantes");
      return `
        <p class="kit-total">Total: <b>${qtd(barras, "barra de netherite", "barras de netherite")}</b></p>
        <p class="kit-equiv">= ${ico("ancient_debris")} ${qtd(barras * NETH.detritosPorBarra, "detrito ancestral", "detritos ancestrais")} + ${ico("gold_ingot")} ${qtd(barras * NETH.ouroPorBarra, "barra de ouro", "barras de ouro")}</p>
        <p class="kit-extra">e mais: as peças de diamante (${pecasDiamante}) e ${qtd(barras, "molde", "moldes")} de melhoria</p>`;
    }
    let html = `<p class="kit-total">Total: <b>${qtd(total, m.material.sing, m.material.plur)}</b>${gravetos ? ` + <b>${gravetos} gravetos</b>` : ""}</p>
      <p class="kit-equiv">${textoMinerios(m, total)}</p>`;
    const lanca = lista.find((p) => p.nova);
    if (lanca) {
      html += `<p class="kit-extra">Sem a lança: ${qtd(total - lanca.custo, m.material.sing, m.material.plur)} + ${gravetos - lanca.gravetos} gravetos</p>`;
    }
    return html;
  }

  function kitArmadura(m) {
    const protecao = m.protecao.reduce((a, b) => a + b, 0);
    const durMin = Math.min(...m.durArmadura);
    const durMax = Math.max(...m.durArmadura);
    const pct = Math.max(1, Math.round((durMax / MAX_DUR_ARMADURA) * 100));
    let extras = `<div class="kit-stat"><span>Durabilidade</span><span class="barra-dur" aria-hidden="true"><i style="width: ${pct}%"></i></span><b>${fmt(durMin)} a ${fmt(durMax)}</b></div>`;
    if (m.resistencia) extras += `<div class="kit-stat"><span>Resistência</span><b>+${m.resistencia * 4}</b> (${m.resistencia} por peça)</div>`;
    if (m.repulsao) extras += `<div class="kit-stat"><span>Anti-empurrão</span><b>${m.repulsao * 10 * 4}%</b> menos repulsão</div>`;
    return `<section class="kit">
        <h4><img src="${src(idPeca(ARMADURA[1], m))}" alt="">Armadura completa</h4>
        <ul class="kit-lista">${ARMADURA.map((p) => linhaKit(p, m)).join("")}</ul>
        ${rodapeKit(m, ARMADURA)}
        <div class="kit-stat"><span>Proteção</span>${barraArmadura(protecao)}<b>${protecao}/20</b></div>
        ${extras}
      </section>`;
  }

  function kitFerramentas(m) {
    const pct = Math.max(1, Math.round((m.durFerramenta / MAX_DUR) * 100));
    return `<section class="kit">
        <h4><img src="${src(idPeca(FERRAMENTAS[1], m))}" alt="">Ferramentas e armas</h4>
        <ul class="kit-lista">${FERRAMENTAS.map((p) => linhaKit(p, m)).join("")}</ul>
        ${rodapeKit(m, FERRAMENTAS)}
        <div class="kit-stat"><span>Durabilidade</span><span class="barra-dur" aria-hidden="true"><i style="width: ${pct}%"></i></span><b>${fmt(m.durFerramenta)} usos</b></div>
        <div class="kit-stat"><span>Dano da espada</span>${coracoes(m.danoEspada)}<b>${m.danoEspada}</b></div>
      </section>`;
  }

  function kitCompleto(m) {
    const total = soma(D.pecas, "custo");
    const gravetos = soma(D.pecas, "gravetos");
    if (m.upgrade) {
      const barras = D.pecas.length;
      const copias = barras - 1;
      return `<p class="kit-completo">Kit completo de netherite: <b>${barras} barras</b> = ${barras * NETH.detritosPorBarra} detritos ancestrais + ${barras * NETH.ouroPorBarra} barras de ouro, além de ${total} diamantes e ${gravetos} gravetos para as peças de diamante. Os ${barras} moldes? Ache 1 e copie os outros ${copias}: mais ${copias * NETH.diamantesPorCopiaDeMolde} diamantes. Netherite é coisa de rico!</p>`;
    }
    const b = blocosDeMinerio(m, total);
    return `<p class="kit-completo">Kit completo (armadura + ferramentas): <b>${qtd(total, m.material.sing, m.material.plur)}</b> + <b>${gravetos} gravetos</b> — ${b.de ? "uns " : ""}${qtd(b.media, m.minerio.sing, m.minerio.plur)} para quebrar.</p>`;
  }

  function fichas(m) {
    const picareta = `<li class="ficha">${slot(m.picareta.id, "slot--p")}<span><span class="ficha-titulo">Picareta</span><span class="ficha-texto">${m.picareta.texto}</span></span></li>`;
    const onde = `<li class="ficha">${slot(m.minerio.id, "slot--p")}<span><span class="ficha-titulo">Onde achar</span><span class="ficha-texto">${m.onde}</span></span></li>`;
    if (m.upgrade) return `<ul class="fichas">${picareta}${onde}<li class="ficha">${slot("lava_bucket", "slot--p")}<span><span class="ficha-titulo">Atenção</span><span class="ficha-texto">Fortuna não funciona aqui: cada bloco dá sempre 1 detrito. E o Nether é cheio de lava — leve poções de resistência ao fogo!</span></span></li></ul>`;

    const passos = [slot(m.minerio.id, "slot--p", m.minerio.sing)];
    let texto;
    if (m.bruto) {
      passos.push(slot(m.bruto.id, "slot--p", m.bruto.sing), slot("furnace", "slot--p", "Fornalha"));
      const [a, b] = m.drop;
      const quanto = a === b ? qtd(a, m.bruto.sing, m.bruto.plur) : `${a} a ${b} ${m.bruto.plur}`;
      texto = `Cada minério dá ${quanto}. Na fornalha, 1 bruto = 1 barra.`;
    } else {
      texto = "O minério já dá o diamante pronto. Nada de fornalha!";
    }
    passos.push(slot(m.material.id, "slot--p", m.material.sing));
    const processo = `<li class="ficha"><span><span class="ficha-titulo">Do bloco à barra</span><span class="cadeia">${passos.join(SETA)}</span><span class="ficha-texto">${texto}</span></span></li>`;
    return `<ul class="fichas">${picareta}${onde}${processo}</ul>`;
  }

  function processoNetherite() {
    const d = NETH.detritosPorBarra;
    const o = NETH.ouroPorBarra;
    const mais = '<span class="mais" aria-hidden="true">+</span>';
    return `<ol class="processo">
        <li><span class="processo-n">1</span><div>
          <span class="cadeia">${slot("ancient_debris", "slot--p", "Detritos ancestrais", d)}${SETA}${slot("furnace", "slot--p", "Fornalha")}${SETA}${slot("netherite_scrap", "slot--p", "Fragmentos de netherite", d)}</span>
          <p>Funda os detritos ancestrais: cada um vira 1 fragmento de netherite.</p></div></li>
        <li><span class="processo-n">2</span><div>
          <span class="cadeia">${slot("netherite_scrap", "slot--p", "Fragmentos", d)}${mais}${slot("gold_ingot", "slot--p", "Barras de ouro", o)}${SETA}${slot("crafting_table", "slot--p", "Bancada")}${SETA}${slot("netherite_ingot", "slot--p", "Barra de netherite")}</span>
          <p>${d} fragmentos + ${o} barras de ouro na bancada = 1 barra de netherite.</p></div></li>
        <li><span class="processo-n">3</span><div>
          <span class="cadeia">${slot("netherite_upgrade_smithing_template", "slot--p", "Molde de melhoria")}${mais}${slot("diamond_chestplate", "slot--p", "Peitoral de diamante")}${mais}${slot("netherite_ingot", "slot--p", "Barra de netherite")}${SETA}${slot("smithing_table", "slot--p", "Mesa de ferraria")}${SETA}${slot("netherite_chestplate", "slot--p", "Peitoral de netherite")}</span>
          <p>Na mesa de ferraria, a peça de diamante vira netherite — e continua com os encantamentos! O molde se acha em Bastiões; para copiar: ${NETH.diamantesPorCopiaDeMolde} diamantes + 1 netherrack + 1 molde = 2 moldes.</p></div></li>
      </ol>`;
  }

  function cardMinerio(m) {
    const blocos = [m.minerio.id, m.minerio.deep].filter(Boolean).map((id) => `<img src="${src(id)}" alt="">`).join("");
    return `<article class="camada ${m.textura}" id="${m.id}" style="--cor: ${m.cor}" aria-labelledby="titulo-${m.id}">
        <div class="container">
          <span class="profundidade"><img src="${src(m.minerio.deep || m.minerio.id)}" alt="">${m.profundidade}</span>
          <div class="painel minerio">
            <header class="minerio-topo">
              <div class="minerio-blocos" aria-hidden="true">${blocos}</div>
              <div class="minerio-nome">
                <p class="minerio-apelido">${m.apelido}</p>
                <h3 id="titulo-${m.id}">${m.nome}</h3>
                <p>${m.descricao}</p>
              </div>
            </header>
            ${fichas(m)}
            ${m.upgrade ? processoNetherite() : ""}
            <div class="kits">${kitArmadura(m)}${kitFerramentas(m)}</div>
            ${kitCompleto(m)}
            <p class="minerio-dica"><img src="${src("book_and_quill")}" alt=""><span><b>Dica:</b> ${m.dica}</span></p>
          </div>
        </div>
      </article>`;
  }

  function renderMinerios() {
    const lista = $("#lista-minerios");
    if (!lista) return;
    lista.innerHTML = D.materiais.map(cardMinerio).join("");
    aplicarTooltips(lista);
  }

  /* =========================================================
     3. CALCULADORA
     ========================================================= */
  const CHAVE_SALVA = "mineguia:calculadora:v1";
  const MAX_POR_PECA = 64;
  const ORDEM_RECURSOS = ["copper_ingot", "iron_ingot", "gold_ingot", "diamond", "ancient_debris", "netherrack", "stick"];
  const estado = { escolhas: {}, tenhoDiamante: false, moldes: 0 };
  const TODAS = [];
  D.materiais.forEach((m) => D.pecas.forEach((p) => TODAS.push({ chave: `${m.id}:${p.id}`, m, p })));
  const PELA_CHAVE = Object.fromEntries(TODAS.map((x) => [x.chave, x]));
  let raizCalc = null;
  let avisarConquistas = false;
  const conquistasFeitas = new Set();

  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE_SALVA) || "null");
      if (!salvo || typeof salvo !== "object") return;
      Object.entries(salvo.escolhas || {}).forEach(([k, v]) => {
        if (PELA_CHAVE[k] && Number.isInteger(v) && v > 0) estado.escolhas[k] = Math.min(v, MAX_POR_PECA);
      });
      estado.tenhoDiamante = salvo.tenhoDiamante === true;
      estado.moldes = Math.min(MAX_POR_PECA, Math.max(0, parseInt(salvo.moldes, 10) || 0));
    } catch (e) {
      /* sem acesso ao armazenamento: a calculadora só começa vazia */
    }
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE_SALVA, JSON.stringify(estado));
    } catch (e) {
      /* tudo bem, só não lembra da lista na próxima visita */
    }
  }

  function calcular() {
    const rec = {};
    const add = (id, n) => {
      if (n > 0) rec[id] = (rec[id] || 0) + n;
    };
    let barras = 0;
    let pecas = 0;
    Object.entries(estado.escolhas).forEach(([chave, n]) => {
      const { m, p } = PELA_CHAVE[chave];
      pecas += n;
      if (m.upgrade) {
        barras += n;
        if (!estado.tenhoDiamante) {
          add(DIAMANTE.material.id, p.custo * n);
          add("stick", p.gravetos * n);
        }
      } else {
        add(m.material.id, p.custo * n);
        add("stick", p.gravetos * n);
      }
    });
    let copias = 0;
    if (barras) {
      add("ancient_debris", barras * NETH.detritosPorBarra);
      add("gold_ingot", barras * NETH.ouroPorBarra);
      // para copiar um molde você precisa ter pelo menos 1
      copias = Math.max(0, barras - Math.max(estado.moldes, 1));
      add("diamond", copias * NETH.diamantesPorCopiaDeMolde);
      add("netherrack", copias);
    }
    return { rec, barras, copias, pecas };
  }

  function botaoSlot(p, m) {
    return `<button type="button" class="slot slot--botao" data-chave="${m.id}:${p.id}" data-peca="${m.id}:${p.id}" aria-pressed="false" aria-label="${esc(nomePeca(p, m))}">
        <img src="${src(idPeca(p, m))}" alt=""><span class="qtd"></span></button>`;
  }

  function montarCalculadora() {
    raizCalc = $("#calc");
    if (!raizCalc) return;

    const linhas = D.materiais
      .map(
        (m) => `<div class="calc-linha" style="--cor: ${m.cor}">
          <div class="calc-mat">
            ${slot(m.material.id, "slot--p")}
            <b>${m.nome}</b>
            <span class="calc-atalhos">
              <button type="button" class="botao botao--pequeno" data-atalho="armadura" data-mat="${m.id}" aria-pressed="false">Armadura</button>
              <button type="button" class="botao botao--pequeno" data-atalho="ferramenta" data-mat="${m.id}" aria-pressed="false">Ferramentas</button>
            </span>
          </div>
          <div class="calc-slots">
            <div class="calc-grupo" role="group" aria-label="Armadura de ${m.nome}">${ARMADURA.map((p) => botaoSlot(p, m)).join("")}</div>
            <div class="calc-grupo" role="group" aria-label="Ferramentas de ${m.nome}">${FERRAMENTAS.map((p) => botaoSlot(p, m)).join("")}</div>
          </div>
        </div>`
      )
      .join("");

    raizCalc.innerHTML = `
      <div class="painel calc">
        <div>
          <h3 class="calc-h">1. Escolha as peças <small>(ou marque o conjunto todo nos botões Armadura e Ferramentas)</small></h3>
          <div class="calc-grade">${linhas}</div>
        </div>

        <div class="calc-opcoes" id="calc-opcoes" hidden>
          <h3 class="calc-h"><img src="${src("netherite_upgrade_smithing_template")}" alt="">Opções da netherite</h3>
          <label class="check"><input type="checkbox" id="calc-tenho-diamante"><span>Já tenho as peças de diamante (não somar os diamantes delas)</span></label>
          <div class="stepper-linha">
            <span>Moldes de melhoria que já tenho:</span>
            <span class="stepper">
              <button type="button" data-moldes="-1" aria-label="Um molde a menos">−</button>
              <output id="calc-moldes" aria-live="polite">0</output>
              <button type="button" data-moldes="1" aria-label="Um molde a mais">+</button>
            </span>
          </div>
        </div>

        <div class="calc-resultado">
          <div class="calc-total">
            <h3 class="calc-h">2. Você vai precisar de</h3>
            <div class="calc-recursos" id="calc-recursos" aria-live="polite"></div>
            <ul class="calc-detalhes" id="calc-detalhes"></ul>
          </div>
          <div class="calc-lista">
            <h3 class="calc-h">Sua lista <small id="calc-contagem"></small></h3>
            <ul class="calc-escolhidos" id="calc-escolhidos"></ul>
            <div class="calc-acoes">
              <button type="button" class="botao botao--pequeno" id="calc-copiar"><img src="${src("book_and_quill")}" alt="">Copiar lista</button>
              <button type="button" class="botao botao--pequeno" id="calc-limpar"><img src="${src("tnt")}" alt="">Limpar tudo</button>
            </div>
          </div>
        </div>
      </div>`;

    ligarEventos();
    carregar();
    atualizar();
    avisarConquistas = true;
  }

  function atualizarTooltipSlot(b) {
    if (!MG.definirTooltip) return;
    const { m, p } = PELA_CHAVE[b.dataset.chave];
    const marcado = !!estado.escolhas[b.dataset.chave];
    MG.definirTooltip(
      b,
      `<span class="t-titulo">${esc(nomePeca(p, m))}</span><span class="t-ouro">${esc(custoTexto(p, m))}</span><span class="t-cinza">${marcado ? "Clique para tirar da lista" : "Clique para adicionar"}</span>`
    );
    if (MG.atualizarTooltip) MG.atualizarTooltip(b);
  }

  function grupoDe(tipo) {
    return tipo === "armadura" ? ARMADURA : FERRAMENTAS;
  }

  function grupoCompleto(mId, tipo) {
    return grupoDe(tipo).every((p) => estado.escolhas[`${mId}:${p.id}`]);
  }

  function mudar(chave, delta) {
    const n = Math.min(MAX_POR_PECA, Math.max(0, (estado.escolhas[chave] || 0) + delta));
    if (n) estado.escolhas[chave] = n;
    else delete estado.escolhas[chave];
  }

  function ligarEventos() {
    raizCalc.addEventListener("click", (e) => {
      const alvo = e.target.closest("button");
      if (!alvo || !raizCalc.contains(alvo)) return;

      if (alvo.dataset.chave) {
        // clique no slot: liga/desliga a peça
        const chave = alvo.dataset.chave;
        if (estado.escolhas[chave]) delete estado.escolhas[chave];
        else estado.escolhas[chave] = 1;
      } else if (alvo.dataset.atalho) {
        const { mat, atalho } = alvo.dataset;
        const completo = grupoCompleto(mat, atalho);
        grupoDe(atalho).forEach((p) => {
          const chave = `${mat}:${p.id}`;
          if (completo) delete estado.escolhas[chave];
          else if (!estado.escolhas[chave]) estado.escolhas[chave] = 1;
        });
      } else if (alvo.dataset.mais) {
        mudar(alvo.dataset.mais, 1);
      } else if (alvo.dataset.menos) {
        mudar(alvo.dataset.menos, -1);
      } else if (alvo.dataset.remover) {
        delete estado.escolhas[alvo.dataset.remover];
      } else if (alvo.dataset.moldes) {
        estado.moldes = Math.min(MAX_POR_PECA, Math.max(0, estado.moldes + Number(alvo.dataset.moldes)));
      } else if (alvo.id === "calc-limpar") {
        limpar();
        return;
      } else if (alvo.id === "calc-copiar") {
        copiar();
        return;
      } else {
        return;
      }
      atualizar(alvo);
    });

    $("#calc-tenho-diamante", raizCalc).addEventListener("change", (e) => {
      estado.tenhoDiamante = e.target.checked;
      atualizar();
    });
  }

  /* Re-desenha tudo que depende das escolhas */
  function atualizar(origem) {
    // lembra qual botão da lista estava com foco (a lista é redesenhada)
    let focoLista = null;
    if (origem && origem.closest && origem.closest("#calc-escolhidos")) {
      if (origem.dataset.mais) focoLista = `[data-mais="${origem.dataset.mais}"]`;
      else if (origem.dataset.menos) focoLista = `[data-menos="${origem.dataset.menos}"]`;
      else focoLista = "#calc-escolhidos button";
    }

    raizCalc.querySelectorAll(".slot--botao").forEach((b) => {
      const n = estado.escolhas[b.dataset.chave] || 0;
      const antes = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", n > 0 ? "true" : "false");
      const q = b.querySelector(".qtd");
      q.textContent = n > 1 ? n : "";
      if (antes !== n > 0 || !b.classList.contains("tem-tooltip")) atualizarTooltipSlot(b);
    });

    raizCalc.querySelectorAll("[data-atalho]").forEach((b) => {
      b.setAttribute("aria-pressed", grupoCompleto(b.dataset.mat, b.dataset.atalho) ? "true" : "false");
    });

    const temNetherite = Object.keys(estado.escolhas).some((k) => PELA_CHAVE[k].m.upgrade);
    $("#calc-opcoes", raizCalc).hidden = !temNetherite;
    $("#calc-tenho-diamante", raizCalc).checked = estado.tenhoDiamante;
    $("#calc-moldes", raizCalc).textContent = estado.moldes;
    raizCalc.querySelector('[data-moldes="-1"]').disabled = estado.moldes === 0;

    const r = calcular();
    renderRecursos(r);
    renderDetalhes(r);
    renderLista(r);
    salvar();
    verificarConquistas();

    if (focoLista) {
      const b = $(focoLista, raizCalc);
      const reserva = $("#calc-escolhidos button", raizCalc) || $("#calc-copiar", raizCalc);
      if (b && !b.disabled) b.focus();
      else if (reserva) reserva.focus();
    }
  }

  function renderRecursos(r) {
    const el = $("#calc-recursos", raizCalc);
    const ids = ORDEM_RECURSOS.filter((id) => r.rec[id]);
    if (!ids.length) {
      el.innerHTML = `<p class="calc-vazio"><img src="${src("barrier")}" alt="">Nada escolhido ainda. Clique numa peça ali em cima — que tal começar pelo peitoral de diamante?</p>`;
      return;
    }
    el.innerHTML = ids
      .map((id) => {
        const n = r.rec[id];
        const [sing, plur] = D.recursos[id];
        const p = packs(n);
        return `<div class="recurso">
            <span class="slot"><img src="${src(id)}" alt=""><span class="qtd${n >= 1000 ? " longa" : ""}">${n}</span></span>
            <span class="recurso-txt"><b>${fmt(n)}</b>${n === 1 ? sing : plur}${p ? `<small>${p}</small>` : ""}</span>
          </div>`;
      })
      .join("");
  }

  function renderDetalhes(r) {
    const el = $("#calc-detalhes", raizCalc);
    if (!r.pecas) {
      el.innerHTML = "";
      return;
    }
    const rec = r.rec;
    const itens = [];

    // 1. quantos blocos quebrar
    const quebrar = [];
    D.materiais.forEach((m) => {
      const n = m.upgrade ? rec.ancient_debris : rec[m.material.id];
      if (!n) return;
      const b = blocosDeMinerio(m, n);
      const faixa = b.de ? ` <small>(${b.de} a ${b.ate})</small>` : "";
      quebrar.push(`${ico(m.minerio.id)} ${b.de ? "~" : ""}${qtd(b.media, m.minerio.sing, m.minerio.plur)}${faixa}`);
    });
    if (quebrar.length) itens.push(`<li><b>Minérios para quebrar</b> (sem Fortuna): ${quebrar.join(" · ")}</li>`);

    // 2. fornalha: tudo que tem "bruto" precisa ser fundido
    let fundir = 0;
    D.materiais.forEach((m) => {
      if (m.bruto) fundir += (m.upgrade ? rec.ancient_debris : rec[m.material.id]) || 0;
    });
    if (fundir) {
      itens.push(
        `<li>${ico("furnace")} <b>Fornalha:</b> ${qtd(fundir, "item", "itens")} para fundir → ${qtd(Math.ceil(fundir / 8), "carvão", "carvões")} ${ico("coal")} <small>(1 carvão funde 8 itens; o alto-forno é 2x mais rápido)</small></li>`
      );
    }

    // 3. gravetos → tábuas → troncos
    if (rec.stick) {
      const tabuas = Math.ceil(rec.stick / 4) * 2;
      const troncos = Math.ceil(tabuas / 4);
      itens.push(
        `<li>${ico("stick")} <b>Gravetos:</b> ${qtd(rec.stick, "graveto", "gravetos")} = ${tabuas} tábuas ${ico("oak_planks")} = ${qtd(troncos, "tronco", "troncos")} ${ico("oak_log")} <small>(2 tábuas fazem 4 gravetos)</small></li>`
      );
    }

    // 4. netherite
    if (r.barras) {
      const diamanteTxt = estado.tenhoDiamante ? "Use as suas peças de diamante" : "Primeiro faça as peças de diamante";
      itens.push(
        `<li>${ico("netherite_ingot")} <b>Netherite:</b> funda ${r.barras * NETH.detritosPorBarra} detritos e crafte ${qtd(r.barras, "barra", "barras")} de netherite (4 fragmentos + 4 barras de ouro cada). ${diamanteTxt} e transforme tudo na mesa de ferraria.</li>`
      );
      let moldes = `${ico("netherite_upgrade_smithing_template")} <b>Moldes de melhoria:</b> você precisa de ${r.barras}`;
      if (estado.moldes) moldes += ` e já tem ${estado.moldes}`;
      moldes += r.copias
        ? `. Faça ${qtd(r.copias, "cópia", "cópias")} (${NETH.diamantesPorCopiaDeMolde} diamantes + 1 netherrack cada — já está somado aí em cima).`
        : ". Não precisa copiar nenhum!";
      itens.push(`<li>${moldes}</li>`);
      if (estado.moldes === 0) {
        itens.push(
          `<li class="alerta">${ico("netherrack")} Ache pelo menos 1 molde num <b>Bastião</b> (é uma ruína no Nether). O primeiro não dá para fabricar na bancada!</li>`
        );
      }
    }
    el.innerHTML = itens.join("");
  }

  function renderLista(r) {
    const el = $("#calc-escolhidos", raizCalc);
    const escolhidos = TODAS.filter((x) => estado.escolhas[x.chave]);
    $("#calc-contagem", raizCalc).textContent = r.pecas ? `(${qtd(r.pecas, "peça", "peças")})` : "";
    if (!escolhidos.length) {
      el.innerHTML = '<li class="calc-vazio">Sua lista está vazia.</li>';
      return;
    }
    el.innerHTML = escolhidos
      .map(({ chave, m, p }) => {
        const n = estado.escolhas[chave];
        const nome = esc(nomePeca(p, m));
        return `<li>
            ${slot(idPeca(p, m), "slot--p")}
            <span class="escolhido-nome">${nome}</span>
            <span class="stepper">
              <button type="button" data-menos="${chave}" aria-label="Diminuir ${nome}">−</button>
              <output aria-label="Quantidade">${n}</output>
              <button type="button" data-mais="${chave}" aria-label="Aumentar ${nome}"${n >= MAX_POR_PECA ? " disabled" : ""}>+</button>
            </span>
            <button type="button" class="remover" data-remover="${chave}" aria-label="Remover ${nome}">×</button>
          </li>`;
      })
      .join("");
  }

  /* Toasts de conquista quando um conjunto fica completo */
  function verificarConquistas() {
    const icone = (p, m) => src(idPeca(p, m));
    D.materiais.forEach((m) => {
      [
        ["armadura", ARMADURA[1]],
        ["ferramenta", FERRAMENTAS[1]],
      ].forEach(([tipo, peca]) => {
        const id = `${m.id}:${tipo}`;
        if (grupoCompleto(m.id, tipo)) {
          if (!conquistasFeitas.has(id)) {
            conquistasFeitas.add(id);
            const nome = tipo === "armadura" ? m.conquistas.armadura : m.conquistas.ferramentas;
            if (avisarConquistas && MG.toast) MG.toast("Conquista feita!", nome, icone(peca, m));
          }
        } else {
          conquistasFeitas.delete(id);
        }
      });
    });
    const tudo = TODAS.every((x) => estado.escolhas[x.chave]);
    if (tudo && !conquistasFeitas.has("tudo")) {
      conquistasFeitas.add("tudo");
      if (avisarConquistas && MG.toast) MG.toast("Desafio concluído!", "Ganância nível máximo: você escolheu TUDO.", src("block_of_diamond"));
    } else if (!tudo) {
      conquistasFeitas.delete("tudo");
    }
  }

  function limpar() {
    if (!Object.keys(estado.escolhas).length) return;
    const painel = $(".calc", raizCalc);
    painel.classList.add("explodindo");
    if (MG.toast) MG.toast("Sssss... BOOM!", "Um creeper passou e limpou sua lista.", src("creeper_head"));
    setTimeout(() => {
      estado.escolhas = {};
      painel.classList.remove("explodindo");
      atualizar();
    }, 450);
  }

  function textoDaLista() {
    const r = calcular();
    const linhas = ["Meu kit no MineGuia:"];
    TODAS.filter((x) => estado.escolhas[x.chave]).forEach(({ chave, m, p }) => {
      linhas.push(`- ${estado.escolhas[chave]}x ${nomePeca(p, m)}`);
    });
    linhas.push("", "Vou precisar de:");
    ORDEM_RECURSOS.filter((id) => r.rec[id]).forEach((id) => {
      const n = r.rec[id];
      const [sing, plur] = D.recursos[id];
      linhas.push(`- ${n} ${n === 1 ? sing : plur}`);
    });
    if (r.barras) linhas.push(`- ${qtd(r.barras, "molde", "moldes")} de melhoria de netherite`);
    return linhas.join("\n");
  }

  async function copiar() {
    if (!Object.keys(estado.escolhas).length) {
      if (MG.toast) MG.toast("Lista vazia", "Escolha alguma peça primeiro!", src("barrier"));
      return;
    }
    const texto = textoDaLista();
    let ok = false;
    try {
      await navigator.clipboard.writeText(texto);
      ok = true;
    } catch (e) {
      const area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        ok = document.execCommand("copy");
      } catch (e2) {
        ok = false;
      }
      area.remove();
    }
    if (MG.toast) {
      if (ok) MG.toast("Lista copiada!", "Cole no chat e mostre para os amigos.", src("book_and_quill"));
      else MG.toast("Não deu para copiar", "Seu navegador bloqueou a área de transferência.", src("barrier"));
    }
  }

  /* =========================================================
     4. RECEITAS
     ========================================================= */
  function grade3x3(celulas) {
    return `<span class="grade3" aria-hidden="true">${celulas
      .map((id) => `<span class="slot slot--r">${id ? `<img src="${src(id)}" alt="">` : ""}</span>`)
      .join("")}</span>`;
  }

  function cartao(titulo, sub, corpo) {
    return `<figure class="receita"><figcaption><b>${titulo}</b><small>${sub}</small></figcaption><div class="receita-corpo">${corpo}</div></figure>`;
  }

  function cartaoBancada(p, m) {
    const celulas = p.padrao.join("").split("").map((c) => (c === "M" ? m.material.id : c === "G" ? "stick" : null));
    let sub = qtd(p.custo, m.material.sing, m.material.plur);
    if (p.gravetos) sub += ` + ${qtd(p.gravetos, "graveto", "gravetos")}`;
    return cartao(nomePeca(p, m), sub, `${grade3x3(celulas)}<span class="seta" aria-hidden="true"></span>${slot(idPeca(p, m), "slot--g", nomePeca(p, m))}`);
  }

  function cartaoFerraria(p) {
    const ferraria = `<span class="ferraria" aria-hidden="true">${slot("netherite_upgrade_smithing_template", "slot--r")}${slot(idPeca(p, DIAMANTE), "slot--r")}${slot("netherite_ingot", "slot--r")}</span>`;
    return cartao(
      nomePeca(p, NETHERITE),
      `Mesa de ferraria: molde + ${nomePeca(p, DIAMANTE).toLowerCase()} + barra`,
      `${ferraria}<span class="seta" aria-hidden="true"></span>${slot(idPeca(p, NETHERITE), "slot--g", nomePeca(p, NETHERITE))}`
    );
  }

  function cartoesNetherite() {
    const f = "netherite_scrap";
    const o = "gold_ingot";
    const barra = cartao(
      "Barra de Netherite",
      "4 fragmentos + 4 barras de ouro (em qualquer posição)",
      `${grade3x3([f, f, f, f, o, o, o, o, null])}<span class="seta" aria-hidden="true"></span>${slot("netherite_ingot", "slot--g", "Barra de netherite")}`
    );
    const d = "diamond";
    const molde = cartao(
      "Copiar o molde de melhoria",
      "7 diamantes + 1 netherrack + 1 molde = 2 moldes",
      `${grade3x3([d, "netherite_upgrade_smithing_template", d, d, "netherrack", d, d, d, d])}<span class="seta" aria-hidden="true"></span>${slot("netherite_upgrade_smithing_template", "slot--g", "2 moldes", 2)}`
    );
    return barra + molde + D.pecas.map(cartaoFerraria).join("");
  }

  function montarReceitas() {
    const raiz = $("#receitas-app");
    if (!raiz) return;
    const botoes = D.materiais
      .map(
        (m) =>
          `<button type="button" class="botao botao--pequeno aba-mat" data-receita="${m.id}" aria-pressed="${m.id === "ferro"}"><img src="${src(m.material.id)}" alt="">${m.nome}</button>`
      )
      .join("");
    raiz.innerHTML = `<div class="painel">
        <div class="abas-mat" role="group" aria-label="Escolha o material">${botoes}</div>
        <div class="receitas-grade" id="receitas-grade" aria-live="polite"></div>
      </div>`;

    const grade = $("#receitas-grade", raiz);
    const desenhar = (m) => {
      grade.innerHTML = m.upgrade ? cartoesNetherite() : D.pecas.map((p) => cartaoBancada(p, m)).join("");
    };
    raiz.querySelector(".abas-mat").addEventListener("click", (e) => {
      const b = e.target.closest("[data-receita]");
      if (!b) return;
      raiz.querySelectorAll("[data-receita]").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      desenhar(material(b.dataset.receita));
    });
    desenhar(material("ferro"));
  }

  /* =========================================================
     Liga tudo
     ========================================================= */
  renderRegra();
  renderMinerios();
  montarCalculadora();
  montarReceitas();

  // Links como minerios.html#netherite: o conteúdo nasce via JS, então o navegador
  // não acha a seção sozinho. Rolamos agora e de novo quando fontes e imagens
  // terminarem de carregar (elas mudam a altura da página), se a pessoa não tiver rolado.
  if (location.hash) {
    const alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (alvo) {
      let posicao = -1;
      const ir = () => {
        if (posicao !== -1 && Math.abs(window.scrollY - posicao) > 4) return;
        alvo.scrollIntoView({ behavior: "instant", block: "start" });
        posicao = window.scrollY;
      };
      ir();
      if (document.fonts) document.fonts.ready.then(ir);
      window.addEventListener("load", ir, { once: true });
    }
  }
})();
