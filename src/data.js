// Edite aqui seus dados. Tudo que aparece no portfólio vem deste arquivo.
// Textos no formato { pt: '...', en: '...' } são traduzidos pelo seletor PT/EN.

export const profile = {
  name: 'Gustavo Ribas Silestrino',
  age: 19,
  city: 'Salto, SP',
  status: { pt: 'Aberto a oportunidades', en: 'Open to opportunities' },
  role: { pt: 'Estudante de ADS · futuro dev back end', en: 'ADS student · future back end dev' },
  headline: {
    pt: 'Estudante de ADS no SENAI Sorocaba · Salto, SP',
    en: 'ADS student at SENAI Sorocaba · Salto, SP',
  },
  hello: { pt: 'Oi, eu sou o Gustavo', en: "Hi, I'm Gustavo" },
  school: 'ADS · SENAI Sorocaba',
  about: [
    {
      pt: 'Oi! Eu sou o Gustavo, tenho 19 anos e nasci em Salto, interior de São Paulo.',
      en: "Hi! I'm Gustavo, I'm 19 and I was born in Salto, in the countryside of São Paulo, Brazil.",
    },
    {
      pt: 'Curso Análise e Desenvolvimento de Sistemas no SENAI Sorocaba e hoje meu foco é aprender Java a fundo, entender como sistemas realmente funcionam por baixo dos panos: regras de negócio, APIs e banco de dados.',
      en: "I'm studying Systems Analysis and Development at SENAI Sorocaba, and right now my focus is learning Java in depth and understanding how systems really work under the hood: business rules, APIs and databases.",
    },
    {
      pt: 'Já tive contato com JavaScript, React e Tailwind CSS no front end, e isso me ajuda a entender os dois lados da aplicação. Mas o plano é claro: me especializar em back end.',
      en: "I've worked with JavaScript, React and Tailwind CSS on the front end, which helps me understand both sides of an application. But the plan is clear: specialize in back end.",
    },
    {
      pt: 'Gosto de aprender construindo. Cada projeto novo é uma chance de errar, corrigir e ficar melhor.',
      en: 'I like learning by building. Every new project is a chance to get it wrong, fix it and get better.',
    },
  ],
}

export const skills = [
  {
    group: { pt: 'Foco atual', en: 'Current focus' },
    items: [
      'Java',
      { pt: 'Orientação a Objetos', en: 'Object-oriented programming' },
      { pt: 'Banco de dados (SQL)', en: 'Databases (SQL)' },
    ],
  },
  { group: { pt: 'Front end', en: 'Front end' }, items: ['JavaScript', 'React', 'Tailwind CSS', 'HTML & CSS'] },
  {
    group: { pt: 'Próximos passos', en: 'Next steps' },
    items: ['Spring Boot', 'APIs REST', 'Git & GitHub', 'Docker'],
  },
]

export const projects = [
  {
    name: { pt: 'Este portfólio', en: 'This portfolio' },
    desc: {
      pt: 'Portfólio em formato de desktop, com janelas arrastáveis, terminal, paletas de cor e avatar animado. Feito com React, Tailwind e Framer Motion.',
      en: 'A desktop-style portfolio with draggable windows, a terminal, color palettes and an animated avatar. Built with React, Tailwind and Framer Motion.',
    },
    tags: ['React', 'Tailwind', 'Framer Motion'],
  },
  {
    name: { pt: 'Projeto em Java (em breve)', en: 'Java project (coming soon)' },
    desc: {
      pt: 'Espaço reservado para o meu primeiro projeto back end: uma API ou sistema com banco de dados.',
      en: 'Reserved for my first back end project: an API or a system backed by a database.',
    },
    tags: ['Java', 'SQL'],
  },
]

