/* Dados do guia de Beacon — Java Edition */
window.MINEGUIA_BEACON = {
  niveis: [
    {
      nivel: 1,
      blocos: 9,
      itens: 81,
      alcance: 20,
      duracao: 11,
      camadas: [{ lado: 3, blocos: 9 }],
      desbloqueia: ["Velocidade I", "Pressa I"],
      resumo: "A menor base que já acende o feixe e libera os dois primeiros poderes."
    },
    {
      nivel: 2,
      blocos: 34,
      itens: 306,
      alcance: 30,
      duracao: 13,
      camadas: [
        { lado: 5, blocos: 25 },
        { lado: 3, blocos: 9 }
      ],
      desbloqueia: ["Resistência I", "Superpulo I"],
      resumo: "Aumenta o alcance e abre a segunda fileira de benefícios."
    },
    {
      nivel: 3,
      blocos: 83,
      itens: 747,
      alcance: 40,
      duracao: 15,
      camadas: [
        { lado: 7, blocos: 49 },
        { lado: 5, blocos: 25 },
        { lado: 3, blocos: 9 }
      ],
      desbloqueia: ["Força I"],
      resumo: "Libera Força e cobre uma área grande para bases e arenas."
    },
    {
      nivel: 4,
      blocos: 164,
      itens: 1476,
      alcance: 50,
      duracao: 17,
      camadas: [
        { lado: 9, blocos: 81 },
        { lado: 7, blocos: 49 },
        { lado: 5, blocos: 25 },
        { lado: 3, blocos: 9 }
      ],
      desbloqueia: ["Regeneração I", "Poder primário II"],
      resumo: "A pirâmide completa: alcance máximo e a fileira secundária."
    }
  ],

  materiais: [
    {
      id: "ferro",
      nome: "Bloco de ferro",
      icone: "iron_block.png",
      item: "iron_ingot.png",
      itemNome: "barras de ferro",
      cor: "#9aa3aa",
      recomendacao: "Melhor custo-benefício",
      obter: "Minere ferro, funda o ferro bruto e compacte 9 barras por bloco. Uma farm de golens torna a pirâmide renovável.",
      dica: "É o material mais comum para um Beacon de sobrevivência."
    },
    {
      id: "ouro",
      nome: "Bloco de ouro",
      icone: "gold_block.png",
      item: "gold_ingot.png",
      itemNome: "barras de ouro",
      cor: "#e7b416",
      recomendacao: "Bom com farm de ouro",
      obter: "Funda ouro bruto, aproveite o minério do Nether ou converta pepitas de uma farm de piglins-zumbificados.",
      dica: "Funciona exatamente igual ao ferro; use se você já produz ouro em massa."
    },
    {
      id: "esmeralda",
      nome: "Bloco de esmeralda",
      icone: "emerald_block.png",
      item: "emerald.png",
      itemNome: "esmeraldas",
      cor: "#24a35a",
      recomendacao: "Ótimo com aldeões",
      obter: "Faça trocas lucrativas com aldeões, participe de invasões ou minere nos biomas de montanha.",
      dica: "Trading halls transformam comida, gravetos e papel numa base completa."
    },
    {
      id: "diamante",
      nome: "Bloco de diamante",
      icone: "diamond_block.png",
      item: "diamond.png",
      itemNome: "diamantes",
      cor: "#35d5d0",
      recomendacao: "Luxo, sem bônus extra",
      obter: "Minere abaixo de Y 16 — de preferência perto de Y -58 — e use Fortuna III para multiplicar os drops.",
      dica: "Diamante não aumenta alcance nem força. Misture com materiais baratos se quiser só o visual."
    },
    {
      id: "netherite",
      nome: "Bloco de netherite",
      icone: "netherite_ingot.png",
      item: "netherite_ingot.png",
      itemNome: "barras de netherite",
      cor: "#51464a",
      recomendacao: "O mais caro possível",
      obter: "Cada barra pede 4 fragmentos de netherite e 4 barras de ouro; cada bloco consome 9 barras.",
      dica: "É resistente a explosões, mas não deixa o Beacon melhor. Use apenas por desafio ou decoração."
    }
  ],

  poderes: [
    {
      id: "velocidade",
      nome: "Velocidade",
      icone: "sugar.png",
      nivel: 1,
      cor: "#5ab7ff",
      faz: "Aumenta a velocidade ao caminhar e correr.",
      melhor: "Estradas, corredores, cidades e grandes bases.",
      ii: "Velocidade II fica disponível com uma pirâmide de nível 4."
    },
    {
      id: "pressa",
      nome: "Pressa",
      icone: "diamond_pickaxe.png",
      nivel: 1,
      cor: "#ffd45a",
      faz: "Acelera a mineração e a velocidade de ataque.",
      melhor: "Escavar áreas enormes; Pressa II com Eficiência V permite mineração instantânea de pedra.",
      ii: "Pressa II fica disponível com uma pirâmide de nível 4."
    },
    {
      id: "resistencia",
      nome: "Resistência",
      icone: "iron_chestplate.png",
      nivel: 2,
      cor: "#bdc5ca",
      faz: "Reduz o dano recebido de quase todas as fontes.",
      melhor: "Bases perigosas, farms, invasões e lutas prolongadas.",
      ii: "Resistência II fica disponível com uma pirâmide de nível 4."
    },
    {
      id: "superpulo",
      nome: "Superpulo",
      icone: "rabbit_foot.png",
      nivel: 2,
      cor: "#77e7c3",
      faz: "Aumenta a altura dos pulos e reduz um pouco o dano de queda.",
      melhor: "Construções verticais, terrenos irregulares e parkour.",
      ii: "Superpulo II fica disponível com uma pirâmide de nível 4."
    },
    {
      id: "forca",
      nome: "Força",
      icone: "diamond_sword.png",
      nivel: 3,
      cor: "#ff675f",
      faz: "Aumenta o dano dos ataques corpo a corpo.",
      melhor: "Farms de mobs, arenas e defesa da base.",
      ii: "Força II fica disponível com uma pirâmide de nível 4."
    },
    {
      id: "regeneracao",
      nome: "Regeneração",
      icone: "potion_regeneration.png",
      nivel: 4,
      cor: "#ff6ec7",
      faz: "Recupera vida gradualmente enquanto você está na área.",
      melhor: "Trabalhos longos, farms perigosas e recuperação entre combates.",
      ii: "É sempre Regeneração I e ocupa a escolha secundária do nível 4."
    }
  ]
};
