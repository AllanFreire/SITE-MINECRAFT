/* =============================================================
   Os Encantamentos
   Monta, a partir de js/dados-encantamentos.js:
     1. o seletor "Qual o melhor encantamento?" (clique num item)
     2. a seção "Como encantar"
     3. a lista com todos os encantamentos, com filtro por item e ordem
   ============================================================= */
(function () {
  "use strict";

  const D = window.MINEGUIA_ENCANTAMENTOS;
  const MG = window.MineGuia || {};
  if (!D) return;

  const IMG = "assets/img/itens/";
  const ROM = ["I", "II", "III", "IV", "V"];
  const esc = MG.escapar || ((t) => String(t));
  const ENC = Object.fromEntries(D.encantamentos.map((e) => [e.id, e]));
  const ITEM = Object.fromEntries(D.itens.map((i) => [i.id, i]));
  const $ = (sel, raiz = document) => raiz.querySelector(sel);

  /* ---------- peças pequenas ---------- */
  const nomeComNivel = (id, n) => (ENC[id].max === 1 ? ENC[id].nome : `${ENC[id].nome} ${ROM[n - 1]}`);
  const textoDoNivel = (id, n) => ENC[id].niveis[n - 1];

  function brilho(src) {
    return `<span class="brilho" style="-webkit-mask-image: url('${src}'); mask-image: url('${src}')"></span>`;
  }

  function slot(arquivo, classe = "", encantado = false, alt = "") {
    const src = IMG + arquivo;
    return `<span class="slot ${classe}"><img src="${src}" alt="${esc(alt)}">${encantado ? brilho(src) : ""}</span>`;
  }

  const livro = () => slot("enchanted_book.png", "slot--p");

  function grade3x3(celulas) {
    return `<span class="grade3" aria-hidden="true">${celulas
      .map((a) => `<span class="slot slot--r">${a ? `<img src="${IMG}${a}" alt="">` : ""}</span>`)
      .join("")}</span>`;
  }

  /* =========================================================
     1. QUAL O MELHOR ENCANTAMENTO?
     ========================================================= */
  function linhaEnc([id, n], extra) {
    return `<li><a href="#ench-${id}" data-ench="${id}">${livro()}<span><b>${esc(nomeComNivel(id, n))}</b><small>${esc(extra || textoDoNivel(id, n))}</small></span></a></li>`;
  }

  function resultado(itemId) {
    const it = ITEM[itemId];
    const m = D.melhores[itemId];
    const total = D.encantamentos.filter((e) => e.aceitos.includes(itemId)).length;
    const onde = it.soBigorna
      ? `<span class="onde-encantar onde-encantar--bigorna">${slot("anvil.png", "slot--p")}Só na bigorna, com livros</span>`
      : `<span class="onde-encantar">${slot("enchanting_table.png", "slot--p")}Mesa de encantamentos e bigorna</span>`;

    const escolhas = (m.escolha || [])
      .map(
        (c) => `<div class="melhor-escolha">
          <h4>Escolha um destes</h4>
          <ul class="melhor-lista melhor-lista--ou">${c.opcoes.map((o) => linhaEnc(o)).join('<li class="ou" aria-hidden="true">ou</li>')}</ul>
          <p>${esc(c.texto)}</p>
        </div>`
      )
      .join("");

    const extras = m.extras && m.extras.length
      ? `<div class="melhor-extras"><h4>Opcional</h4><ul class="melhor-lista">${m.extras.map(([id, n, txt]) => linhaEnc([id, n], txt)).join("")}</ul></div>`
      : "";

    return `<div class="painel melhor-painel">
        <div class="melhor-topo">
          ${slot(it.img, "slot--g", true, it.nome + " encantado")}
          <div>
            <small class="melhor-rotulo">Melhor combinação</small>
            <h3>${esc(it.nome)}</h3>
            ${onde}
          </div>
        </div>
        <div class="melhor-colunas">
          <div>
            <h4>Coloque todos estes</h4>
            <ul class="melhor-lista">${m.lista.map((x) => linhaEnc(x)).join("")}</ul>
            ${escolhas}
          </div>
          <div>
            ${extras}
            <p class="minerio-dica"><img src="${IMG}writable_book.png" alt=""><span><b>Dica:</b> ${esc(m.dica)}</span></p>
            <button type="button" class="botao botao--pequeno" data-filtrar="${itemId}"><img src="${IMG}bookshelf.png" alt="">Ver os ${total} encantamentos que esse item aceita</button>
          </div>
        </div>
      </div>`;
  }

  function selecionar(itemId, atualizarEndereco) {
    if (!ITEM[itemId]) return;
    document.querySelectorAll("[data-item]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.item === itemId ? "true" : "false"));
    $("#melhor-resultado").innerHTML = resultado(itemId);
    if (atualizarEndereco) history.replaceState(null, "", "#melhor-" + itemId);
  }

  function montarSeletor() {
    const raiz = $("#seletor");
    if (!raiz) return;
    raiz.innerHTML = D.itens
      .map(
        (it) => `<button type="button" class="escolha-item" data-item="${it.id}" aria-pressed="false">
          <span class="passo-icone"><img src="${IMG}${it.img}" alt="">${brilho(IMG + it.img)}</span>
          <b>${esc(it.nome)}</b>
        </button>`
      )
      .join("");
    raiz.addEventListener("click", (e) => {
      const b = e.target.closest("[data-item]");
      if (b) selecionar(b.dataset.item, true);
    });
    const doEndereco = location.hash.startsWith("#melhor-") ? location.hash.slice(8) : "";
    selecionar(ITEM[doEndereco] ? doEndereco : D.itens[0].id, false);
    // um link #melhor-xxx clicado na própria página também troca o item
    window.addEventListener("hashchange", () => {
      if (location.hash.startsWith("#melhor-")) selecionar(location.hash.slice(8), false);
    });
  }

  /* =========================================================
     2. COMO ENCANTAR
     ========================================================= */
  function montarComo() {
    const raiz = $("#como-app");
    if (!raiz) return;
    const E = "bookshelf.png";
    // vista de cima: 15 estantes em volta, 1 bloco de ar entre elas e a mesa, e uma entrada
    const estantes = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const borda = x === 0 || y === 0 || x === 4 || y === 4;
        if (x === 2 && y === 2) estantes.push("enchanting_table.png");
        else if (borda && !(x === 2 && y === 4)) estantes.push(E);
        else estantes.push(null);
      }
    }
    const fontes = [
      [IMG + "enchanting_table.png", "Na mesa:", "encante um livro comum."],
      ["assets/img/aldeoes/rosto-bibliotecario.png", "Bibliotecário:", "vende livros de quase todos os encantamentos, até Remendo."],
      [IMG + "fishing_rod.png", "Pesca:", "às vezes a pescaria traz um livro encantado."],
      [IMG + "chest.png", "Baús:", "masmorras, templos, cidades antigas, câmaras de desafio..."],
    ]
      .map(([src, t, txt]) => `<li><span class="slot slot--p"><img src="${src}" alt=""></span><span><b>${t}</b> ${txt}</span></li>`)
      .join("");
    const tesouros = D.encantamentos.filter((e) => e.tesouro && !e.maldicao).map((e) => `<a href="#ench-${e.id}">${esc(e.nome)}</a>`).join(", ");
    const maldicoes = D.encantamentos.filter((e) => e.maldicao).map((e) => `<a href="#ench-${e.id}">${esc(e.nome)}</a>`).join(" e ");

    raiz.innerHTML = `<div class="como-grade">
        <article class="painel como como--mesa">
          <h3>${slot("enchanting_table.png", "slot--p")}Mesa de Encantamentos</h3>
          <div class="receita-corpo">${grade3x3([null, "book.png", null, "diamond.png", "obsidian.png", "diamond.png", "obsidian.png", "obsidian.png", "obsidian.png"])}<span class="seta" aria-hidden="true"></span>${slot("enchanting_table.png", "slot--g", false, "Mesa de Encantamentos")}</div>
          <ul class="como-lista">
            <li>Coloque o item e de 1 a 3 <b>lápis-lazúli</b>. Cada opção gasta 1, 2 ou 3 níveis de experiência.</li>
            <li>Com <b>15 estantes</b> em volta, a opção de baixo chega ao nível 30 — o máximo, e onde saem os melhores encantamentos.</li>
            <li>Os encantamentos são sorteados: você só vê o primeiro antes de escolher.</li>
          </ul>
          <div class="estantes">
            <span class="estantes-grade" aria-hidden="true">${estantes.map((a) => `<span class="slot slot--r${a ? "" : " vazio"}">${a ? `<img src="${IMG}${a}" alt="">` : ""}</span>`).join("")}</span>
            <p>Vista de cima: as estantes ficam a 2 blocos da mesa, com <b>um bloco de ar</b> entre elas (nem tocha pode ficar no meio). A abertura embaixo é a entrada.</p>
          </div>
        </article>

        <article class="painel como">
          <h3>${slot("anvil.png", "slot--p")}Bigorna</h3>
          <div class="receita-corpo como-bigorna">${slot("netherite_sword.png", "slot--p")}<span class="troca-mais">+</span>${slot("enchanted_book.png", "slot--p")}<span class="seta" aria-hidden="true"></span>${slot("netherite_sword.png", "slot--p", true, "Espada encantada")}</div>
          <ul class="como-lista">
            <li>Junte um item com um <b>livro encantado</b> (ou dois itens iguais) para somar os encantamentos.</li>
            <li>Dois iguais no mesmo nível sobem um nível: <b>Afiação IV + Afiação IV = Afiação V</b>.</li>
            <li>É o único jeito de colocar Remendo e de encantar élitros, escudo e tesoura.</li>
            <li>Cada passada pela bigorna deixa a próxima mais cara. Se o custo chegar a 40 níveis, aparece <b>"Muito caro!"</b>. Dica: junte os livros entre si primeiro e coloque no item uma vez só.</li>
          </ul>
        </article>

        <article class="painel como">
          <h3>${slot("enchanted_book.png", "slot--p")}Onde conseguir livros</h3>
          <ul class="como-fontes">${fontes}</ul>
          <p class="como-obs"><b>Tesouros:</b> ${tesouros} nunca saem na mesa de encantamentos — só em baús, trocas, pesca e outros lugares especiais.</p>
        </article>

        <article class="painel como">
          <h3>${slot("grindstone.png", "slot--p")}Rebolo: tirar encantamentos</h3>
          <ul class="como-lista">
            <li>Coloque o item no rebolo para <b>tirar todos os encantamentos</b> e ganhar de volta um pouco de experiência.</li>
            <li>Ótimo para reaproveitar um item que saiu com encantamentos ruins.</li>
            <li>As maldições (${maldicoes}) <b>não saem</b> no rebolo.</li>
          </ul>
          <h4 class="como-sub">Lendo os níveis</h4>
          <p class="romanos">${ROM.map((r, i) => `<span><b>${r}</b> = ${i + 1}</span>`).join("")}</p>
        </article>
      </div>`;
  }

  /* =========================================================
     3. TODOS OS ENCANTAMENTOS
     ========================================================= */
  let filtro = "";
  let ordem = "nivel";

  function iconesDosItens(e) {
    const lista = e.aceitos.map((id) => ITEM[id]);
    const mostrar = lista.slice(0, 7);
    const resto = lista.length - mostrar.length;
    return `<span class="enc-icones">${mostrar.map((it) => `<img src="${IMG}${it.img}" alt="${esc(it.nome)}" title="${esc(it.nome)}">`).join("")}${resto > 0 ? `<small>+${resto}</small>` : ""}</span>`;
  }

  function card(e) {
    const tags = (e.tesouro && !e.maldicao ? '<span class="tag tag--tesouro">Tesouro</span>' : "") + (e.maldicao ? '<span class="tag tag--maldicao">Maldição</span>' : "");
    const conflitos = e.conflitos
      ? `<p class="enc-conflito"><b>Não combina com:</b> ${e.conflitos.map((id) => `<a href="#ench-${id}">${esc(ENC[id].nome)}</a>`).join(", ")}</p>`
      : "";
    const onde = e.onde ? `<p class="enc-onde"><b>Onde conseguir:</b> ${esc(e.onde)}</p>` : "";
    const niveis = e.niveis
      .map((t, i) => `<li><span class="romano">${ROM[i]}</span><span>${esc(t)}</span></li>`)
      .join("");
    return `<article class="painel enc${e.maldicao ? " enc--maldicao" : ""}" id="ench-${e.id}">
        <header class="enc-topo">
          ${slot("enchanted_book.png", "slot--p", false)}
          <div>
            <h4>${esc(e.nome)}</h4>
            <span class="enc-max">Nível máximo: <b>${ROM[e.max - 1]}</b>${tags ? `<span class="enc-tags">${tags}</span>` : ""}</span>
          </div>
        </header>
        <p class="enc-desc">${esc(e.descricao)}</p>
        <p class="enc-itens"><b>Funciona em:</b> ${esc(e.itens)} ${iconesDosItens(e)}</p>
        <ol class="enc-niveis">${niveis}</ol>
        ${conflitos}${onde}
      </article>`;
  }

  function desenharLista() {
    const raiz = $("#lista-enc");
    const visiveis = D.encantamentos.filter((e) => !filtro || e.aceitos.includes(filtro));
    const comparar = ordem === "az" ? (a, b) => a.nome.localeCompare(b.nome, "pt-BR") : (a, b) => a.max - b.max || a.nome.localeCompare(b.nome, "pt-BR");
    raiz.innerHTML = D.categorias
      .map((c) => {
        const lista = visiveis.filter((e) => e.categoria === c.id).sort(comparar);
        if (!lista.length) return "";
        return `<section class="grupo-enc">
            <h3 class="grupo-enc-titulo"><img src="${IMG}${c.img}" alt="">${esc(c.nome)} <small>(${lista.length})</small></h3>
            <div class="enc-grade">${lista.map(card).join("")}</div>
          </section>`;
      })
      .join("");
    const n = visiveis.length;
    $("#contagem-enc").textContent = filtro ? `${n} encantamentos para ${ITEM[filtro].nome}` : `${n} encantamentos`;
    $("#filtro-item").value = filtro;
    document.querySelectorAll("[data-ordem]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.ordem === ordem ? "true" : "false"));
  }

  function montarTodos() {
    const raiz = $("#todos-app");
    if (!raiz) return;
    raiz.innerHTML = `<div class="painel filtros">
        <label class="filtro-item">Mostrar encantamentos para
          <select id="filtro-item"><option value="">Todos os itens</option>${D.itens.map((it) => `<option value="${it.id}">${esc(it.nome)}</option>`).join("")}</select>
        </label>
        <div class="filtro-ordem" role="group" aria-label="Ordem da lista">
          <span>Ordem:</span>
          <button type="button" class="botao botao--pequeno" data-ordem="nivel" aria-pressed="true">Nível máximo (menor → maior)</button>
          <button type="button" class="botao botao--pequeno" data-ordem="az" aria-pressed="false">A–Z</button>
        </div>
        <p class="contagem" id="contagem-enc" aria-live="polite"></p>
      </div>
      <div id="lista-enc"></div>`;

    $("#filtro-item").addEventListener("change", (e) => {
      filtro = e.target.value;
      desenharLista();
    });
    raiz.addEventListener("click", (e) => {
      const b = e.target.closest("[data-ordem]");
      if (!b) return;
      ordem = b.dataset.ordem;
      desenharLista();
    });
    desenharLista();
  }

  /* ---------- ir até um encantamento (e piscar o card) ---------- */
  function irPara(id) {
    let alvo = document.getElementById("ench-" + id);
    if (!alvo) {
      // está escondido pelo filtro: mostra todos de novo
      filtro = "";
      desenharLista();
      alvo = document.getElementById("ench-" + id);
    }
    if (!alvo) return;
    alvo.scrollIntoView({ block: "start" });
    alvo.classList.remove("piscar");
    void alvo.offsetWidth; // reinicia a animação
    alvo.classList.add("piscar");
    history.replaceState(null, "", "#ench-" + id);
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#ench-"]');
    if (a) {
      e.preventDefault();
      irPara(a.getAttribute("href").slice(6));
      return;
    }
    const f = e.target.closest("[data-filtrar]");
    if (f) {
      filtro = f.dataset.filtrar;
      desenharLista();
      $("#todos").scrollIntoView({ block: "start" });
    }
  });

  montarSeletor();
  montarComo();
  montarTodos();

  // link direto para um encantamento (encantamentos.html#ench-mending)
  if (location.hash.startsWith("#ench-")) {
    const id = location.hash.slice(6);
    let posicao = -1;
    const ir = () => {
      if (posicao !== -1 && Math.abs(window.scrollY - posicao) > 4) return;
      const alvo = document.getElementById("ench-" + id);
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