// Projeto em destaque (estudo de caso). Informações do repositório github.com/GustavoRibasSilestrino/finsight
// e do certificado de destaque do currículo.
export const featured = {
  name: 'Finsight',
  award: {
    pt: 'Top 3 da Mostra do SENAI · categoria Geral',
    en: 'Top 3 at the SENAI Showcase · General category',
  },
  awardShort: { pt: 'Top 3 da Mostra do SENAI', en: 'Top 3 at the SENAI Showcase' },
  tagline: { pt: 'Controle de finanças pessoais em um só lugar', en: 'Personal finance control in one place' },
  team: 'Coders',
  problem: {
    pt: 'Ajudar a pessoa a registrar e acompanhar a própria vida financeira em um só lugar, com alertas que evitam o gasto sem controle.',
    en: 'Help people record and track their own finances in one place, with alerts that prevent uncontrolled spending.',
  },
  features: [
    { pt: 'Carteiras com saldo total', en: 'Wallets with a total balance' },
    { pt: 'Receitas, despesas e transferências', en: 'Income, expenses and transfers' },
    { pt: 'Categorias com ícone e cor', en: 'Categories with icon and color' },
    { pt: 'Metas de poupança com progresso', en: 'Savings goals with progress' },
    { pt: 'Painel com gráficos e notificações', en: 'Dashboard with charts and notifications' },
    { pt: 'Relatórios por período', en: 'Reports by period' },
  ],
  stack: ['HTML5', 'CSS3', 'JavaScript', 'Java · Spring Boot', 'Supabase (PostgreSQL)', 'Vercel'],
  role: {
    pt: 'Integrante da equipe "Coders", no curso de ADS do SENAI Sorocaba.',
    en: 'Member of the "Coders" team, in the ADS course at SENAI Sorocaba.',
  },
  // Conte aqui o que VOCÊ fez no projeto (ex.: telas, banco de dados, regras de negócio). Vazio = não aparece.
  roleDetail: {
    pt: 'Contribuí com a documentação, o front end e, em menor parte, o back end.',
    en: 'I contributed to the documentation, the front end and, to a lesser extent, the back end.',
  },
  links: {
    demo: 'https://finsight-app-lyart.vercel.app',
    code: 'https://github.com/GustavoRibasSilestrino/finsight',
  },
}

