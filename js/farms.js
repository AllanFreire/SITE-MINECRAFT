/* =============================================================
   MineGuia — Farms automáticas
     1. dados e utilidades
     2. busca por item (sugestões) e filtros
     3. cards do catálogo
     4. janela de detalhes de cada farm
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. Dados e utilidades ---------- */
  const DADOS = window.MINEGUIA_FARMS;
  if (!DADOS) return;
  const { itens: ITENS, mobs: MOBS, farms: FARMS } = DADOS;
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const esc = window.MineGuia && MineGuia.escapar
    ? MineGuia.escapar
    : (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const normalizar = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const num = (n, casas = 2) => Number(n).toLocaleString("pt-BR", { maximumFractionDigits: casas });

  const ROTULOS = {
    grupo: { plantas: "Plantas e madeira", blocos: "Blocos", animais: "Animais e aldeões", mobs: "Mobs" },
    dim: { superficie: "Superfície", nether: "Nether", end: "The End", qualquer: "Qualquer dimensão" },
    tipo: { auto: "Automática", afk: "AFK", semi: "Semiautomática" },
    dif: { 1: "Fácil", 2: "Média", 3: "Difícil" },
    fase: { 1: "Começo do jogo", 2: "Meio do jogo", 3: "Fim de jogo" },
  };
  const ICONE_DIM = { superficie: "grass_block", nether: "netherrack", end: "end_stone", qualquer: "compass" };
  const iconeDim = (d) => `assets/img/itens/${ICONE_DIM[d]}.png`;
  const POPULARES = ["iron_ingot", "gold_ingot", "emerald", "xp", "gunpowder", "ender_pearl", "slime_ball", "string",
    "bone_meal", "white_wool", "totem_of_undying", "shulker_shell", "blaze_rod", "wither_skeleton_skull", "redstone", "sugar_cane"];
  const XP = { nome: "Experiência (XP)", icone: "assets/img/itens/experience_bottle.png" };

  const nomeItem = (id) => (id === "xp" ? XP.nome : (ITENS[id] || [id])[0]);
  const iconeItem = (id) => {
    if (id === "xp") return XP.icone;
    const it = ITENS[id];
    return it && it[1] ? it[1] : "assets/img/itens/barrier.png";
  };
  const img = (id, cls = "") => `<img${cls ? ` class="${cls}"` : ""} src="${iconeItem(id)}" alt="" loading="lazy">`;

  // texto de busca de cada farm, já normalizado
  FARMS.forEach((f) => {
    f._busca = normalizar([f.nome, f.en, f.resumo, ...f.produz.map(nomeItem), ...(f.vira || []).map(nomeItem)].join(" "));
  });

  // itens que aparecem como produto (direto ou via receita), para as sugestões
  const PRODUTOS = (() => {
    const mapa = new Map();
    FARMS.forEach((f) => {
      f.produz.forEach((id) => mapa.set(id, (mapa.get(id) || 0) + 2));
      (f.vira || []).forEach((id) => mapa.set(id, (mapa.get(id) || 0) + 1));
    });
    mapa.set("xp", 99);
    return Array.from(mapa.keys()).map((id) => ({ id, nome: nomeItem(id), chave: normalizar(nomeItem(id)) }));
  })();

  /* ---------- 2. Estado, filtros e busca ---------- */
  const estado = { termo: "", item: "", grupo: "todas", dim: "todas", tipo: "todos", dif: "todas", ordem: "recomendadas" };

  const el = {
    busca: $("#farms-busca"),
    sugestoes: $("#farms-sugestoes"),
    populares: $("#farms-populares"),
    lista: $("#farms-lista"),
    contador: $("#farms-contador"),
    limpar: $("#farms-limpar"),
    vazio: $("#farms-vazio"),
    itemAtivo: $("#farms-item"),
    dim: $("#farms-dimensao"),
    tipo: $("#farms-tipo"),
    dif: $("#farms-dificuldade"),
    ordem: $("#farms-ordem"),
    modal: $("#farm-modal"),
    conteudo: $("#farm-modal-conteudo"),
  };
  if (!el.lista) return;

  document.querySelectorAll("[data-farms-total]").forEach((s) => { s.textContent = FARMS.length; });

  function daItem(f, id) {
    if (id === "xp") return f.xp ? 2 : 0;
    if (f.produz.includes(id)) return 2;
    if ((f.vira || []).includes(id)) return 1;
    // drop raro (menos de 5%) não faz a farm aparecer como fonte do item
    if ((f.drops || []).some((d) => d.itens.some((x) => x.i === id && x.c >= 5))) return 2;
    if (f.tabela && f.tabela.linhas.some((x) => x.i === id)) return 2;
    return 0;
  }

  function passa(f) {
    if (estado.item && !daItem(f, estado.item)) return false;
    if (estado.termo && !f._busca.includes(estado.termo)) return false;
    if (estado.grupo === "xp" && !f.xp) return false;
    if (estado.grupo === "novas" && !f.novo) return false;
    if (!["todas", "xp", "novas"].includes(estado.grupo) && f.grupo !== estado.grupo) return false;
    if (estado.dim !== "todas" && f.dim !== estado.dim && f.dim !== "qualquer") return false;
    if (estado.tipo !== "todos" && f.tipo !== estado.tipo) return false;
    if (estado.dif !== "todas" && String(f.dif) !== estado.dif) return false;
    return true;
  }

  function ordenar(a, b) {
    if (estado.item) {
      const d = daItem(b, estado.item) - daItem(a, estado.item);
      if (d) return d;
    }
    const nome = a.nome.localeCompare(b.nome, "pt-BR");
    switch (estado.ordem) {
      case "az": return nome;
      case "facil": return a.dif - b.dif || a.fase - b.fase || nome;
      case "fase": return a.fase - b.fase || a.dif - b.dif || nome;
      default: return (b.top ? 1 : 0) - (a.top ? 1 : 0) || a.fase - b.fase || a.dif - b.dif || nome;
    }
  }

  let resultado = [];

  function filtrar() {
    resultado = FARMS.filter(passa).sort(ordenar);
    el.lista.innerHTML = resultado.map(card).join("");
    const n = resultado.length;
    el.contador.textContent = n === FARMS.length
      ? `${n} farms no catálogo`
      : `${n} ${n === 1 ? "farm encontrada" : "farms encontradas"} de ${FARMS.length}`;
    el.vazio.hidden = n > 0;
    const sujo = estado.item || estado.termo || estado.grupo !== "todas" || estado.dim !== "todas" ||
      estado.tipo !== "todos" || estado.dif !== "todas";
    el.limpar.hidden = !sujo;
    mostrarItemAtivo();
    marcarPopulares();
    guardarNaUrl();
  }

  function mostrarItemAtivo() {
    if (!estado.item) {
      el.itemAtivo.hidden = true;
      el.itemAtivo.innerHTML = "";
      return;
    }
    const diretas = resultado.filter((f) => daItem(f, estado.item) === 2).length;
    const receitas = resultado.length - diretas;
    el.itemAtivo.hidden = false;
    el.itemAtivo.innerHTML =
      `<span class="farm-item-ativo__icone">${img(estado.item)}</span>` +
      `<div><small>Farms que entregam</small><b>${esc(nomeItem(estado.item))}</b>` +
      `<span>${diretas} ${diretas === 1 ? "direta" : "diretas"}${receitas ? ` · ${receitas} via receita` : ""}</span></div>` +
      `<button type="button" data-limpar-item aria-label="Tirar o filtro de item">Trocar item</button>`;
  }

  function escolherItem(id) {
    estado.item = id;
    estado.termo = "";
    el.busca.value = "";
    fecharSugestoes();
    filtrar();
    const topo = el.itemAtivo.getBoundingClientRect().top + window.scrollY - 130;
    if (Math.abs(window.scrollY - topo) > 400) window.scrollTo({ top: topo, behavior: "smooth" });
  }

  /* populares */
  el.populares.innerHTML = POPULARES.filter((id) => id === "xp" || ITENS[id]).map((id) =>
    `<button type="button" class="farm-pop" data-item="${id}" aria-pressed="false">${img(id)}<span>${esc(nomeItem(id))}</span></button>`
  ).join("");

  function marcarPopulares() {
    el.populares.querySelectorAll("[data-item]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.item === estado.item));
    });
  }

  el.populares.addEventListener("click", (e) => {
    const b = e.target.closest("[data-item]");
    if (b) escolherItem(estado.item === b.dataset.item ? "" : b.dataset.item);
  });

  /* sugestões da busca (combobox) */
  let sugestoes = [];
  let ativa = -1;

  function fecharSugestoes() {
    el.sugestoes.hidden = true;
    el.busca.setAttribute("aria-expanded", "false");
    el.busca.removeAttribute("aria-activedescendant");
    ativa = -1;
  }

  function abrirSugestoes() {
    const termo = normalizar(el.busca.value.trim());
    if (termo.length < 2) return fecharSugestoes();
    sugestoes = PRODUTOS
      .filter((p) => p.chave.includes(termo))
      .sort((a, b) => (a.chave.startsWith(termo) ? 0 : 1) - (b.chave.startsWith(termo) ? 0 : 1) || a.nome.localeCompare(b.nome, "pt-BR"))
      .slice(0, 7);
    if (!sugestoes.length) return fecharSugestoes();
    el.sugestoes.innerHTML = sugestoes.map((p, i) => {
      const n = FARMS.filter((f) => daItem(f, p.id)).length;
      return `<li id="sug-${i}" role="option" aria-selected="false" data-item="${p.id}">${img(p.id)}<span>${esc(p.nome)}</span><small>${n} ${n === 1 ? "farm" : "farms"}</small></li>`;
    }).join("");
    el.sugestoes.hidden = false;
    el.busca.setAttribute("aria-expanded", "true");
    ativa = -1;
  }

  function marcarSugestao(i) {
    const itens = el.sugestoes.querySelectorAll("[role=option]");
    if (!itens.length) return;
    ativa = (i + itens.length) % itens.length;
    itens.forEach((li, k) => li.setAttribute("aria-selected", String(k === ativa)));
    el.busca.setAttribute("aria-activedescendant", itens[ativa].id);
  }

  el.busca.addEventListener("input", () => {
    estado.termo = normalizar(el.busca.value.trim());
    if (estado.termo) estado.item = "";
    abrirSugestoes();
    filtrar();
  });
  el.busca.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (el.sugestoes.hidden) abrirSugestoes();
      marcarSugestao(ativa + (e.key === "ArrowDown" ? 1 : -1));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (!el.sugestoes.hidden && ativa >= 0) {
        escolherItem(sugestoes[ativa].id);
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      fecharSugestoes();
    }
  });
  el.busca.addEventListener("focus", abrirSugestoes);
  el.busca.addEventListener("blur", () => setTimeout(fecharSugestoes, 120));
  el.sugestoes.addEventListener("mousedown", (e) => {
    const li = e.target.closest("[data-item]");
    if (li) {
      e.preventDefault();
      escolherItem(li.dataset.item);
    }
  });

  /* grupos e selects */
  const botoesGrupo = document.querySelectorAll("[data-grupo]");
  function marcarGrupo() {
    botoesGrupo.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.grupo === estado.grupo)));
  }
  botoesGrupo.forEach((b) => b.addEventListener("click", () => {
    estado.grupo = b.dataset.grupo;
    marcarGrupo();
    filtrar();
  }));

  [["dim", el.dim], ["tipo", el.tipo], ["dif", el.dif], ["ordem", el.ordem]].forEach(([chave, select]) => {
    select.addEventListener("change", () => {
      estado[chave] = select.value;
      filtrar();
    });
  });

  function limparTudo() {
    Object.assign(estado, { termo: "", item: "", grupo: "todas", dim: "todas", tipo: "todos", dif: "todas" });
    el.busca.value = "";
    el.dim.value = "todas";
    el.tipo.value = "todos";
    el.dif.value = "todas";
    marcarGrupo();
    filtrar();
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("#farms-limpar, [data-limpar]")) limparTudo();
    if (e.target.closest("[data-limpar-item]")) {
      estado.item = "";
      filtrar();
      el.busca.focus();
    }
  });

  /* filtros na URL: ?item=iron_ingot&grupo=mobs */
  function guardarNaUrl() {
    const p = new URLSearchParams();
    if (estado.item) p.set("item", estado.item);
    if (estado.grupo !== "todas") p.set("grupo", estado.grupo);
    const busca = p.toString();
    const url = location.pathname + (busca ? `?${busca}` : "") + location.hash;
    if (url !== location.pathname + location.search + location.hash) history.replaceState(history.state, "", url);
  }

  function lerDaUrl() {
    const p = new URLSearchParams(location.search);
    const item = p.get("item");
    if (item && (item === "xp" || ITENS[item])) estado.item = item;
    const grupo = p.get("grupo");
    if (grupo && document.querySelector(`[data-grupo="${CSS.escape(grupo)}"]`)) estado.grupo = grupo;
    marcarGrupo();
  }

  /* ---------- 3. Cards ---------- */
  const selo = (f) => `<span class="farm-selo farm-selo--${f.tipo}">${ROTULOS.tipo[f.tipo]}</span>`;
  const dificuldade = (d) =>
    `<span class="farm-dif" role="img" aria-label="Dificuldade ${ROTULOS.dif[d].toLowerCase()}" data-dif="${d}"><i></i><i></i><i></i></span>`;

  function card(f) {
    const produtos = f.produz.slice(0, 6);
    const mais = f.produz.length - produtos.length;
    const destaque = estado.item && daItem(f, estado.item) === 1
      ? `<p class="farm-card__via">${img(estado.item)} Vira ${esc(nomeItem(estado.item))} com uma receita</p>` : "";
    return `<article class="farm-card${f.novo ? " farm-card--novo" : ""}" data-farm="${f.id}">
      <div class="farm-card__topo">
        <span class="farm-card__icone">${img(f.icone)}</span>
        <div class="farm-card__selos">${selo(f)}${f.novo ? `<span class="farm-selo farm-selo--novo">Novo na ${esc(f.novo)}</span>` : ""}${f.top ? `<span class="farm-selo farm-selo--top">Essencial</span>` : ""}</div>
      </div>
      <h3><button type="button" class="farm-card__abrir" data-abrir-farm="${f.id}" aria-haspopup="dialog">${esc(f.nome)}</button></h3>
      <p class="farm-card__resumo">${esc(f.resumo)}</p>
      ${destaque}
      <ul class="farm-card__itens" aria-label="Produz">${produtos.map((id) =>
        `<li data-tip="${esc(nomeItem(id))}">${img(id)}<span class="sr-only">${esc(nomeItem(id))}</span></li>`).join("")}${mais > 0 ? `<li class="farm-card__mais">+${mais}</li>` : ""}</ul>
      <div class="farm-card__rodape">
        <span class="farm-card__dim"><img src="${iconeDim(f.dim)}" alt="">${ROTULOS.dim[f.dim]}</span>
        ${dificuldade(f.dif)}
        <span class="farm-card__ver" aria-hidden="true">Ver farm</span>
      </div>
    </article>`;
  }

  // o card inteiro abre a farm (o botão no título é o alvo do teclado)
  el.lista.addEventListener("click", (e) => {
    const c = e.target.closest(".farm-card");
    if (c && !e.target.closest("a")) abrirFarm(c.dataset.farm, e.target.closest("button") || c.querySelector(".farm-card__abrir"));
  });

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-abrir-farm]");
    if (b && !b.closest(".farm-card")) abrirFarm(b.dataset.abrirFarm, b);
  });

  /* ---------- 4. Janela de detalhes ---------- */
  let atual = null;
  let voltarPara = null;

  function listaItens(ids, classe) {
    return `<ul class="${classe}">${ids.map((id) =>
      `<li><button type="button" data-escolher-item="${id}" title="Ver farms de ${esc(nomeItem(id))}">${img(id)}<span>${esc(nomeItem(id))}</span></button></li>`).join("")}</ul>`;
  }

  function tabelaDrops(d) {
    const mob = MOBS[d.mob] || d.mob;
    const sprite = (ITENS["mob:" + d.mob] || [])[1] || "";
    const linhas = d.itens.map((x) => `<tr>
        <th scope="row">${img(x.i)}<span>${esc(nomeItem(x.i))}${x.j ? `<em class="tag-jogador">só se você matar</em>` : ""}${x.n ? `<em>${esc(x.n)}</em>` : ""}</span></th>
        <td>${num(x.c, 1)}%</td><td>${num(x.m)}</td><td>${num(x.m3)}</td></tr>`).join("");
    return `<div class="farm-drops__mob">
      <h4>${sprite ? `<img src="${sprite}" alt="">` : ""}${esc(mob)}</h4>
      <div class="farm-tabela-rolagem"><table class="farm-tabela">
        <thead><tr><th scope="col">Item</th><th scope="col">Chance</th><th scope="col">Média</th><th scope="col">Saque III</th></tr></thead>
        <tbody>${linhas || `<tr><td colspan="4">Não solta itens — só XP.</td></tr>`}</tbody>
      </table></div>
    </div>`;
  }

  function tabelaExtra(t) {
    const pesca = t.colunas.length === 3 && t.linhas.some((x) => "p3" in x);
    const corpo = t.linhas.map((x) => {
      const nome = `${img(x.i)}<span>${esc(x.t || nomeItem(x.i))}${x.s ? `<em>${esc(x.s)}</em>` : ""}${x.g ? `<em class="tag-grupo">${esc(x.g)}</em>` : ""}</span>`;
      return pesca
        ? `<tr><th scope="row">${nome}</th><td>${num(x.p)}%</td><td>${num(x.p3)}%</td></tr>`
        : `<tr><th scope="row">${nome}</th><td>${num(x.p)}%</td><td>${esc(x.q)}</td></tr>`;
    }).join("");
    return `<section class="farm-bloco farm-bloco--largo">
      <h3>${esc(t.titulo)}</h3>
      <div class="farm-tabela-rolagem"><table class="farm-tabela">
        <thead><tr>${t.colunas.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${corpo}</tbody>
      </table></div>
      ${t.nota ? `<p class="farm-tabela__nota">${esc(t.nota)}</p>` : ""}
    </section>`;
  }

  function conteudo(f) {
    const pos = resultado.indexOf(f);
    const anterior = pos > 0 ? resultado[pos - 1] : null;
    const proxima = pos >= 0 && pos < resultado.length - 1 ? resultado[pos + 1] : null;
    return `
      <header class="farm-modal__cabeca">
        <span class="farm-modal__icone">${img(f.icone)}</span>
        <div class="farm-modal__titulo">
          <p>${ROTULOS.grupo[f.grupo]} · ${ROTULOS.dim[f.dim]}</p>
          <h2 id="farm-modal-titulo">${esc(f.nome)}</h2>
        </div>
        <button type="button" class="farm-modal__fechar" data-fechar aria-label="Fechar">
          <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </header>
      <div class="farm-modal__corpo">
        <div class="farm-modal__fichas">
          <span class="farm-ficha"><small>Funcionamento</small><b>${ROTULOS.tipo[f.tipo]}</b></span>
          <span class="farm-ficha"><small>Dificuldade</small><b>${ROTULOS.dif[f.dif]}</b></span>
          <span class="farm-ficha"><small>Quando fazer</small><b>${ROTULOS.fase[f.fase]}</b></span>
          <span class="farm-ficha farm-ficha--versao"><small>Versão</small><b>Java 26.3${f.novo ? " · novidade" : ""}</b></span>
        </div>
        <p class="farm-modal__resumo">${esc(f.resumo)}</p>

        <div class="farm-modal__grade">
          <section class="farm-bloco">
            <h3>Como funciona</h3>
            <p>${esc(f.funciona)}</p>
          </section>
          <section class="farm-bloco">
            <h3>Passo a passo</h3>
            <ol class="farm-passos">${f.passos.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
          </section>
        </div>

        <div class="farm-modal__grade">
          <section class="farm-bloco">
            <h3>Produz</h3>
            ${listaItens(f.produz, "farm-itens")}
            ${f.vira ? `<h4>E vira também</h4>${listaItens(f.vira, "farm-itens farm-itens--vira")}` : ""}
          </section>
          <section class="farm-bloco">
            <h3>Você vai precisar</h3>
            <ul class="farm-materiais">${f.req.map(([id, t]) => `<li>${img(id)}<span>${esc(t)}</span></li>`).join("")}</ul>
          </section>
        </div>

        ${f.drops ? `<section class="farm-bloco farm-bloco--largo farm-drops">
          <h3>Drops por abate na 26.3</h3>
          <p class="farm-tabela__nota">Chance de cair ao menos 1, média sem encantamento e média com Saque III — direto das tabelas de loot do jogo.</p>
          <div class="farm-drops__grade">${f.drops.map(tabelaDrops).join("")}</div>
        </section>` : ""}
        ${f.tabela ? tabelaExtra(f.tabela) : ""}

        <div class="farm-notas">
          ${f.rend ? `<p class="farm-nota farm-nota--rend"><b>Rendimento</b>${esc(f.rend)}</p>` : ""}
          <p class="farm-nota farm-nota--dica"><b>Dica</b>${esc(f.dica)}</p>
          <p class="farm-nota farm-nota--versao"><b>Na 26.3</b>${esc(f.versao)}</p>
        </div>
      </div>
      <footer class="farm-modal__rodape">
        <div class="farm-modal__links">
          <a class="farm-link farm-link--guia" href="${f.guia}" target="_blank" rel="noopener noreferrer">Guia na Minecraft Wiki <span aria-hidden="true">↗</span></a>
          <a class="farm-link" href="${f.video}" target="_blank" rel="noopener noreferrer">Vídeos 26.3 <span aria-hidden="true">▶</span></a>
        </div>
        <div class="farm-modal__nav">
          <button type="button" class="farm-link farm-link--copiar" data-copiar>Copiar link</button>
          <button type="button" data-ir="${anterior ? anterior.id : ""}" ${anterior ? "" : "disabled"} aria-label="Farm anterior">‹</button>
          <span>${pos >= 0 ? `${pos + 1} de ${resultado.length}` : ""}</span>
          <button type="button" data-ir="${proxima ? proxima.id : ""}" ${proxima ? "" : "disabled"} aria-label="Próxima farm">›</button>
        </div>
      </footer>`;
  }

  function abrirFarm(id, origem) {
    const f = FARMS.find((x) => x.id === id);
    if (!f) return;
    atual = f;
    if (origem) voltarPara = origem;
    el.conteudo.innerHTML = conteudo(f);
    el.conteudo.scrollTop = 0;
    if (!el.modal.open) {
      if (typeof el.modal.showModal === "function") el.modal.showModal();
      else el.modal.setAttribute("open", "");
      document.documentElement.classList.add("modal-aberto");
    }
    $(".farm-modal__fechar", el.conteudo).focus({ preventScroll: true });
    const hash = `#farm-${f.id}`;
    if (location.hash !== hash) history.replaceState(history.state, "", location.pathname + location.search + hash);
  }

  function fecharFarm() {
    if (el.modal.open) {
      if (typeof el.modal.close === "function") el.modal.close();
      else el.modal.removeAttribute("open");
    }
  }

  el.modal.addEventListener("close", () => {
    document.documentElement.classList.remove("modal-aberto");
    atual = null;
    if (location.hash.startsWith("#farm-")) history.replaceState(history.state, "", location.pathname + location.search);
    if (voltarPara && document.contains(voltarPara)) voltarPara.focus({ preventScroll: true });
    else {
      const c = voltarPara && voltarPara.dataset && el.lista.querySelector(`[data-farm="${voltarPara.dataset.abrirFarm}"] .farm-card__abrir`);
      if (c) c.focus({ preventScroll: true });
    }
  });

  // clique fora da caixa fecha
  el.modal.addEventListener("click", (e) => {
    if (e.target === el.modal) fecharFarm();
  });

  el.conteudo.addEventListener("click", (e) => {
    if (e.target.closest("[data-fechar]")) return fecharFarm();
    const ir = e.target.closest("[data-ir]");
    if (ir && ir.dataset.ir) return abrirFarm(ir.dataset.ir);
    const item = e.target.closest("[data-escolher-item]");
    if (item) {
      fecharFarm();
      escolherItem(item.dataset.escolherItem);
      return;
    }
    const copiar = e.target.closest("[data-copiar]");
    if (copiar && atual) {
      const url = location.origin + location.pathname + `#farm-${atual.id}`;
      const ok = () => {
        copiar.textContent = "Link copiado!";
        setTimeout(() => { copiar.textContent = "Copiar link"; }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, () => prompt("Copie o link:", url));
      else prompt("Copie o link:", url);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!atual || !el.modal.open) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      if (e.target.closest("input, select, textarea")) return;
      const b = el.conteudo.querySelector(`[data-ir][aria-label="${e.key === "ArrowRight" ? "Próxima farm" : "Farm anterior"}"]`);
      if (b && b.dataset.ir) abrirFarm(b.dataset.ir);
    }
  });

  function abrirPeloHash() {
    const m = location.hash.match(/^#farm-([\w-]+)$/);
    if (m) abrirFarm(m[1]);
  }
  window.addEventListener("hashchange", abrirPeloHash);

  /* ---------- início ---------- */
  lerDaUrl();
  filtrar();
  abrirPeloHash();
})();
