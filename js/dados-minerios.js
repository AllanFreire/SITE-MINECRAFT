/* =============================================================
   Dados do Guia de Minérios
   -------------------------------------------------------------
   Tudo que aparece na página (cards, calculadora e receitas) sai
   daqui. Quer mudar um texto ou corrigir um número? É só editar
   este arquivo.

   Números da Java Edition (no Bedrock a durabilidade é +1).
   Fonte: Minecraft Wiki — https://minecraft.wiki
   ============================================================= */
window.MINEGUIA_DADOS = {
  /* Peças que dá para fabricar com cada material.
     custo    = quantos itens do material a peça gasta
     gravetos = quantos gravetos (só ferramentas)
     padrao   = desenho na bancada 3x3, linha por linha
                M = material · G = graveto · . = vazio */
  pecas: [
    { id: "helmet", nome: "Capacete", tipo: "armadura", custo: 5, gravetos: 0, padrao: ["MMM", "M.M", "..."], equipado: "Quando na cabeça:" },
    { id: "chestplate", nome: "Peitoral", tipo: "armadura", custo: 8, gravetos: 0, padrao: ["M.M", "MMM", "MMM"], equipado: "Quando no corpo:" },
    { id: "leggings", nome: "Calças", tipo: "armadura", custo: 7, gravetos: 0, padrao: ["MMM", "M.M", "M.M"], equipado: "Quando nas pernas:" },
    { id: "boots", nome: "Botas", tipo: "armadura", custo: 4, gravetos: 0, padrao: ["...", "M.M", "M.M"], equipado: "Quando nos pés:" },
    { id: "sword", nome: "Espada", tipo: "ferramenta", custo: 2, gravetos: 1, padrao: [".M.", ".M.", ".G."] },
    { id: "pickaxe", nome: "Picareta", tipo: "ferramenta", custo: 3, gravetos: 2, padrao: ["MMM", ".G.", ".G."] },
    { id: "axe", nome: "Machado", tipo: "ferramenta", custo: 3, gravetos: 2, padrao: ["MM.", "MG.", ".G."] },
    { id: "shovel", nome: "Pá", tipo: "ferramenta", custo: 1, gravetos: 2, padrao: [".M.", ".G.", ".G."] },
    { id: "hoe", nome: "Enxada", tipo: "ferramenta", custo: 2, gravetos: 2, padrao: ["MM.", ".G.", ".G."] },
    { id: "spear", nome: "Lança", tipo: "ferramenta", custo: 1, gravetos: 2, padrao: ["..M", ".G.", "G.."], nova: true },
  ],

  /* Materiais, do mais fraco ao mais forte.
     prefixo  = começo do nome das imagens (ex.: golden_helmet.png)
     drop     = quantos itens cada minério dá sem Fortuna [mín, máx]
     protecao / durArmadura = capacete, peitoral, calças, botas */
  materiais: [
    {
      id: "cobre",
      prefixo: "copper",
      nome: "Cobre",
      cor: "#e3743f",
      textura: "tx-pedra",
      profundidade: "Y 48",
      apelido: "O novato da turma",
      descricao:
        "Chegou na atualização The Copper Age (Java 1.21.9). É melhor que couro e pedra, mas ainda perde para o ferro. Ótimo para quem acabou de sair da Idade da Pedra.",
      material: { id: "copper_ingot", sing: "barra de cobre", plur: "barras de cobre" },
      bruto: { id: "raw_copper", sing: "cobre bruto", plur: "cobres brutos" },
      minerio: { id: "copper_ore", deep: "deepslate_copper_ore", sing: "minério de cobre", plur: "minérios de cobre" },
      drop: [2, 5],
      picareta: { id: "stone_pickaxe", texto: "Pedra ou melhor" },
      onde: "Melhor altura: Y 48 (aparece de Y -16 até Y 112). As cavernas de espeleotemas são lotadas de cobre!",
      protecao: [2, 4, 3, 2],
      durArmadura: [121, 176, 165, 143],
      durFerramenta: 190,
      danoEspada: 5,
      dica: "Cada minério de cobre dá de 2 a 5 cobres brutos, então você quebra bem menos blocos do que o número de barras que precisa.",
      conquistas: { armadura: "Laranja é o novo preto", ferramentas: "Kit do novato" },
    },
    {
      id: "ferro",
      prefixo: "iron",
      nome: "Ferro",
      cor: "#d8d8d8",
      textura: "tx-pedra",
      profundidade: "Y 16",
      apelido: "O arroz com feijão",
      descricao:
        "Barato, fácil de achar e resolve 90% dos problemas. A armadura de ferro é o primeiro grande salto de proteção, e a picareta de ferro libera ouro e diamante.",
      material: { id: "iron_ingot", sing: "barra de ferro", plur: "barras de ferro" },
      bruto: { id: "raw_iron", sing: "ferro bruto", plur: "ferros brutos" },
      minerio: { id: "iron_ore", deep: "deepslate_iron_ore", sing: "minério de ferro", plur: "minérios de ferro" },
      drop: [1, 1],
      picareta: { id: "stone_pickaxe", texto: "Pedra (ou cobre) ou melhor" },
      onde: "Melhor altura: Y 16 nas cavernas, ou Y 232 no topo das montanhas, onde aparece aos montes.",
      protecao: [2, 6, 5, 2],
      durArmadura: [165, 240, 225, 195],
      durFerramenta: 250,
      danoEspada: 6,
      dica: "Ferro serve pra quase tudo: balde, escudo, trilhos, bigorna, funil... Sempre guarde um estoque no baú.",
      conquistas: { armadura: "Vestido de ferro", ferramentas: "Hora do equipamento" },
    },
    {
      id: "ouro",
      prefixo: "golden",
      nome: "Ouro",
      cor: "#fad64a",
      textura: "tx-pedra",
      profundidade: "Y -16",
      apelido: "Lindo, rápido e... frágil",
      descricao:
        "É o desvio brilhante da trilha: a picareta de ouro é a mais RÁPIDA do jogo, mas quebra com 32 usos. A armadura protege pouco, mas é a que melhor aceita encantamentos.",
      material: { id: "gold_ingot", sing: "barra de ouro", plur: "barras de ouro" },
      bruto: { id: "raw_gold", sing: "ouro bruto", plur: "ouros brutos" },
      minerio: { id: "gold_ore", deep: "deepslate_gold_ore", sing: "minério de ouro", plur: "minérios de ouro" },
      drop: [1, 1],
      picareta: { id: "iron_pickaxe", texto: "Ferro ou melhor" },
      onde: "Melhor altura: Y -16. Nas Badlands (mesa) o ouro aparece em qualquer altura entre Y 32 e Y 256.",
      protecao: [2, 5, 3, 1],
      durArmadura: [77, 112, 105, 91],
      durFerramenta: 32,
      danoEspada: 4,
      dica: "No Nether, use pelo menos uma peça de ouro: os Piglins não atacam quem está bem vestido. E guarde ouro — cada barra de netherite pede 4 barras de ouro!",
      conquistas: { armadura: "Amigo dos Piglins", ferramentas: "Rápido e frágil" },
    },
    {
      id: "diamante",
      prefixo: "diamond",
      nome: "Diamante",
      cor: "#4aedd9",
      textura: "tx-ardosia",
      profundidade: "Y -59",
      apelido: "DIAMANTES!",
      descricao:
        "O sonho de todo minerador. A armadura de diamante dá a proteção máxima (20 pontos) e a picareta de diamante minera obsidiana e detritos ancestrais — o caminho para a netherite.",
      material: { id: "diamond", sing: "diamante", plur: "diamantes" },
      bruto: null, // o minério já dá o diamante pronto, sem fornalha
      minerio: { id: "diamond_ore", deep: "deepslate_diamond_ore", sing: "minério de diamante", plur: "minérios de diamante" },
      drop: [1, 1],
      picareta: { id: "iron_pickaxe", texto: "Ferro ou melhor" },
      onde: "Melhor altura: Y -58 e Y -59, lá no fundo. Ele só aparece abaixo de Y 16.",
      protecao: [3, 8, 6, 3],
      resistencia: 2,
      durArmadura: [363, 528, 495, 429],
      durFerramenta: 1561,
      danoEspada: 7,
      dica: "Minere diamantes com Fortuna III: dá em média 2,2 diamantes por minério (até 4!). Toque Suave só pega o bloco, sem bônus.",
      conquistas: { armadura: "Cubra-me de diamantes", ferramentas: "Diamantes!" },
    },
    {
      id: "netherite",
      prefixo: "netherite",
      nome: "Netherite",
      cor: "#9b8a91",
      textura: "tx-netherrack",
      profundidade: "Nether · Y 16",
      apelido: "O chefão final",
      descricao:
        "O material mais forte do jogo. Mesma proteção do diamante, com mais resistência, mais durabilidade, menos repulsão e um bônus incrível: não queima na lava!",
      material: { id: "netherite_ingot", sing: "barra de netherite", plur: "barras de netherite" },
      bruto: { id: "ancient_debris", sing: "detrito ancestral", plur: "detritos ancestrais" },
      minerio: { id: "ancient_debris", deep: null, sing: "detrito ancestral", plur: "detritos ancestrais" },
      drop: [1, 1],
      picareta: { id: "diamond_pickaxe", texto: "Diamante ou melhor" },
      onde: "No Nether, entre Y 8 e Y 24 (melhor: Y 16). Eles quase nunca aparecem encostados no ar: ficam escondidos dentro da pedra.",
      protecao: [3, 8, 6, 3],
      resistencia: 3,
      repulsao: 1,
      durArmadura: [407, 592, 555, 481],
      durFerramenta: 2031,
      danoEspada: 8,
      upgrade: true, // cada peça = peça de diamante + 1 barra de netherite + 1 molde de melhoria
      dica: "Detritos ancestrais aguentam explosões. Muita gente abre túneis com TNT (ou camas, que explodem no Nether) para achar vários de uma vez — só não fique perto da explosão!",
      conquistas: { armadura: "Cubra-me de detritos", ferramentas: "Arsenal supremo" },
    },
  ],

  /* Como uma barra de netherite é feita */
  netherite: {
    detritosPorBarra: 4, // 4 detritos ancestrais → 4 fragmentos de netherite
    ouroPorBarra: 4, // + 4 barras de ouro
    diamantesPorCopiaDeMolde: 7, // 7 diamantes + 1 netherrack + 1 molde = 2 moldes
  },

  /* Nomes dos recursos que aparecem no resultado da calculadora */
  recursos: {
    copper_ingot: ["barra de cobre", "barras de cobre"],
    iron_ingot: ["barra de ferro", "barras de ferro"],
    gold_ingot: ["barra de ouro", "barras de ouro"],
    diamond: ["diamante", "diamantes"],
    ancient_debris: ["detrito ancestral", "detritos ancestrais"],
    netherrack: ["netherrack", "netherrack"],
    stick: ["graveto", "gravetos"],
  },
};
