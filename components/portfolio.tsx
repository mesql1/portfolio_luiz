"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Code2, Mail, Menu, X } from "lucide-react";
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

function ProjectVisual({ kind, name }: { kind: string; name: string }) {
  return <div className={`project-visual project-visual--${kind}`} role="img" aria-label={`Espaço reservado para screenshot do projeto ${name}`}><div className="window-bar"><span /><span /><span /><small>preview / {name.toLowerCase().replace(" ", "-")}</small></div>{kind === "discord" ? <div className="discord-ui"><div className="discord-sidebar"><b>J</b><span /><span /><span /></div><div className="discord-content"><small># vagas-backend</small><p><i>JOBBOT</i> 10:32</p><strong>3 novas vagas encontradas</strong><span>Python • Remoto • Júnior</span><span>Django • São Paulo • Estágio</span></div></div> : <div className="finance-ui"><div><small>RESUMO MENSAL</small><strong>Receitas × despesas</strong></div><div className="bars"><i /><i /><i /><i /><i /><i /></div><div className="finance-list"><span>dados.csv</span><span>relatório.py</span><span>✓ testes</span></div></div>}<span className="visual-placeholder">SCREENSHOT / GIF</span></div>;
}

export function ProjectCard({ project, reverse = false }: { project: (typeof projects)[number]; reverse?: boolean }) {
  return <article className={`project-card reveal ${reverse ? "project-card--reverse" : ""}`}><div className="project-card__copy"><div className="project-number">{project.number} / SELECTED</div><h3>{project.name}</h3><p>{project.description}</p><div className="tag-list">{project.technologies.map(item => <span key={item}>{item}</span>)}</div><ul>{project.highlights.map(item => <li key={item}>{item}</li>)}</ul><Button href={project.href} variant="outline">Ver no GitHub</Button></div><ProjectVisual kind={project.visual} name={project.name} /></article>;
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
    <section id="inicio" className="hero"><div className="orbit orbit--hero" aria-hidden="true" /><div className="hero__eyebrow"><span>PORTFÓLIO / 2026</span><span>BASED IN BRAZIL</span></div><h1><span>BACKEND</span><span>DEVELOPER<i>.</i></span></h1><div className="hero__bottom"><div><p>Desenvolvo aplicações backend, integrações com APIs e sistemas focados em automação e organização de dados.</p><div className="tag-list"><span>Python</span><span>Django</span><span>APIs</span><span>Automação</span></div></div><div className="hero__actions"><Button href="#projetos">Ver projetos</Button><Button href={profile.github} variant="outline">GitHub</Button></div></div><a className="scroll-cue" href="#projetos" aria-label="Rolar até projetos"><ArrowDown /><span>SCROLL</span></a></section>
    <section id="sobre" className="section about-section"><div className="orbit orbit--about" aria-hidden="true" /><SectionTitle index="01">Sobre mim</SectionTitle><div className="about-grid"><div className="about-copy reveal"><p className="lead">Olá, sou Luiz Eduardo, desenvolvedor com foco em <em>backend.</em></p><p>Atualmente desenvolvo projetos principalmente utilizando Python e venho aprofundando meus conhecimentos em desenvolvimento web, APIs, bancos de dados, automação e arquitetura de software.</p><p>Gosto de transformar problemas em aplicações funcionais, organizadas e fáceis de manter.</p></div><div className="identity-card reveal"><div className="identity-mark">LE</div><div><span>STATUS</span><strong>Construindo, aprendendo,<br />evoluindo.</strong></div><code>focus = [&quot;backend&quot;, &quot;APIs&quot;, &quot;data&quot;]</code></div></div></section>
    <section id="projetos" className="section projects-section"><SectionTitle index="02">Projetos selecionados</SectionTitle><ProjectCard project={projects[0]} /><ProjectCard project={projects[1]} reverse /><article className="coming-soon reveal"><span>03</span><div><small>EM DESENVOLVIMENTO</small><h3>Novos projetos backend e APIs em desenvolvimento.</h3></div><code>{"{ work_in_progress: true }"}</code></article></section>
    <section id="tecnologias" className="section tech-section"><SectionTitle index="03">Tecnologias</SectionTitle><div className="tech-intro"><h2>FERRAMENTAS<br />DE TRABALHO<span>.</span></h2><p>Algumas tecnologias que utilizo nos meus projetos.</p></div><div className="tech-grid">{technologyGroups.map((group, index) => <TechnologyGroup key={group.title} group={group} index={index} />)}</div></section>
    <section id="github" className="section github-section"><div className="github-code" aria-hidden="true"><span>def build_future():</span><span>&nbsp;&nbsp;learn()</span><span>&nbsp;&nbsp;ship()</span><span>&nbsp;&nbsp;repeat()</span></div><div className="github-copy reveal"><span>04 / OPEN SOURCE</span><h2>CODE<span>.</span></h2><p>Além dos projetos apresentados aqui, mantenho outros estudos, experimentos e projetos disponíveis no GitHub.</p><Button href={profile.github}>Explorar GitHub</Button></div></section>
    <section id="contato" className="section contact-section"><div className="orbit orbit--contact" aria-hidden="true" /><span className="contact-index">05 / CONTATO</span><h2>VAMOS<br /><span>CONVERSAR</span><i>?</i></h2><p>Tem uma oportunidade, projeto ou quer conversar sobre desenvolvimento?</p><div className="social-list"><SocialLink href={profile.github} icon={<Code2 />}>GitHub</SocialLink><SocialLink href={profile.linkedin}>LinkedIn</SocialLink><SocialLink href={profile.email} icon={<Mail />}>E-mail</SocialLink></div></section>
  </main><Footer /></>;
}
