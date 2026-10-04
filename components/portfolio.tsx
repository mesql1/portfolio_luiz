"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Code2, Mail, Menu, X } from "lucide-react";
import { profile, projects, technologyGroups } from "@/lib/portfolio-data";

const navItems = [["sobre", "Sobre"], ["projetos", "Projetos"], ["tecnologias", "Tecnologias"], ["contato", "Contato"]] as const;

export function Button({ href, children, variant = "primary", label }: { href: string; children: React.ReactNode; variant?: "primary" | "outline" | "text"; label?: string }) {
  return <a className={`button button--${variant}`} href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}><span>{children}</span><ArrowUpRight aria-hidden="true" size={18} /></a>;
}

export function SectionTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-title reveal"><span>{index}</span><h2>... /{children} ...</h2><span className="section-title__line" aria-hidden="true" /></div>;
}

export function Navbar({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return <header className="nav-shell"><a className="brand" href="#inicio" aria-label="Luiz Eduardo, início"><span>Luiz</span><span>Eduardo</span></a><button className="nav-toggle" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Navegação principal">{navItems.map(([id, label]) => <a key={id} className={active === id ? "active" : ""} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-github" href={profile.github} target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub</a></nav></header>;
}

const projectSlides = {
  discord: ["Busca automática", "Busca por comando", "Configuração do servidor"],
  finance: ["Resumo mensal", "Receitas e despesas", "Exportação e testes"],
} as const;

function ProjectVisual({ kind, name, slide }: { kind: string; name: string; slide: number }) {
  const discordViews = [
    <div className="discord-content" key="auto"><small># vagas-backend</small><p><i>JOBBOT</i> 10:32</p><strong>3 novas vagas encontradas</strong><span>Python • Remoto • Júnior</span><span>Django • São Paulo • Estágio</span></div>,
    <div className="discord-content" key="command"><small># comandos</small><p><i>VOCÊ</i> 10:34</p><strong>/vagas python remoto</strong><span>Buscando vagas compatíveis...</span><span>Resultados enviados neste canal.</span></div>,
    <div className="discord-content" key="config"><small># jobbot-config</small><p><i>SETUP</i> / SERVIDOR</p><strong>Configuração do servidor</strong><span>canal: #vagas</span><span>filtros: backend • remoto</span></div>,
  ];
  const financeViews = [
    <div className="finance-ui" key="summary"><div><small>RESUMO MENSAL</small><strong>Receitas × despesas</strong></div><div className="bars"><i /><i /><i /><i /><i /><i /></div><div className="finance-list"><span>dados.csv</span><span>relatório.py</span><span>✓ testes</span></div></div>,
    <div className="finance-ui finance-ui--records" key="records"><div><small>LANÇAMENTOS</small><strong>Receitas e despesas</strong></div><div className="record-list"><span><b>Salário</b><i>receita</i></span><span><b>Mercado</b><i>despesa</i></span><span><b>Freelance</b><i>receita</i></span></div></div>,
    <div className="finance-ui finance-ui--terminal" key="terminal"><div><small>TERMINAL</small><strong>Exportação e testes</strong></div><code>$ pytest<br />✓ testes concluídos<br /><br />$ exportar --formato csv<br />✓ dados.csv gerado</code></div>,
  ];
  return <div className={`project-visual project-visual--${kind}`} role="img" aria-label={`Prévia ilustrativa de ${name}: ${kind === "discord" ? projectSlides.discord[slide] : projectSlides.finance[slide]}`}><div className="window-bar"><span /><span /><span /><small>preview / {name.toLowerCase().replace(" ", "-")}</small></div>{kind === "discord" ? <div className="discord-ui"><div className="discord-sidebar"><b>J</b><span /><span /><span /></div>{discordViews[slide]}</div> : financeViews[slide]}<span className="visual-placeholder">PREVIEW {String(slide + 1).padStart(2, "0")}</span></div>;
}

function ProjectCarousel({ kind, name }: { kind: "discord" | "finance"; name: string }) {
  const slides = projectSlides[kind];
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [pointerStart, setPointerStart] = useState<number | null>(null);
  const go = (delta: number) => {
    setDirection(delta > 0 ? "next" : "prev");
    setCurrent(value => (value + delta + slides.length) % slides.length);
  };
  const previous = (current - 1 + slides.length) % slides.length;
  const next = (current + 1) % slides.length;
  return <figure className="project-carousel" tabIndex={0} aria-label={`Galeria de ${name}`} onKeyDown={event => { if (event.key === "ArrowLeft") go(-1); if (event.key === "ArrowRight") go(1); }} onPointerDown={event => setPointerStart(event.clientX)} onPointerUp={event => { if (pointerStart === null) return; const distance = event.clientX - pointerStart; if (Math.abs(distance) > 48) go(distance < 0 ? 1 : -1); setPointerStart(null); }}>
    <div className={`project-carousel__stage is-${direction}`}>
      <button className="carousel-arrow carousel-arrow--left" onClick={() => go(-1)} aria-label={`Imagem anterior de ${name}`}><ChevronLeft aria-hidden="true" /></button>
      <button className="project-carousel__slot project-carousel__slot--side project-carousel__slot--left" onClick={() => go(-1)} aria-label={`Ver ${slides[previous]}`}><ProjectVisual kind={kind} name={name} slide={previous} /></button>
      <div key={`${current}-${direction}`} className="project-carousel__slot project-carousel__slot--center"><ProjectVisual kind={kind} name={name} slide={current} /></div>
      <button className="project-carousel__slot project-carousel__slot--side project-carousel__slot--right" onClick={() => go(1)} aria-label={`Ver ${slides[next]}`}><ProjectVisual kind={kind} name={name} slide={next} /></button>
      <button className="carousel-arrow carousel-arrow--right" onClick={() => go(1)} aria-label={`Próxima imagem de ${name}`}><ChevronRight aria-hidden="true" /></button>
    </div>
    <div className="project-carousel__footer"><figcaption aria-live="polite"><span>{String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>{slides[current]}</figcaption><div className="carousel-dots" aria-label="Selecionar imagem">{slides.map((label, index) => <button key={label} className={index === current ? "active" : ""} onClick={() => { setDirection(index > current ? "next" : "prev"); setCurrent(index); }} aria-label={`Ver ${label}`} aria-current={index === current ? "true" : undefined} />)}</div></div>
  </figure>;
}

export function ProjectCard({ project, reverse = false }: { project: (typeof projects)[number]; reverse?: boolean }) {
  return <article className={`project-card reveal ${reverse ? "project-card--reverse" : ""}`}><div className="project-card__header"><div className="project-card__copy"><div className="project-number">{project.number} / SELECTED</div><h3>{project.name}</h3><p>{project.description}</p><div className="tag-list">{project.technologies.map(item => <span key={item}>{item}</span>)}</div><Button href={project.href} variant="outline">Ver no GitHub</Button></div><ul className="project-highlights">{project.highlights.map(item => <li key={item}>{item}</li>)}</ul></div><ProjectCarousel kind={project.visual} name={project.name} /></article>;
}

export function TechnologyGroup({ group, index }: { group: (typeof technologyGroups)[number]; index: number }) {
  return <article className={`tech-group reveal ${"featured" in group && group.featured ? "tech-group--featured" : ""}`}><span>0{index + 1}</span><h3>{group.title}</h3><div>{group.items.map(item => <p key={item}>{item}</p>)}</div></article>;
}

export function SocialLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const unavailable = href === "#" || href.includes("exemplo.com");
  return <a className="social-link" href={unavailable ? undefined : href} aria-disabled={unavailable} title={unavailable ? "Link pronto para configurar" : undefined}><span>{icon}{children}{unavailable && <small>CONFIGURAR</small>}</span><ArrowUpRight /></a>;
}

export function Footer() {
  return <footer><div><strong>Luiz Eduardo</strong><span>Backend Developer</span></div><p>Python / Django / APIs</p><p>© {new Date().getFullYear()} — Feito com código &amp; café.</p></footer>;
}

export function Portfolio() {
  const [active, setActive] = useState("inicio");
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: "-35% 0px -55%" });
    sections.forEach(section => observer.observe(section));
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), { threshold: 0.12 });
    reveals.forEach(item => revealObserver.observe(item));
    return () => { observer.disconnect(); revealObserver.disconnect(); };
  }, []);

  return <><Navbar active={active} /><main>
    <section id="inicio" className="hero"><div className="orbit orbit--hero" aria-hidden="true" /><div className="hero__eyebrow"><span>PORTFÓLIO / 2026</span><span>BASED IN BRAZIL</span></div><h1><span>backend</span><span>developer<i>.</i></span></h1><div className="hero__bottom"><div><p>Desenvolvo aplicações backend, integrações com APIs e sistemas focados em automação e organização de dados.</p><div className="tag-list"><span>Python</span><span>Django</span><span>APIs</span><span>Automação</span></div></div><div className="hero__actions"><Button href="#projetos">Ver projetos</Button><Button href={profile.github} variant="outline">GitHub</Button></div></div><a className="scroll-cue" href="#projetos" aria-label="Rolar até projetos"><ArrowDown /><span>SCROLL</span></a></section>
    <section id="sobre" className="section about-section"><div className="orbit orbit--about" aria-hidden="true" /><SectionTitle index="01">Sobre mim</SectionTitle><div className="about-grid"><div className="about-copy reveal"><p className="lead">Olá, sou Luiz Eduardo, desenvolvedor com foco em <em>backend.</em></p><p>Atualmente desenvolvo projetos principalmente utilizando Python e venho aprofundando meus conhecimentos em desenvolvimento web, APIs, bancos de dados, automação e arquitetura de software.</p><p>Gosto de transformar problemas em aplicações funcionais, organizadas e fáceis de manter.</p></div><div className="identity-card reveal"><div className="identity-mark">LE</div><div><span>STATUS</span><strong>Construindo, aprendendo,<br />evoluindo.</strong></div><code>focus = [&quot;backend&quot;, &quot;APIs&quot;, &quot;data&quot;]</code></div></div></section>
    <section id="projetos" className="section projects-section"><SectionTitle index="02">Projetos selecionados</SectionTitle><ProjectCard project={projects[0]} /><ProjectCard project={projects[1]} reverse /><article className="coming-soon reveal"><span>03</span><div><small>EM DESENVOLVIMENTO</small><h3>Novos projetos backend e APIs em desenvolvimento.</h3></div><code>{"{ work_in_progress: true }"}</code></article></section>
    <section id="tecnologias" className="section tech-section"><SectionTitle index="03">Tecnologias</SectionTitle><div className="tech-intro"><h2>ferramentas<br />de trabalho<span>.</span></h2><p>Algumas tecnologias que utilizo nos meus projetos.</p></div><div className="tech-grid">{technologyGroups.map((group, index) => <TechnologyGroup key={group.title} group={group} index={index} />)}</div></section>
    <section id="github" className="section github-section"><div className="github-code" aria-hidden="true"><span>def build_future():</span><span>&nbsp;&nbsp;learn()</span><span>&nbsp;&nbsp;ship()</span><span>&nbsp;&nbsp;repeat()</span></div><div className="github-copy reveal"><span>04 / OPEN SOURCE</span><h2>CODE<span>.</span></h2><p>Além dos projetos apresentados aqui, mantenho outros estudos, experimentos e projetos disponíveis no GitHub.</p><Button href={profile.github}>Explorar GitHub</Button></div></section>
    <section id="contato" className="section contact-section"><div className="orbit orbit--contact" aria-hidden="true" /><span className="contact-index">05 / CONTATO</span><h2>VAMOS<br /><span>CONVERSAR</span><i>?</i></h2><p>Tem uma oportunidade, projeto ou quer conversar sobre desenvolvimento?</p><div className="social-list"><SocialLink href={profile.github} icon={<Code2 />}>GitHub</SocialLink><SocialLink href={profile.linkedin}>LinkedIn</SocialLink><SocialLink href={profile.email} icon={<Mail />}>E-mail</SocialLink></div></section>
  </main><Footer /></>;
}
