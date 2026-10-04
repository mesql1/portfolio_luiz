export const profile = {
  github: "https://github.com/mesql1",
  linkedin: "#",
  email: "mailto:contato@exemplo.com",
};

export const projects = [
  {
    number: "01",
    name: "JoBBot",
    description: "Bot para Discord desenvolvido em Python que automatiza a busca por vagas de emprego através de integração com API externa.",
    technologies: ["Python", "Discord API", "REST API", "JSON", "Automação"],
    highlights: ["Busca automática de vagas", "Busca manual através de comandos", "Integração com API externa", "Configuração por servidor", "Variáveis de ambiente"],
    href: profile.github,
    visual: "discord",
  },
  {
    number: "02",
    name: "Gerenciador Financeiro",
    description: "Aplicação desenvolvida em Python para registrar, organizar e analisar receitas e despesas pessoais.",
    technologies: ["Python", "SQLite", "Pytest", "Matplotlib", "CSV"],
    highlights: ["Programação orientada a objetos", "Arquitetura organizada em camadas", "Persistência de dados", "Testes automatizados", "Exportação CSV e geração de gráficos"],
    href: profile.github,
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
