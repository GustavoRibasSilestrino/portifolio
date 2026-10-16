// Edite aqui seus dados. Tudo que aparece no portfólio vem deste arquivo.
// Textos no formato { pt: '...', en: '...' } são traduzidos pelo seletor PT/EN.

export const profile = {
  name: 'Gustavo Ribas Silestrino',
  age: 19,
  city: 'Salto de Itu, SP',
  status: { pt: 'Aberto a oportunidades', en: 'Open to opportunities' },
  role: { pt: 'Estudante de ADS · futuro dev back end', en: 'ADS student · future back end dev' },
  headline: {
    pt: 'Estudante de ADS no SENAI Sorocaba · Salto de Itu, SP',
    en: 'ADS student at SENAI Sorocaba · Salto de Itu, SP',
  },
  hello: { pt: 'Oi, eu sou o Gustavo', en: "Hi, I'm Gustavo" },
  school: 'ADS · SENAI Sorocaba',
  about: [
    {
      pt: 'Oi! Eu sou o Gustavo, tenho 19 anos e nasci em Salto de Itu, interior de São Paulo.',
      en: "Hi! I'm Gustavo, I'm 19 and I was born in Salto de Itu, in the countryside of São Paulo, Brazil.",
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
  {
    name: { pt: 'Projeto do SENAI (em breve)', en: 'SENAI project (coming soon)' },
    desc: {
      pt: 'Um trabalho feito durante o curso de ADS entra aqui.',
      en: 'A project made during the ADS course goes here.',
    },
    tags: ['ADS', 'SENAI'],
  },
]

export const timeline = [
  {
    when: { pt: 'Atual', en: 'Current' },
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

export const photography = {
  text: {
    pt: 'Ainda estou montando minha galeria. Em breve, fotos dos lugares e momentos que eu gosto de registrar.',
    en: "I'm still putting my gallery together. Soon: photos of places and moments I like to capture.",
  },
  // Coloque as imagens em /public/fotos e liste aqui, ex.: '/fotos/01.jpg'
  gallery: [],
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

export const widgets = {
  local: { pt: 'Local', en: 'Location' },
  study: { pt: 'Estudando agora', en: 'Studying now' },
  studyItems: [
    ['Java', { pt: 'foco', en: 'focus' }],
    ['SQL', { pt: 'em andamento', en: 'in progress' }],
    ['React', { pt: 'praticando', en: 'practicing' }],
  ],
  note: { pt: 'Nota', en: 'Note' },
  noteText: {
    pt: 'Hoje estou aprendendo Java e construindo meu portfólio. Um commit por dia.',
    en: "Today I'm learning Java and building my portfolio. One commit a day.",
  },
}

// Textos da interface
export const ui = {
  start: { pt: 'Iniciar', en: 'Start' },
  trash: { pt: 'Lixeira', en: 'Trash' },
  trashRestore: { pt: 'Clique para restaurar os cards', en: 'Click to restore the cards' },
  palette: { pt: 'Paleta de cores', en: 'Color palette' },
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
