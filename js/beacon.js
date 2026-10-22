/* Guia interativo de Beacon */
(function () {
  "use strict";

  const D = window.MINEGUIA_BEACON;
  if (!D) return;

  const IMG = "assets/img/itens/";
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));
  const formatar = (numero) => numero.toLocaleString("pt-BR");

  let nivelAtual = 4;
  let materialAtual = "ferro";

  function pilhas(total) {
    const stacks = Math.floor(total / 64);
    const resto = total % 64;
    if (!stacks) return `${resto} itens`;
    return `${stacks} ${stacks === 1 ? "stack" : "stacks"}${resto ? ` + ${resto}` : ""}`;
  }

  function camadaVisual(camada, indice, total) {
    const celulas = Array.from({ length: camada.blocos }, () => "<i></i>").join("");
    return `<li style="--lado:${camada.lado}; --ordem:${indice}; --total:${total}">
      <div class="beacon-mini-grade" aria-hidden="true">${celulas}</div>
      <p><strong>${camada.lado}×${camada.lado}</strong><span>${camada.blocos} blocos</span></p>
    </li>`;
  }

  function atualizarCalculadora(nivel) {
    const dados = D.niveis[nivel - 1];
    const material = D.materiais.find((item) => item.id === materialAtual);
    nivelAtual = nivel;

    $$('[data-nivel]').forEach((botao) => {
      const ativo = Number(botao.dataset.nivel) === nivel;
      botao.classList.toggle("is-ativo", ativo);
      botao.setAttribute("aria-pressed", String(ativo));
    });

    const visual = $("#beacon-piramide-visual");
    visual.style.setProperty("--material", material.cor);
    visual.innerHTML = `<div class="beacon-feixe" aria-hidden="true"></div>
      <img class="beacon-topo-icone" src="${IMG}beacon.png" alt="Beacon">
      <ol>${dados.camadas.slice().reverse().map((camada, i) => camadaVisual(camada, i, dados.camadas.length)).join("")}</ol>`;

    $("#beacon-nivel-numero").textContent = dados.nivel;
    $("#beacon-total-blocos").textContent = formatar(dados.blocos);
    $("#beacon-total-itens").textContent = formatar(dados.itens);
    $("#beacon-total-pilhas").textContent = pilhas(dados.itens);
    $("#beacon-alcance").textContent = `${dados.alcance} blocos`;
    $("#beacon-duracao").textContent = `${dados.duracao} segundos`;
    $("#beacon-resumo").textContent = dados.resumo;
    $("#beacon-desbloqueia").innerHTML = dados.desbloqueia.map((item) => `<li>${item}</li>`).join("");
    atualizarMateriais();
    atualizarPoderes();
  }

  function atualizarMateriais() {
    const nivel = D.niveis[nivelAtual - 1];
    $("#lista-materiais").innerHTML = D.materiais
      .map((material) => {
        const ativo = material.id === materialAtual;
        const extraNetherite = material.id === "netherite"
          ? `<p class="material-extra"><b>Do zero:</b> ${formatar(nivel.itens * 4)} fragmentos de netherite + ${formatar(nivel.itens * 4)} barras de ouro.</p>`
          : "";
        return `<article class="material-card${ativo ? " is-ativo" : ""}" style="--material:${material.cor}">
          <button type="button" data-material="${material.id}" aria-pressed="${ativo}">
            <span class="material-icone"><img src="${IMG}${material.icone}" alt=""></span>
            <span><small>${material.recomendacao}</small><strong>${material.nome}</strong></span>
          </button>
          <div class="material-corpo">
            <p>${material.obter}</p>
            <div class="material-custo">
              <img src="${IMG}${material.item}" alt="">
              <p><strong>${formatar(nivel.itens)}</strong> ${material.itemNome}<span>${pilhas(nivel.itens)} para o nível ${nivelAtual}</span></p>
            </div>
            ${extraNetherite}
            <p class="material-dica">${material.dica}</p>
          </div>
        </article>`;
      })
      .join("");
  }

  function atualizarPoderes() {
    $$('[data-poder]').forEach((card) => {
      const poder = D.poderes.find((item) => item.id === card.dataset.poder);
      const liberado = nivelAtual >= poder.nivel;
      card.classList.toggle("is-bloqueado", !liberado);
      const status = $(".poder-status", card);
      status.textContent = liberado ? `Disponível no nível ${nivelAtual}` : `Pede nível ${poder.nivel}`;
    });
  }

  function montarPoderes() {
    $("#lista-poderes").innerHTML = D.poderes
      .map((poder) => `<article class="poder-card" data-poder="${poder.id}" style="--poder:${poder.cor}">
        <header><span class="poder-icone"><img src="${IMG}${poder.icone}" alt=""></span><div><span class="poder-status"></span><h3>${poder.nome}</h3></div></header>
        <p>${poder.faz}</p>
        <dl><div><dt>Melhor uso</dt><dd>${poder.melhor}</dd></div><div><dt>No nível 4</dt><dd>${poder.ii}</dd></div></dl>
      </article>`)
      .join("");
  }

  document.addEventListener("click", (evento) => {
    const nivel = evento.target.closest("[data-nivel]");
    if (nivel) atualizarCalculadora(Number(nivel.dataset.nivel));

    const material = evento.target.closest("[data-material]");
    if (material) {
      materialAtual = material.dataset.material;
      atualizarCalculadora(nivelAtual);
    }
  });

  montarPoderes();
  atualizarCalculadora(4);
})();
