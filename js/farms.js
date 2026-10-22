(function () {
  "use strict";

  const farms = window.MINEGUIA_FARMS || [];
  const IMG = "assets/img/itens/";
  const catalogo = document.querySelector("#farms-lista");
  const busca = document.querySelector("#farms-busca");
  const dimensao = document.querySelector("#farms-dimensao");
  const contador = document.querySelector("#farms-contador");
  const vazio = document.querySelector("#farms-vazio");
  let categoria = "todas";

  const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const rotulos = { superficie: "Superfície", nether: "Nether", end: "The End" };

  function card(farm) {
    const itens = farm.produz.map((item) => `<li>${item}</li>`).join("");
    const requisitos = farm.requisitos.map((item) => `<li>${item}</li>`).join("");
    return `<article class="farm-card" data-farm="${farm.id}">
      <header class="farm-card__cabeca">
        <span class="farm-card__icone"><img src="${IMG}${farm.icone}" alt=""></span>
        <div><p>${rotulos[farm.dimensao]} · prioridade ${String(farm.prioridade).padStart(2, "0")}</p><h3>${farm.nome}</h3></div>
      </header>
      <div class="farm-card__selos"><span>${farm.dificuldade}</span><span>${farm.automacao}</span><span class="farm-card__versao">Java 26.3</span></div>
      <p class="farm-card__serve">${farm.serve}</p>
      <div class="farm-card__bloco"><h4>Como funciona</h4><p>${farm.funciona}</p></div>
      <div class="farm-card__grade">
        <div><h4>Produz</h4><ul class="farm-produtos">${itens}</ul></div>
        <div><h4>Você vai precisar</h4><ul class="farm-requisitos">${requisitos}</ul></div>
      </div>
      <p class="farm-card__edicao"><strong>Compatibilidade:</strong> Java Edition 26.3 — não substitua por um projeto de Bedrock.</p>
      <footer>
        <a class="farm-link farm-link--guia" href="${farm.guia}" target="_blank" rel="noopener noreferrer">Mecânica e guia <span aria-hidden="true">↗</span></a>
        <a class="farm-link" href="${farm.video}" target="_blank" rel="noopener noreferrer">Vídeos 26.3 <span aria-hidden="true">▶</span></a>
      </footer>
    </article>`;
  }

  function filtrar() {
    const termo = normalizar(busca.value.trim());
    const mundo = dimensao.value;
    const resultado = farms.filter((farm) => {
      const texto = normalizar([farm.nome, farm.serve, farm.produz.join(" "), farm.funciona].join(" "));
      return (!termo || texto.includes(termo)) &&
        (categoria === "todas" || farm.categoria === categoria) &&
        (mundo === "todas" || farm.dimensao === mundo);
    });

    catalogo.innerHTML = resultado.map(card).join("");
    contador.textContent = `${resultado.length} ${resultado.length === 1 ? "farm encontrada" : "farms encontradas"}`;
    vazio.hidden = resultado.length > 0;
  }

  document.querySelectorAll("[data-filtro-farm]").forEach((botao) => {
    botao.addEventListener("click", () => {
      categoria = botao.dataset.filtroFarm;
      document.querySelectorAll("[data-filtro-farm]").forEach((item) => {
        const ativo = item === botao;
        item.classList.toggle("is-ativo", ativo);
        item.setAttribute("aria-pressed", String(ativo));
      });
      filtrar();
    });
  });

  busca.addEventListener("input", filtrar);
  dimensao.addEventListener("change", filtrar);
  filtrar();
})();
