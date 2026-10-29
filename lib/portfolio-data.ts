export const profile = {
  github: "https://github.com/mesql1",
  instagram: "https://www.instagram.com/luiz.mesq/",
  linkedin: "https://www.linkedin.com/in/luiz-eduardo-mesquita/",
  email: "mailto:luizmesquitasena@gmail.com",
  whatsapp: "https://wa.me/5598982078051",
};

export const projects = [
  {
    number: "01",
    name: "JoBBot",
    description: "Bot assíncrono para Discord que monitora vagas de TI na Adzuna, permite buscas sob demanda e publica apenas oportunidades novas.",
    technologies: ["Python", "Discord API", "Adzuna API", "SQLite", "Docker"],
    caseStudy: {
      problem: "Centralizar a busca por vagas no Discord sem repetir oportunidades nem desperdiçar a cota da API.",
      solution: "Slash commands para buscas manuais e uma rotina diária, às 09:00, configurável por servidor.",
      contribution: "Implementei integração com a Adzuna, comandos, embeds, configuração por servidor e persistência SQLite.",
      architecture: "Módulos separados para ciclo de vida, comandos, cliente HTTP/cache, banco de dados e apresentação.",
      tests: "Pytest cobre mapeamento da API, limpeza de HTML e persistência/deduplicação; CI executa testes e Ruff.",
      challenge: "Controlar latência e falhas externas com timeout, cache, limite de buscas e isolamento por servidor.",
      result: "Até cinco termos por servidor, vagas das últimas 24 horas e envio de até dez embeds por mensagem.",
    },
    href: "https://github.com/mesql1/JoBBot",
    visual: "discord",
  },
  {
    number: "02",
    name: "Gerenciador Financeiro",
    description: "Aplicação desktop em Python para controlar transações, contas e orçamentos, com persistência e visualização de dados.",
    technologies: ["Python", "SQLite", "Pytest", "Matplotlib", "CSV"],
    caseStudy: {
      problem: "Reunir receitas, despesas, contas e limites mensais em um fluxo único e persistente.",
      solution: "CRUD financeiro com alertas de orçamento, dashboards, múltiplas contas e exportação de extratos.",
      contribution: "Modelei o domínio e implementei regras de negócio, SQLite, interface, gráficos e exportação CSV.",
      architecture: "Separação entre modelos, serviços, repositório SQLite e interface para reduzir acoplamento.",
      tests: "Pytest cobre regras de saldo e orçamento, além das operações de persistência do repositório.",
      challenge: "Manter consistência entre contas, categorias e transações usando chaves estrangeiras e operações SQL.",
      result: "CRUD completo, alertas em 80% e 100% do orçamento, relatórios visuais e CSV em UTF-8.",
    },
    href: "https://github.com/mesql1/gerenciador_finan",
    visual: "finance",
  },
] as const;

export const technologyGroups = [
  { title: "Backend", items: ["Python", "Django"], featured: true },
  { title: "Banco de dados", items: ["SQLite", "PostgreSQL"] },
  { title: "APIs e Web", items: ["REST", "JSON", "HTTP"] },
  { title: "Ferramentas", items: ["Git", "GitHub", "VS Code"] },
  { title: "Outras", items: ["Pytest", "Matplotlib", "Discord API"] },
];
