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
  discord: ["Busca por comando", "Busca automática"],
  finance: ["Transações", "Dashboard", "Contas"],
} as const;

const projectScreenshots = {
  discord: [
    "/projects/jobbot/busca-comando.png",
    "/projects/jobbot/busca-automatica.png",
  ],
  finance: [
    "/projects/finance/transacoes.png",
    "/projects/finance/dashboard.png",
    "/projects/finance/contas.png",
  ],
} as const;

function ProjectVisual({ kind, name, slide }: { kind: "discord" | "finance"; name: string; slide: number }) {
  const label = projectSlides[kind][slide];
  return <div className={`project-visual project-visual--${kind} project-visual--screenshot`}><img className="project-screenshot" src={projectScreenshots[kind][slide]} alt={`Tela de ${label} do ${name}`} /></div>;
}

function ProjectCarousel({ kind, name }: { kind: "discord" | "finance"; name: string }) {
  const slides = projectSlides[kind];
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState<{ from: number; to: number; direction: "next" | "prev" } | null>(null);
  const [pointerStart, setPointerStart] = useState<number | null>(null);
  const go = (delta: number) => {
    if (transition) return;
    setTransition({ from: current, to: (current + delta + slides.length) % slides.length, direction: delta > 0 ? "next" : "prev" });
  };
  const goTo = (index: number) => {
    if (transition || index === current) return;
    const forward = (index - current + slides.length) % slides.length;
    const backward = (current - index + slides.length) % slides.length;
    setTransition({ from: current, to: index, direction: forward <= backward ? "next" : "prev" });
  };
  const finishTransition = () => {
    if (!transition) return;
    setCurrent(transition.to);
    setTransition(null);
  };
  const previous = (current - 1 + slides.length) % slides.length;
  const next = (current + 1) % slides.length;
  const visible = transition?.to ?? current;
  return <figure className="project-carousel" tabIndex={0} aria-label={`Galeria de ${name}`} onKeyDown={event => { if (event.key === "ArrowLeft") go(-1); if (event.key === "ArrowRight") go(1); }} onPointerDown={event => setPointerStart(event.clientX)} onPointerUp={event => { if (pointerStart === null) return; const distance = event.clientX - pointerStart; if (Math.abs(distance) > 48) go(distance < 0 ? 1 : -1); setPointerStart(null); }}>
    <div className={`project-carousel__stage ${transition ? `is-transitioning is-${transition.direction}` : ""}`} aria-busy={transition ? "true" : undefined}>
      <button className="carousel-arrow carousel-arrow--left" onClick={() => go(-1)} disabled={!!transition} aria-label={`Imagem anterior de ${name}`}><ChevronLeft aria-hidden="true" /></button>
      <button className="project-carousel__slot project-carousel__slot--side project-carousel__slot--left" onClick={() => go(-1)} disabled={!!transition} aria-label={`Ver ${slides[previous]}`}><ProjectVisual kind={kind} name={name} slide={previous} /></button>
      <div className="project-carousel__slot project-carousel__slot--center">{transition ? <><div className={`carousel-frame carousel-frame--out carousel-frame--${transition.direction}`}><ProjectVisual kind={kind} name={name} slide={transition.from} /></div><div className={`carousel-frame carousel-frame--in carousel-frame--${transition.direction}`} onAnimationEnd={finishTransition}><ProjectVisual kind={kind} name={name} slide={transition.to} /></div></> : <div className="carousel-frame"><ProjectVisual kind={kind} name={name} slide={current} /></div>}</div>
      <button className="project-carousel__slot project-carousel__slot--side project-carousel__slot--right" onClick={() => go(1)} disabled={!!transition} aria-label={`Ver ${slides[next]}`}><ProjectVisual kind={kind} name={name} slide={next} /></button>
      <button className="carousel-arrow carousel-arrow--right" onClick={() => go(1)} disabled={!!transition} aria-label={`Próxima imagem de ${name}`}><ChevronRight aria-hidden="true" /></button>
    </div>
    <div className="project-carousel__footer"><figcaption aria-live="polite"><span>{String(visible + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>{slides[visible]}</figcaption><div className="carousel-dots" aria-label="Selecionar imagem">{slides.map((label, index) => <button key={label} className={index === visible ? "active" : ""} disabled={!!transition} onClick={() => goTo(index)} aria-label={`Ver ${label}`} aria-current={index === visible ? "true" : undefined} />)}</div></div>
  </figure>;
}

export function ProjectCard({ project, reverse = false }: { project: (typeof projects)[number]; reverse?: boolean }) {
  return <article className={`project-card reveal ${reverse ? "project-card--reverse" : ""}`}><div className="project-card__copy"><div className="project-number">{project.number} / SELECTED</div><h3>{project.name}</h3><p>{project.description}</p><div className="tag-list">{project.technologies.map(item => <span key={item}>{item}</span>)}</div><ul className="project-highlights">{project.highlights.map(item => <li key={item}>{item}</li>)}</ul><Button href={project.href} variant="outline">Ver no GitHub</Button></div><ProjectCarousel kind={project.visual} name={project.name} /></article>;
}

export function TechnologyGroup({ group, index }: { group: (typeof technologyGroups)[number]; index: number }) {
  return <article className={`tech-group reveal ${"featured" in group && group.featured ? "tech-group--featured" : ""}`}><span>0{index + 1}</span><h3>{group.title}</h3><div>{group.items.map(item => <p key={item}>{item}</p>)}</div></article>;
}

export function SocialLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const unavailable = href === "#" || href.includes("exemplo.com");
  const external = href.startsWith("http");
  return <a className="social-link" href={unavailable ? undefined : href} aria-disabled={unavailable} title={unavailable ? "Link pronto para configurar" : undefined} target={!unavailable && external ? "_blank" : undefined} rel={!unavailable && external ? "noreferrer" : undefined}><span>{icon}{children}{unavailable && <small>CONFIGURAR</small>}</span><ArrowUpRight /></a>;
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
    <section id="sobre" className="section about-section"><div className="orbit orbit--about" aria-hidden="true" /><SectionTitle index="01">Sobre mim</SectionTitle><div className="about-grid"><div className="about-copy reveal"><p className="lead">Olá, sou Luiz Eduardo, desenvolvedor com foco em <em>backend.</em></p><p>Atualmente desenvolvo projetos principalmente utilizando Python e venho aprofundando meus conhecimentos em desenvolvimento web, APIs, bancos de dados, automação e arquitetura de software.</p><p>Gosto de transformar problemas em aplicações funcionais, organizadas e fáceis de manter.</p></div><div className="identity-card identity-card--portrait reveal"><img className="identity-photo" src="/profile/luiz-eduardo.png" alt="Luiz Mesquita" /><div className="identity-card__portrait-copy"><span>BACKEND DEVELOPER</span><strong>Luiz Mesquita</strong><p>Construindo, aprendendo,<br />evoluindo.</p><code>Python · APIs · Automação</code></div></div></div></section>
    <section id="projetos" className="section projects-section"><SectionTitle index="02">Projetos selecionados</SectionTitle><ProjectCard project={projects[0]} /><ProjectCard project={projects[1]} reverse /><article className="coming-soon reveal"><span>03</span><div><small>EM DESENVOLVIMENTO</small><h3>Novos projetos backend e APIs em desenvolvimento.</h3></div><code>{"{ work_in_progress: true }"}</code></article></section>
    <section id="tecnologias" className="section tech-section"><SectionTitle index="03">Tecnologias</SectionTitle><div className="tech-intro"><h2>ferramentas<br />de trabalho<span>.</span></h2><p>Algumas tecnologias que utilizo nos meus projetos.</p></div><div className="tech-grid">{technologyGroups.map((group, index) => <TechnologyGroup key={group.title} group={group} index={index} />)}</div></section>
    <section id="github" className="section github-section"><div className="github-code" aria-hidden="true"><span>def build_future():</span><span>&nbsp;&nbsp;learn()</span><span>&nbsp;&nbsp;ship()</span><span>&nbsp;&nbsp;repeat()</span></div><div className="github-copy reveal"><span>04 / OPEN SOURCE</span><h2>CODE<span>.</span></h2><p>Além dos projetos apresentados aqui, mantenho outros estudos, experimentos e projetos disponíveis no GitHub.</p><Button href={profile.github}>Explorar GitHub</Button></div></section>
    <section id="contato" className="section contact-section"><div className="orbit orbit--contact" aria-hidden="true" /><span className="contact-index">05 / CONTATO</span><h2>VAMOS<br /><span>CONVERSAR</span><i>?</i></h2><p>Tem uma oportunidade, projeto ou quer conversar sobre desenvolvimento?</p><div className="social-list"><SocialLink href={profile.github} icon={<Code2 />}>GitHub</SocialLink><SocialLink href={profile.linkedin}>LinkedIn</SocialLink><SocialLink href={profile.instagram}>Instagram</SocialLink><SocialLink href={profile.email} icon={<Mail />}>E-mail</SocialLink></div></section>
  </main><Footer /></>;
}