export const timeline = [
  {
    when: { pt: 'Atual', en: 'Current' },
    title: { pt: 'Auxiliar de escrevente', en: 'Notary clerk assistant' },
    where: 'Tabelionato de Letras e Títulos de Sorocaba',
    text: {
      pt: 'Apoio à rotina do cartório: atendimento ao público, conferência e organização de documentos e suporte aos escreventes. Uma área fora da tecnologia, que me ensinou responsabilidade, atenção aos detalhes e a trabalhar com prazos e processos.',
      en: 'Supporting the daily routine of the notary office: serving the public, checking and organizing documents and assisting the clerks. A field outside technology that taught me responsibility, attention to detail and how to work with deadlines and processes.',
    },
  },
  {
    when: { pt: 'Cursando', en: 'Studying' },
    title: { pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development' },
    where: 'SENAI Sorocaba',
    text: {
      pt: 'Foco em lógica de programação, Java, banco de dados e desenvolvimento de software.',
      en: 'Focus on programming logic, Java, databases and software development.',
    },
  },
  {
    when: { pt: 'Autodidata', en: 'Self-taught' },
    title: { pt: 'Desenvolvimento web front end', en: 'Front end web development' },
    where: { pt: 'Estudos e projetos pessoais', en: 'Studies and personal projects' },
    text: {
      pt: 'JavaScript, React e Tailwind CSS aplicados em pequenos projetos.',
      en: 'JavaScript, React and Tailwind CSS applied in small projects.',
    },
  },
  {
    when: { pt: 'Próximo passo', en: 'Next step' },
    title: { pt: 'Primeira oportunidade na área', en: 'First opportunity in the field' },
    where: { pt: 'Estágio ou vaga júnior em back end', en: 'Back end internship or junior role' },
    text: {
      pt: 'Quero colocar em prática o que estudo, em um time onde eu possa aprender com quem já faz.',
      en: 'I want to put what I study into practice on a team where I can learn from people who already do this.',
    },
  },
]

export const habits = {
  intro: {
    pt: 'Não é uma lista de tecnologias. São hábitos que descrevem como eu aprendo e construo as coisas.',
    en: "Not a list of technologies. These are habits that describe how I learn and build things.",
  },
  items: [
    {
      title: { pt: 'Aprender construindo', en: 'Learn by building' },
      text: {
        pt: 'Leio a teoria, mas só considero que aprendi quando coloco em um projeto que roda.',
        en: "I read the theory, but I only count it as learned once it's in a project that runs.",
      },
    },
    {
      title: { pt: 'Back end como destino', en: 'Back end as the destination' },
      text: {
        pt: 'Uso o front end para dar contexto, mas o que me interessa é regra de negócio, API e banco de dados.',
        en: "I use the front end for context, but what interests me is business rules, APIs and databases.",
      },
    },
    {
      title: { pt: 'Simples antes de esperto', en: 'Simple before clever' },
      text: {
        pt: 'Prefiro um código claro que outra pessoa entende em um minuto a uma solução elegante que ninguém consegue manter.',
        en: "I'd rather write clear code someone understands in a minute than an elegant solution nobody can maintain.",
      },
    },
    {
      title: { pt: 'Errar, corrigir, anotar', en: 'Fail, fix, write it down' },
      text: {
        pt: 'Erro faz parte. Quando algo quebra, eu entendo o porquê e registro para não repetir.',
        en: "Mistakes are part of it. When something breaks, I work out why and write it down so it doesn't happen again.",
      },
    },
    {
      title: { pt: 'Constância', en: 'Consistency' },
      text: {
        pt: 'Um pouco todo dia vale mais do que uma maratona no fim de semana. A meta é um commit por dia.',
        en: 'A little every day beats a weekend marathon. The goal is one commit a day.',
      },
    },
  ],
}

export const volunteering = {
  text: {
    pt: 'Esta seção está sendo preparada. Aqui vão entrar as ações e projetos voluntários em que eu participar.',
    en: "This section is being prepared. Volunteer work and projects I take part in will show up here.",
  },
}

export const now = {
  updated: { pt: 'Atualizado em outubro de 2026', en: 'Updated October 2026' },
  items: [
    {
      label: { pt: 'Estudando', en: 'Studying' },
      text: { pt: 'Java e orientação a objetos no SENAI Sorocaba.', en: 'Java and object-oriented programming at SENAI Sorocaba.' },
    },
    {
      label: { pt: 'Construindo', en: 'Building' },
      text: { pt: 'Este portfólio, com React, Tailwind e Framer Motion.', en: 'This portfolio, with React, Tailwind and Framer Motion.' },
    },
    {
      label: { pt: 'Aprendendo', en: 'Learning' },
      text: { pt: 'SQL e modelagem de banco de dados.', en: 'SQL and database modeling.' },
    },
    {
      label: { pt: 'Próximo', en: 'Next' },
      text: { pt: 'Spring Boot e APIs REST.', en: 'Spring Boot and REST APIs.' },
    },
  ],
}

export const contact = {
  intro: {
    pt: 'Quer conversar, trocar ideia ou me chamar para um projeto? Fala comigo:',
    en: 'Want to chat, trade ideas or invite me to a project? Get in touch:',
  },
  email: 'gustavoribas.silestrino@gmail.com',
  github: 'https://github.com/GustavoRibasSilestrino',
  linkedin: 'https://www.linkedin.com/in/gustavo-r-silestrino-b112ba38b/',
}

// ---- Cards da tela ----

// Cidade usada no card de clima (dados reais do Open-Meteo, sem chave de API).
export const location = { city: 'São Paulo', lat: -23.55, lon: -46.63 }

// "Tempo de estrada": contador desde que você começou a programar/estudar.
// Preencha com a data real no formato 'AAAA-MM-DD' (ex.: '2024-02-01'). Vazio = o card fica oculto.
export const career = {
  since: '2024-02-01',
  sinceText: { pt: 'programando desde', en: 'coding since' },
}

// Playlist do card "Tocando agora". Coloque os .mp3 em public/musicas e liste aqui.
// Ex.: { title: 'Nome', artist: 'Artista', src: '/musicas/nome.mp3' }. Vazio = o card fica oculto.
export const music = {
  // Música do YouTube (player oficial incorporado). Para trocar, mude o id (o trecho depois de "v=" ou de "youtu.be/").
  youtube: { id: 'ZQb45qINuj8', title: 'Purifícame', artist: 'Jonathan Napoles' },
  playlist: [],
}

export const widgetText = {
  career: { pt: 'Tempo de estrada', en: 'Time on the road' },
  weather: { pt: `${location.city} agora`, en: `${location.city} now` },
  status: { pt: 'Necessidades', en: 'Needs' },
  github: { pt: 'Última atividade no GitHub', en: 'Latest GitHub activity' },
  music: { pt: 'Tocando agora', en: 'Now playing' },
  years: { pt: 'anos', en: 'years' },
  months: { pt: 'meses', en: 'months' },
  days: { pt: 'dias', en: 'days' },
  feels: { pt: 'sensação de', en: 'feels like' },
  hoodie: { pt: 'moletom', en: 'hoodie' },
  melting: { pt: 'derretendo', en: 'melting' },
  loading: { pt: 'Carregando...', en: 'Loading...' },
  weatherError: { pt: 'Não consegui buscar o clima agora.', en: "Couldn't fetch the weather right now." },
  githubError: { pt: 'Não consegui buscar a atividade agora.', en: "Couldn't fetch the activity right now." },
  githubEmpty: { pt: 'Sem atividade pública recente.', en: 'No recent public activity.' },
  pushed: { pt: 'Subiu {n} {commits} em', en: 'Pushed {n} {commits} to' },
  commit: { pt: 'commit', en: 'commit' },
  commits: { pt: 'commits', en: 'commits' },
}

// Frases do card de clima, por faixa de temperatura (°C): usa a primeira cujo limite é maior que a temperatura.
export const weatherQuips = [
  { max: 12, pt: 'Hora do moletom. O café agradece.', en: 'Hoodie weather. Your coffee approves.' },
  { max: 20, pt: 'Clima perfeito. Temperatura ideal pra codar.', en: 'Perfect weather. Ideal temperature to code.' },
  { max: 28, pt: 'Clima agradável. Dá pra focar no código.', en: 'Pleasant weather. Easy to focus on the code.' },
  { max: 34, pt: 'Tá quente. Água por perto e ventilador ligado.', en: "It's hot. Keep water close and the fan on." },
  { max: Infinity, pt: 'Calor demais. Até o processador pede arrego.', en: 'Way too hot. Even the CPU is begging for mercy.' },
]

// Currículo para download. Coloque o PDF em public/ e informe o caminho em "url" (ex.: '/curriculo.pdf').
// Enquanto "url" estiver vazio, o item "Baixar currículo" não aparece no menu.
export const cv = {
  url: '',
  filename: 'Curriculo-Gustavo-Ribas-Silestrino.pdf',
}

// Crédito da inspiração do design
export const credits = {
  label: { pt: 'Design inspirado em', en: 'Design inspired by' },
  name: 'Jonathan Bergamo',
  url: 'https://www.linkedin.com/in/jonathanbergamo/',
}

// Textos da interface
export const ui = {
  start: { pt: 'Iniciar', en: 'Start' },
  trash: { pt: 'Lixeira', en: 'Trash' },
  trashRestore: { pt: 'Clique para restaurar os cards', en: 'Click to restore the cards' },
  sections: { pt: 'Seções', en: 'Sections' },
  system: { pt: 'Sistema', en: 'System' },
  downloadCv: { pt: 'Baixar currículo', en: 'Download résumé' },
  resetLayout: { pt: 'Redefinir layout', en: 'Reset layout' },
  expand: { pt: 'Expandir', en: 'Expand' },
  caseStudy: { pt: 'Estudo de caso', en: 'Case study' },
  seeCase: { pt: 'Ver estudo de caso', en: 'View case study' },
  problem: { pt: 'Objetivo', en: 'Goal' },
  whatItDoes: { pt: 'O que faz', en: 'What it does' },
  techs: { pt: 'Tecnologias', en: 'Technologies' },
  myRole: { pt: 'Meu papel', en: 'My role' },
  viewOnline: { pt: 'Ver online', en: 'View online' },
  viewCode: { pt: 'Ver código', en: 'View code' },
  otherProjects: { pt: 'Outros projetos', en: 'Other projects' },
  play: { pt: 'Tocar', en: 'Play' },
  pause: { pt: 'Pausar', en: 'Pause' },
  openYoutube: { pt: 'Abrir no YouTube', en: 'Open on YouTube' },
  palette: { pt: 'Paleta de cores', en: 'Color palette' },
  darkMode: { pt: 'Mudar para o tema escuro', en: 'Switch to dark theme' },
  lightMode: { pt: 'Mudar para o tema claro', en: 'Switch to light theme' },
  language: { pt: 'Idioma', en: 'Language' },
  minimize: { pt: 'Minimizar', en: 'Minimize' },
  maximize: { pt: 'Ampliar', en: 'Maximize' },
  restore: { pt: 'Restaurar', en: 'Restore' },
  close: { pt: 'Fechar', en: 'Close' },
  remove: { pt: 'Remover', en: 'Remove' },
  clickMe: { pt: '(clique em mim)', en: '(click me)' },
  wave: { pt: 'Oi! Eu sou o Gustavo 👋', en: "Hi! I'm Gustavo 👋" },
  stack: { pt: 'Stack', en: 'Stack' },
  termWelcome: { pt: 'Bem-vindo! Digite "help" para ver os comandos.', en: 'Welcome! Type "help" to see the commands.' },
  termHelp: {
    pt: 'Comandos: sobre, skills, projetos, agora, contato, whoami, clear',
    en: 'Commands: about, skills, projects, now, contact, whoami, clear',
  },
  termNotFound: { pt: 'comando não encontrado: {cmd} (digite "help")', en: 'command not found: {cmd} (type "help")' },
}
