/* =============================================================
   Aldeões e trocas
   Monta, a partir de js/dados-aldeoes.js:
     1. "Quem é quem na vila" no topo do guia (um botão por aldeão)
     2. a seção de trocas: como funciona + um card por aldeão,
        com o que ele faz, a estação de trabalho e as trocas por nível
   Clicar num aldeão lá em cima abre o card dele e rola até ele.
   ============================================================= */
(function () {
  "use strict";

  const D = window.MINEGUIA_ALDEOES;
  const MG = window.MineGuia || {};
  if (!D) return;

  const IMG = "assets/img/itens/";
  const ALD = "assets/img/aldeoes/";
  const GUI = "assets/img/gui/";
  const esc = MG.escapar || ((t) => String(t));
  const item = (id) => D.itens[id] || [id, "barrier.png"];
  const nome = (id) => item(id)[0];
  const src = (id) => IMG + item(id)[1];
  const icone = (arquivo) => IMG + arquivo; // imagens da interface que não são itens de troca
  const PREFIXO = "aldeao-";
  const CORES = { equipamento: "#a9b4bd", comida: "#6fae3c", magia: "#9b5de5", construcao: "#c97b3f", visitante: "#3f74d6" };

  const plural = (q, txt) => `${q} ${txt}`;
  const descreve = (lista) => lista.map(([q, id]) => plural(q, nome(id))).join(" + ");

  /* ---------- peças pequenas ---------- */
  function slot(q, id, encantado) {
    const faixa = q.includes("–");
    const brilho = encantado
      ? `<span class="brilho" style="-webkit-mask-image: url('${src(id)}'); mask-image: url('${src(id)}')"></span>`
      : "";
    const qtd = q !== "1" ? `<span class="qtd${faixa ? " faixa" : ""}">${q}</span>` : "";
    return `<span class="slot slot--p${encantado ? " encantado" : ""}"><img src="${src(id)}" alt="">${brilho}${qtd}</span>`;
  }

  function tooltipTroca(t) {
    let html = `<span class="t-titulo">Você dá: ${esc(descreve(t.voceDa))}</span>`;
    html += `<span class="t-verde">Você recebe: ${esc(descreve(t.voceRecebe))}${t.encantado ? " (encantado)" : ""}</span>`;
    if (t.nota) html += `<span class="t-ouro">${esc(t.nota)}</span>`;
    if (t.estoque) html += `<span class="t-cinza">Até ${t.estoque} trocas antes de reabastecer</span>`;
    return html;
  }

  function troca(t) {
    const ganha = t.voceRecebe.some(([, id]) => id === "emerald");
    const entradas = t.voceDa.map(([q, id]) => slot(q, id)).join('<span class="troca-mais" aria-hidden="true">+</span>');
    const saidas = t.voceRecebe.map(([q, id]) => slot(q, id, t.encantado)).join("");
    const texto = `Você dá ${descreve(t.voceDa)} e recebe ${descreve(t.voceRecebe)}${t.encantado ? " encantado" : ""}.`;
    return `<li class="troca troca--${ganha ? "ganha" : "gasta"}${t.nota ? " troca--nota" : ""}" data-indice="${t._i}">
        ${entradas}<span class="troca-seta" aria-hidden="true"></span>${saidas}
        <span class="sr-only">${esc(texto)}${t.nota ? " " + esc(t.nota) : ""}</span>
      </li>`;
  }

  // mostra cada observação só na primeira vez que ela aparece no card
  function notasDe(lista, jaVistas) {
    const unicas = [...new Set(lista.filter((t) => t.nota && !jaVistas.has(t.nota)).map((t) => t.nota))];
    unicas.forEach((n) => jaVistas.add(n));
    return unicas.length ? `<ul class="nivel-notas">${unicas.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : "";
  }

  function grade3x3(est) {
    const celulas = est.receita.join("").split("").map((c) => (c === "." ? null : est.ingredientes[c]));
    return `<span class="grade3" aria-hidden="true">${celulas
      .map((id) => `<span class="slot slot--r">${id ? `<img src="${src(id)}" alt="">` : ""}</span>`)
      .join("")}</span>`;
  }

  /* ---------- 1. Quem é quem na vila (topo do guia) ---------- */
  function montarAtalhos() {
    const lista = document.getElementById("vila-atalhos");
    if (!lista) return;
    lista.innerHTML = D.profissoes
      .map(
        (p) => `<li class="morador" style="--cor: ${CORES[p.grupo]}">
          <a href="#${PREFIXO}${p.id}" data-aldeao="${p.id}">
            <span class="passo-icone"><img src="${ALD}rosto-${p.id}.png" alt=""></span>
            <b>${esc(p.nome)}</b>
            <small>${esc(p.papel)}</small>
          </a>
        </li>`
      )
      .join("");
  }

  /* ---------- 2. Seção de trocas ---------- */
  function introducao() {
    const niveis = D.niveis
      .map((n) => `<li><img src="${GUI}nivel-${n.n}.png" alt=""><span><b>${n.n}. ${esc(n.nome)}</b><small>insígnia de ${esc(n.insignia.toLowerCase())}</small></span></li>`)
      .join("");
    const regra = (icone, titulo, texto) => `<li><span class="slot slot--p"><img src="${icone}" alt=""></span><span><b>${titulo}</b> ${texto}</span></li>`;
    return `<div class="painel vila-intro">
        <div>
          <h3>Como funcionam as trocas</h3>
          <ul class="vila-regras">
            ${regra(ALD + "rosto-desempregado.png", "Contrate um aldeão.", "Um aldeão sem profissão escolhe o trabalho pela estação de trabalho livre mais perto dele. Coloque um atril ao lado dele e pronto: virou bibliotecário.")}
            ${regra(src("emerald"), "Tudo gira em torno da esmeralda.", "Você vende itens para ganhar esmeraldas e usa as esmeraldas para comprar o que eles oferecem.")}
            ${regra(src("enchanted_book"), "As ofertas são sorteadas.", "Cada nível libera até 2 trocas tiradas da lista. Antes da primeira troca, quebrar e recolocar a estação sorteia tudo de novo; depois dela, as ofertas ficam travadas.")}
            ${regra(src("clock"), "Estoque volta sozinho.", "Os aldeões reabastecem até 2 vezes por dia, quando trabalham na estação.")}
            ${regra(icone("golden_apple.png"), "Descontos.", "Curar um aldeão zumbi (poção de fraqueza arremessável + maçã dourada) deixa tudo muito mais barato para sempre. Vencer um ataque à vila dá o efeito Herói da Vila, que também baixa os preços.")}
            ${regra(ALD + "rosto-palerma.png", "O Palerma não trabalha.", "O aldeão de jaleco verde não tem profissão e não troca nada.")}
          </ul>
        </div>
        <div>
          <h3>Os 5 níveis</h3>
          <ol class="vila-niveis">${niveis}</ol>
          <p class="vila-obs">Cada troca dá experiência ao aldeão. Com a barra cheia, ele sobe de nível e libera trocas novas — sem perder as antigas.</p>
          <ul class="vila-legenda">
            <li><span class="amostra amostra--ganha"></span>Você ganha esmeraldas</li>
            <li><span class="amostra amostra--gasta"></span>Você gasta esmeraldas</li>
            <li><span class="amostra amostra--nota"></span>Tem observação (veja embaixo da linha)</li>
          </ul>
        </div>
      </div>`;
  }

  function trocasPorNivel(p) {
    const vistas = new Set();
    return D.niveis
      .map((nv) => {
        const lista = p.trocas.filter((t) => t.nivel === nv.n);
        if (!lista.length) return "";
        const sorteio = lista.length > 2 ? `<small class="sorteio">sorteia 2 de ${lista.length}</small>` : "";
        return `<div class="nivel-linha">
            <div class="nivel-rotulo"><img src="${GUI}nivel-${nv.n}.png" alt=""><span><b>${esc(nv.nome)}</b>${sorteio}</span></div>
            <div class="nivel-conteudo"><ul class="trocas">${lista.map(troca).join("")}</ul>${notasDe(lista, vistas)}</div>
          </div>`;
      })
      .join("");
  }

  function trocasDoMercador(p) {
    const vistas = new Set();
    const blocos = [
      ["compra", "Ele compra de você", "sorteia 2"],
      ["especial", "Ofertas especiais", "sorteia 2"],
    ]
      .map(([nivel, titulo, sorteio]) => {
        const lista = p.trocas.filter((t) => t.nivel === nivel);
        return `<div class="nivel-linha">
            <div class="nivel-rotulo"><img src="${src("emerald")}" alt=""><span><b>${titulo}</b><small class="sorteio">${sorteio} de ${lista.length}</small></span></div>
            <div class="nivel-conteudo"><ul class="trocas">${lista.map(troca).join("")}</ul>${notasDe(lista, vistas)}</div>
          </div>`;
      })
      .join("");

    // ofertas comuns: agrupadas pelo preço, em ordem
    const comuns = p.trocas.filter((t) => t.nivel === "comum");
    const precos = [...new Set(comuns.map((t) => Number(t.voceDa[0][0])))].sort((a, b) => a - b);
    const loja = precos
      .map((preco) => {
        const itens = comuns.filter((t) => Number(t.voceDa[0][0]) === preco);
        const slots = itens
          .map((t) => {
            const [q, id] = t.voceRecebe[0];
            return `<li class="loja-item" data-indice="${t._i}">${slot(q, id)}<span class="sr-only">${esc(plural(q, nome(id)))}</span></li>`;
          })
          .join("");
        return `<div class="loja-preco"><span class="loja-etiqueta">${slot(String(preco), "emerald")}<b>${preco === 1 ? "1 esmeralda" : preco + " esmeraldas"}</b></span><ul class="loja-itens">${slots}</ul></div>`;
      })
      .join("");

    return `${blocos}
      <div class="nivel-linha">
        <div class="nivel-rotulo"><img src="${src("emerald")}" alt=""><span><b>Ofertas comuns</b><small class="sorteio">sorteia 5 de ${comuns.length}</small></span></div>
        <div class="nivel-conteudo">${loja}<p class="vila-obs">Passe o mouse em um item para ver o nome e a quantidade.</p></div>
      </div>`;
  }

  // o item de destaque brilha se for vendido encantado
  function destaqueEncantado(p) {
    return p.trocas.some((t) => t.encantado && t.voceRecebe.some(([, id]) => id === p.destaque.item));
  }

  function card(p) {
    const est = p.estacao;
    const nomeJogo = p.nomeJogo ? `<span class="aldeao-obs">No jogo em português ele se chama só “${esc(p.nomeJogo)}”.</span>` : "";
    const estacaoMini = est
      ? `<span class="aldeao-mini"><img src="${src(est.id)}" alt="">${esc(est.nome)}</span>`
      : `<span class="aldeao-mini"><img src="${src("emerald")}" alt="">Sem estação: aparece sozinho</span>`;
    const estacao = est
      ? `<div class="aldeao-estacao">
          <span class="ficha-titulo">Estação de trabalho</span>
          <b>${esc(est.nome)}</b>
          <div class="receita-corpo">${grade3x3(est)}<span class="seta" aria-hidden="true"></span><span class="slot slot--g"><img src="${src(est.id)}" alt="${esc(est.nome)}"></span></div>
          <small>${est.obs ? `Dá para usar ${esc(est.obs)}. ` : ""}Coloque perto de um aldeão sem profissão.</small>
        </div>`
      : `<div class="aldeao-estacao">
          <span class="ficha-titulo">Como encontrar</span>
          <b>Ele vem até você</b>
          <p>De tempos em tempos ele aparece perto do jogador com duas lhamas. Aproveite: depois de uns 40 minutos ele vai embora.</p>
        </div>`;

    return `<details class="painel aldeao" id="${PREFIXO}${p.id}" style="--cor: ${CORES[p.grupo]}">
        <summary class="aldeao-resumo">
          <span class="slot"><img src="${ALD}rosto-${p.id}.png" alt=""></span>
          <span class="aldeao-titulo">
            <small class="aldeao-apelido">${esc(p.apelido)}</small>
            <b class="aldeao-nome">${esc(p.nome)}</b>
            ${estacaoMini}
          </span>
          <span class="botao botao--pequeno aldeao-abrir"><span class="quando-fechado">Ver trocas</span><span class="quando-aberto">Fechar</span></span>
        </summary>
        <div class="aldeao-corpo">
          <div class="aldeao-topo">
            <img class="aldeao-retrato" src="${ALD}${p.id}.png" alt="${esc(p.nome)}" loading="lazy">
            <div class="aldeao-info">
              ${nomeJogo}
              <p>${esc(p.descricao)}</p>
              <p class="aldeao-destaque">${slot("1", p.destaque.item, destaqueEncantado(p))}<span><b>Melhor troca:</b> ${esc(p.destaque.texto)}</span></p>
              <p class="minerio-dica aldeao-dica"><img src="${src("writable_book")}" alt=""><span><b>Dica:</b> ${esc(p.dica)}</span></p>
            </div>
            ${estacao}
          </div>
          <div class="aldeao-trocas">
            <p class="trocas-legenda">Você dá <span class="troca-seta" aria-hidden="true"></span> você recebe</p>
            ${p.id === "mercador" ? trocasDoMercador(p) : trocasPorNivel(p)}
          </div>
        </div>
      </details>`;
  }

  function montarSecao() {
    const raiz = document.getElementById("aldeoes-app");
    if (!raiz) return;
    // índice de cada troca, para achar a tooltip depois
    const todas = [];
    D.profissoes.forEach((p) => p.trocas.forEach((t) => { t._i = todas.length; todas.push(t); }));

    const grupos = D.grupos
      .map((g) => {
        const cards = D.profissoes.filter((p) => p.grupo === g.id).map(card).join("");
        return `<div class="vila-grupo" style="--cor: ${CORES[g.id]}">
            <h3 class="vila-grupo-titulo">${esc(g.titulo)}</h3>
            <p class="vila-grupo-desc">${esc(g.descricao)}</p>
            ${cards}
          </div>`;
      })
      .join("");

    raiz.innerHTML = `${introducao()}
      <div class="vila-acoes">
        <button type="button" class="botao botao--pequeno" data-vila="abrir"><img src="${icone("book.png")}" alt="">Abrir todos</button>
        <button type="button" class="botao botao--pequeno" data-vila="fechar"><img src="${icone("barrier.png")}" alt="">Fechar todos</button>
      </div>
      ${grupos}`;

    if (MG.definirTooltip) {
      raiz.querySelectorAll("[data-indice]").forEach((el) => {
        const t = todas[Number(el.dataset.indice)];
        if (el.classList.contains("loja-item")) {
          const [q, id] = t.voceRecebe[0];
          MG.definirTooltip(el, `<span class="t-titulo">${esc(nome(id))}</span><span class="t-verde">${q} por ${t.voceDa[0][0]} esmeralda${t.voceDa[0][0] === "1" ? "" : "s"}</span>${t.estoque ? `<span class="t-cinza">Até ${t.estoque} trocas</span>` : ""}`);
        } else {
          MG.definirTooltip(el, tooltipTroca(t));
        }
      });
    }

    raiz.addEventListener("click", (e) => {
      const b = e.target.closest("[data-vila]");
      if (!b) return;
      const abrir = b.dataset.vila === "abrir";
      raiz.querySelectorAll("details.aldeao").forEach((d) => (d.open = abrir));
    });
  }

  /* ---------- 3. Abrir e rolar até um aldeão ---------- */
  function abrirAldeao(id, comoRolar) {
    const d = document.getElementById(PREFIXO + id);
    if (!d) return false;
    d.open = true;
    d.scrollIntoView({ block: "start", behavior: comoRolar || "auto" });
    return true;
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-aldeao]");
    if (!a) return;
    e.preventDefault();
    if (abrirAldeao(a.dataset.aldeao)) history.replaceState(null, "", "#" + PREFIXO + a.dataset.aldeao);
  });

  window.addEventListener("hashchange", () => {
    if (location.hash.startsWith("#" + PREFIXO)) abrirAldeao(location.hash.slice(PREFIXO.length + 1));
  });

  montarAtalhos();
  montarSecao();

  // Link direto (minerios.html#aldeao-bibliotecario): abre o card e rola até ele,
  // de novo quando fontes e imagens terminarem de carregar (se a pessoa não rolou).
  if (location.hash.startsWith("#" + PREFIXO)) {
    const id = decodeURIComponent(location.hash.slice(PREFIXO.length + 1));
    let posicao = -1;
    const ir = () => {
      if (posicao !== -1 && Math.abs(window.scrollY - posicao) > 4) return;
      if (abrirAldeao(id, "instant")) posicao = window.scrollY;
    };
    ir();
    if (document.fonts) document.fonts.ready.then(ir);
    window.addEventListener("load", ir, { once: true });
  }
})();
