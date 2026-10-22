/* Catálogo curado de farms — mantenha os links por edição e versão. */
window.MINEGUIA_FARMS = [
  {
    id: "ferro", nome: "Farm de ferro", icone: "iron_ingot.png", categoria: "essenciais", dimensao: "superficie",
    dificuldade: "Média", automacao: "Automática", edicao: "Java e Bedrock (projetos diferentes)", prioridade: 1,
    produz: ["Ferro", "Papoulas"], serve: "Abastece funis, trilhos, baldes, bigornas e quase toda automação da base.",
    funciona: "Aldeões formam uma vila controlada e fazem golems nascerem numa plataforma; água leva os golems à câmara de coleta.",
    requisitos: ["Aldeões", "Camas e estações", "Água e lava", "Funis e baús"],
    guia: "https://minecraft.wiki/w/Tutorial%3AIron_Golem_farming", video: "https://www.youtube.com/results?search_query=farm+de+ferro+minecraft+java+26.3+passo+a+passo"
  },
  {
    id: "aldeoes", nome: "Criador de aldeões", icone: "bread.png", categoria: "essenciais", dimensao: "superficie",
    dificuldade: "Fácil", automacao: "Automática", edicao: "Java e Bedrock", prioridade: 2,
    produz: ["Aldeões"], serve: "Fornece aldeões para ferro, plantações, trocas e reposição do trading hall.",
    funciona: "Um fazendeiro colhe comida e alimenta o casal; camas livres mantêm a reprodução e os bebês são separados por alçapões ou água.",
    requisitos: ["2 aldeões", "Camas livres", "Cenouras ou pão", "Composteira"],
    guia: "https://minecraft.wiki/w/Tutorial%3AVillager_farming", video: "https://www.youtube.com/results?search_query=breeder+aldeoes+minecraft+26.3+passo+a+passo"
  },
  {
    id: "trocas", nome: "Trading hall", icone: "emerald.png", categoria: "essenciais", dimensao: "superficie",
    dificuldade: "Média", automacao: "Semiautomática", edicao: "Java e Bedrock", prioridade: 3,
    produz: ["Esmeraldas", "Livros", "Equipamentos"], serve: "Concentra trocas úteis, encantamentos e equipamentos renováveis num só lugar.",
    funciona: "Aldeões ficam em células ligadas às estações corretas; cada troca desejada é travada antes de ampliar o salão.",
    requisitos: ["Criador de aldeões", "Estações de trabalho", "Transporte", "Proteção contra zumbis"],
    guia: "https://minecraft.wiki/w/Tutorial%3AVillager_trading_hall", video: "https://www.youtube.com/results?search_query=trading+hall+minecraft+26.3+portugues"
  },
  {
    id: "plantacao", nome: "Plantação com aldeão", icone: "carrot.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Fácil", automacao: "Automática", edicao: "Java e Bedrock (coleta varia)", prioridade: 4,
    produz: ["Cenoura", "Batata", "Trigo", "Beterraba"], serve: "Gera comida, matéria-prima e produtos fáceis de trocar por esmeraldas.",
    funciona: "O fazendeiro replanta e colhe sozinho; outro aldeão ou um sistema de funis intercepta a comida compartilhada.",
    requisitos: ["Aldeão fazendeiro", "Composteira", "Terra arada", "Coleta por funil"],
    guia: "https://minecraft.wiki/w/Tutorial%3ACrop_farming", video: "https://www.youtube.com/results?search_query=farm+automatica+cenoura+aldeao+minecraft+26.3"
  },
  {
    id: "cana", nome: "Farm de cana-de-açúcar", icone: "sugar_cane.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Fácil", automacao: "Automática", edicao: "Java e Bedrock", prioridade: 5,
    produz: ["Cana", "Papel", "Foguetes"], serve: "Mantém livros, mapas, trocas de bibliotecário e foguetes para Élitros.",
    funciona: "Observadores detectam o crescimento, pistões quebram a segunda camada e água ou carrinho com funil recolhe tudo.",
    requisitos: ["Cana e água", "Pistões", "Observadores", "Redstone"],
    guia: "https://minecraft.wiki/w/Tutorial%3ASugar_cane_farming", video: "https://www.youtube.com/results?search_query=farm+cana+automatica+minecraft+26.3+observer"
  },
  {
    id: "bambu", nome: "Farm de bambu", icone: "bamboo.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Fácil", automacao: "Automática", edicao: "Java e Bedrock", prioridade: 6,
    produz: ["Bambu", "Combustível", "Madeira de bambu"], serve: "Alimenta fornalhas e fornece blocos, tábuas e andaimes em grande escala.",
    funciona: "Usa o mesmo núcleo de observador e pistão da cana, mas cresce mais rápido e não precisa ficar ao lado da água.",
    requisitos: ["Bambu", "Pistões", "Observadores", "Carrinho com funil"],
    guia: "https://minecraft.wiki/w/Tutorial%3ABamboo_farming", video: "https://www.youtube.com/results?search_query=farm+bambu+automatica+minecraft+26.3"
  },
  {
    id: "la", nome: "Farm de lã", icone: "white_wool.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Fácil", automacao: "Automática", edicao: "Java e Bedrock", prioridade: 7,
    produz: ["Lã de qualquer cor"], serve: "Entrega lã para camas, decoração, redstone, trocas e grandes construções.",
    funciona: "Um observador percebe a grama sendo comida e aciona um ejetor com tesoura; ovelhas voltam a produzir lã ao comer.",
    requisitos: ["Ovelha", "Bloco de grama", "Ejetor e tesouras", "Observador"],
    guia: "https://minecraft.wiki/w/Tutorial%3AWool_farming", video: "https://www.youtube.com/results?search_query=farm+de+la+automatica+minecraft+26.3"
  },
  {
    id: "mel", nome: "Farm de mel", icone: "honeycomb.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Média", automacao: "Automática", edicao: "Java e Bedrock (coleta varia)", prioridade: 8,
    produz: ["Favos", "Frascos de mel"], serve: "Cria colmeias, velas, blocos de mel e cera para preservar cobre.",
    funciona: "Um comparador mede a colmeia cheia e ativa um ejetor com tesoura ou frascos; funis fazem a coleta.",
    requisitos: ["Abelhas e colmeias", "Flores", "Comparador", "Ejetor abastecido"],
    guia: "https://minecraft.wiki/w/Tutorial%3AHoney_farming", video: "https://www.youtube.com/results?search_query=farm+de+mel+automatica+minecraft+26.3"
  },
  {
    id: "lava", nome: "Farm de lava", icone: "lava_bucket.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Fácil", automacao: "Semiautomática", edicao: "Java e Bedrock", prioridade: 9,
    produz: ["Baldes de lava"], serve: "Fornece combustível renovável de longa duração para fornalhas e superfornalhas.",
    funciona: "Lava sobre um bloco com espeleotema pontiagudo pinga lentamente para um caldeirão, que o jogador esvazia com baldes.",
    requisitos: ["Lava-fonte", "Espeleotema", "Caldeirões", "Baldes"],
    guia: "https://minecraft.wiki/w/Tutorial%3ALava_farming", video: "https://www.youtube.com/results?search_query=farm+de+lava+infinita+minecraft+26.3"
  },
  {
    id: "madeira", nome: "Farm de árvores", icone: "oak_log.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Difícil", automacao: "Semiautomática", edicao: "Principalmente Java", prioridade: 10,
    produz: ["Troncos", "Mudas", "Maçãs", "Gravetos"], serve: "Produz madeira em ritmo industrial para baús, funis, construções e combustível.",
    funciona: "Farinha de osso cresce a muda, pistões empurram o tronco e uma câmara de explosão ou corte manual libera os blocos.",
    requisitos: ["Farinha de osso", "Pistões", "Mudas", "Projeto compatível com a edição"],
    guia: "https://minecraft.wiki/w/Tutorial%3ATree_farming", video: "https://www.youtube.com/results?search_query=tree+farm+minecraft+java+26.3+tutorial"
  },
  {
    id: "cactos", nome: "Farm de cactos", icone: "cactus.png", categoria: "recursos", dimensao: "superficie",
    dificuldade: "Fácil", automacao: "Automática", edicao: "Java e Bedrock", prioridade: 11,
    produz: ["Cactos", "Corante verde"], serve: "Gera corante, composto e uma entrada constante para fornalhas de experiência.",
    funciona: "Cercas ou painéis quebram cada novo bloco de cacto assim que cresce; água leva os itens aos funis.",
    requisitos: ["Areia", "Cactos", "Cercas ou painéis", "Água e funis"],
    guia: "https://minecraft.wiki/w/Tutorial%3ACactus_farming", video: "https://www.youtube.com/results?search_query=farm+cacto+automatica+minecraft+26.3"
  },
  {
    id: "mobs", nome: "Torre de mobs", icone: "bone.png", categoria: "mobs", dimensao: "superficie",
    dificuldade: "Média", automacao: "AFK", edicao: "Java e Bedrock (projetos diferentes)", prioridade: 12,
    produz: ["Ossos", "Flechas", "Linha", "Pólvora"], serve: "É a farm coringa do início: entrega vários drops hostis e pode gerar experiência.",
    funciona: "Plataformas escuras concentram spawns; água e alçapões conduzem os mobs para queda ou câmara de dano.",
    requisitos: ["Muitos blocos", "Água", "Alçapões", "Ponto AFK correto"],
    guia: "https://minecraft.wiki/w/Tutorial%3AMob_farm", video: "https://www.youtube.com/results?search_query=mob+farm+minecraft+26.3+passo+a+passo"
  },
  {
    id: "creeper", nome: "Farm de creeper", icone: "gunpowder.png", categoria: "mobs", dimensao: "superficie",
    dificuldade: "Média", automacao: "AFK", edicao: "Java; use projeto próprio no Bedrock", prioridade: 13,
    produz: ["Pólvora"], serve: "Mantém foguetes para Élitros e TNT sem depender de caçadas noturnas.",
    funciona: "Alçapões reduzem a altura de spawn e gatos assustam creepers até a coleta; o entorno precisa ser protegido contra spawns.",
    requisitos: ["Gatos", "Alçapões", "Plataformas escuras", "Coleta e ponto AFK"],
    guia: "https://minecraft.wiki/w/Tutorial%3ACreeper_farming", video: "https://www.youtube.com/results?search_query=creeper+farm+minecraft+java+26.3+tutorial"
  },
  {
    id: "slime", nome: "Farm de slime", icone: "slime_ball.png", categoria: "mobs", dimensao: "superficie",
    dificuldade: "Média", automacao: "AFK", edicao: "Java e Bedrock (regras diferentes)", prioridade: 14,
    produz: ["Bolas de slime"], serve: "Libera pistões grudentos, blocos de slime, cabos e máquinas voadoras.",
    funciona: "Em slime chunk ou pântano, golems atraem slimes para blocos de magma, fogueiras ou rosas do Wither.",
    requisitos: ["Slime chunk ou pântano", "Golem de ferro", "Spawn-proof", "Câmara de dano"],
    guia: "https://minecraft.wiki/w/Tutorial%3ASlime_farming", video: "https://www.youtube.com/results?search_query=slime+farm+minecraft+26.3+tutorial"
  },
  {
    id: "bruxa", nome: "Farm de bruxa", icone: "redstone.png", categoria: "mobs", dimensao: "superficie",
    dificuldade: "Difícil", automacao: "AFK", edicao: "Java e Bedrock (projetos diferentes)", prioridade: 15,
    produz: ["Redstone", "Glowstone", "Pólvora", "Frascos"], serve: "Reúne ingredientes variados de redstone e poções num único projeto.",
    funciona: "Plataformas na área de uma cabana de pântano ou uma farm geral conduzem bruxas a uma morte rápida.",
    requisitos: ["Cabana de pântano", "Spawn-proof", "Plataformas", "Coleta"],
    guia: "https://minecraft.wiki/w/Tutorial%3AWitch_farming", video: "https://www.youtube.com/results?search_query=witch+farm+minecraft+26.3+tutorial"
  },
  {
    id: "raid", nome: "Farm de invasão", icone: "totem_of_undying.png", categoria: "endgame", dimensao: "superficie",
    dificuldade: "Muito difícil", automacao: "AFK", edicao: "Mudou na 1.21; confira a edição", prioridade: 16,
    produz: ["Totens", "Esmeraldas", "Redstone", "Pólvora"], serve: "Gera totens da imortalidade e grandes volumes de drops de illagers.",
    funciona: "Um efeito de Mau Presságio inicia a invasão em uma vila controlada; o sistema concentra as ondas numa câmara segura.",
    requisitos: ["Frasco ominoso", "Aldeão e cama", "Local isolado", "Projeto da versão atual"],
    guia: "https://minecraft.wiki/w/Tutorial%3ARaid_farming", video: "https://www.youtube.com/results?search_query=raid+farm+minecraft+26.3+java+tutorial"
  },
  {
    id: "ouro", nome: "Farm de ouro e XP", icone: "gold_ingot.png", categoria: "xp", dimensao: "nether",
    dificuldade: "Difícil", automacao: "AFK", edicao: "Java e Bedrock (projetos diferentes)", prioridade: 17,
    produz: ["Ouro", "Experiência", "Carne podre"], serve: "Entrega XP rápido, ouro para maçãs, trilhos, beacon e escambo com piglins.",
    funciona: "Piglins-zumbificados nascem em plataformas do Nether ou portais e são atraídos para uma câmara de queda e abate.",
    requisitos: ["Acesso ao teto ou portais", "Magma blocks", "Ovo de tartaruga", "Armazenamento"],
    guia: "https://minecraft.wiki/w/Tutorial%3AZombified_Piglin_farming", video: "https://www.youtube.com/results?search_query=gold+farm+minecraft+java+26.3+tutorial"
  },
  {
    id: "escambo", nome: "Escambo com piglins", icone: "gold_nugget.png", categoria: "endgame", dimensao: "nether",
    dificuldade: "Média", automacao: "Automática", edicao: "Java e Bedrock", prioridade: 18,
    produz: ["Quartzo", "Cascalho", "Pérolas", "Obsidiana"], serve: "Transforma o ouro excedente em muitos recursos difíceis de reunir manualmente.",
    funciona: "Um liberador entrega barras de ouro a piglins presos e funis separam os itens devolvidos.",
    requisitos: ["Piglins adultos", "Barras de ouro", "Liberador", "Filtro de itens"],
    guia: "https://minecraft.wiki/w/Tutorial%3ABartering_farm", video: "https://www.youtube.com/results?search_query=piglin+bartering+farm+minecraft+26.3+tutorial"
  },
  {
    id: "wither", nome: "Farm de esqueletos Wither", icone: "wither_skeleton_skull.png", categoria: "mobs", dimensao: "nether",
    dificuldade: "Muito difícil", automacao: "AFK", edicao: "Principalmente Java", prioridade: 19,
    produz: ["Crânios Wither", "Carvão", "Ossos"], serve: "Torna estrelas do Nether e novos Beacons renováveis em escala.",
    funciona: "Uma área válida da fortaleza é preparada para spawn; piglins ou golems atraem esqueletos até a câmara de abate.",
    requisitos: ["Fortaleza do Nether", "Encruzilhada válida", "Spawn-proof amplo", "Saque III"],
    guia: "https://minecraft.wiki/w/Tutorial%3AWither_skeleton_farming", video: "https://www.youtube.com/results?search_query=wither+skeleton+farm+minecraft+26.3+tutorial"
  },
  {
    id: "froglight", nome: "Farm de froglight", icone: "magma_cream.png", categoria: "endgame", dimensao: "nether",
    dificuldade: "Muito difícil", automacao: "AFK", edicao: "Java e Bedrock", prioridade: 20,
    produz: ["Froglights", "Creme de magma"], serve: "Fornece os três blocos de luz mais coloridos para megaconstruções.",
    funciona: "Cubos de magma pequenos são levados até sapos; cada variante de sapo produz uma cor diferente de froglight.",
    requisitos: ["Spawner de cubo ou delta", "Sapos transportados", "Separador de cubos", "Coleta"],
    guia: "https://minecraft.wiki/w/Tutorial%3AFroglight_farming", video: "https://www.youtube.com/results?search_query=froglight+farm+minecraft+26.3+tutorial"
  },
  {
    id: "enderman", nome: "Farm de enderman", icone: "ender_pearl.png", categoria: "xp", dimensao: "end",
    dificuldade: "Média", automacao: "AFK", edicao: "Java; Bedrock usa outro projeto", prioridade: 21,
    produz: ["Experiência", "Pérolas do End"], serve: "Leva do nível baixo ao encantamento muito rápido e mantém pérolas em estoque.",
    funciona: "Longe da ilha principal, um endermite atrai endermen para uma queda que os deixa com pouca vida.",
    requisitos: ["Acesso ao End", "Endermite nomeado", "Folhas ou água", "Plataforma segura"],
    guia: "https://minecraft.wiki/w/Tutorial%3AEnderman_farming", video: "https://www.youtube.com/results?search_query=enderman+xp+farm+minecraft+java+26.3+tutorial"
  },
  {
    id: "shulker", nome: "Farm de shulker", icone: "shulker_shell.png", categoria: "endgame", dimensao: "end",
    dificuldade: "Muito difícil", automacao: "Automática", edicao: "Java e Bedrock 1.19+ (projetos diferentes)", prioridade: 22,
    produz: ["Cascos de shulker"], serve: "Permite fabricar caixas de shulker renováveis para armazenamento em massa.",
    funciona: "Projéteis de shulker atingem outro shulker e podem duplicá-lo; o projeto separa o novo mob e coleta os cascos.",
    requisitos: ["Shulker vivo", "Transporte delicado", "Câmara de duplicação", "Backup de segurança"],
    guia: "https://minecraft.wiki/w/Tutorial%3AShulker_farming", video: "https://www.youtube.com/results?search_query=shulker+farm+minecraft+26.3+tutorial"
  },
  {
    id: "guardiao", nome: "Farm de guardião", icone: "prismarine_shard.png", categoria: "xp", dimensao: "superficie",
    dificuldade: "Muito difícil", automacao: "AFK", edicao: "Java e Bedrock (projetos diferentes)", prioridade: 23,
    produz: ["Prismarinho", "Cristais", "Peixe", "XP"], serve: "Entrega blocos marinhos e uma das fontes mais fortes de experiência do jogo.",
    funciona: "A área do monumento concentra guardiões e água, portais ou bolhas os encaminham à câmara de coleta.",
    requisitos: ["Monumento oceânico", "Respiração aquática", "Muita construção", "Armazenamento grande"],
    guia: "https://minecraft.wiki/w/Tutorial%3AGuardian_farming", video: "https://www.youtube.com/results?search_query=guardian+farm+no+drain+minecraft+26.3+tutorial"
  }
];
