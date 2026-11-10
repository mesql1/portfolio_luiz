"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, Camera, ChevronLeft, ChevronRight, Code2, FolderKanban, Mail, MessageCircle, UserRound, Wrench } from "lucide-react";
import { profile, projects, technologyGroups } from "@/lib/portfolio-data";
import { HeroParticles } from "@/components/hero-particles";
import { AmbientMeta, ScrollToTop, SectionCorners } from "@/components/portfolio-primitives";

const navItems = [["sobre", "Sobre", UserRound], ["projetos", "Projetos", FolderKanban], ["tecnologias", "Tecnologias", Wrench], ["contato", "Contato", Mail]] as const;

export function Button({ href, children, variant = "primary", label }: { href: string; children: React.ReactNode; variant?: "primary" | "outline" | "text"; label?: string }) {
  return <a className={`button button--${variant}`} href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}><span>{children}</span><ArrowUpRight aria-hidden="true" size={18} /></a>;
}

export function SectionTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="section-title reveal"><span>{index}</span><h2>... /{children} ...</h2><span className="section-title__line" aria-hidden="true" /></div>;
}

export function Navbar({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeIndex = navItems.findIndex(([id]) => id === active);
  const focalIndex = hoveredIndex ?? activeIndex;

  return <header className="nav-shell"><nav className="nav-links nav-links--dock nav-links--liquid" aria-label="Navegação principal" onMouseLeave={() => setHoveredIndex(null)}><span className={`nav-liquid-lens nav-liquid-lens--${Math.max(focalIndex, 0)} ${focalIndex >= 0 ? "is-visible" : ""}`} aria-hidden="true" />{navItems.map(([id, label, Icon], index) => {
    const distance = focalIndex < 0 ? 2 : Math.abs(index - focalIndex);
    const proximityClass = distance === 0 ? "nav-item--focus" : distance === 1 ? "nav-item--adjacent" : "nav-item--far";
    return <a
      key={id}
      className={`${active === id ? "active " : ""}${proximityClass}`}
      href={`#${id}`}
      aria-label={label}
      aria-current={active === id ? "location" : undefined}
      onMouseEnter={() => setHoveredIndex(index)}
      onFocus={() => setHoveredIndex(index)}
      onBlur={() => setHoveredIndex(null)}
      onClick={() => { setHoveredIndex(null); onNavigate(id); }}
    ><span className="nav-orb"><Icon aria-hidden="true" /></span><small>{label}</small><i aria-hidden="true" /></a>;
  })}</nav></header>;
}

const projectSlides = {
  discord: ["Busca por comando", "Busca automática"],
  finance: ["Transações", "Dashboard", "Contas"],
} as const;

const projectScreenshots = {
  discord: [
    "projects/jobbot/busca-comando.webp",
    "projects/jobbot/busca-automatica.webp",
  ],
  finance: [
    "projects/finance/transacoes.webp",
    "projects/finance/dashboard.webp",
    "projects/finance/contas.webp",
  ],
} as const;

function ProjectVisual({ kind, name, slide }: { kind: "discord" | "finance"; name: string; slide: number }) {
  const label = projectSlides[kind][slide];
  return <div className={`project-visual project-visual--${kind} project-visual--screenshot`}><img className="project-screenshot" src={projectScreenshots[kind][slide]} alt={`Tela de ${label} do ${name}`} loading="lazy" decoding="async" fetchPriority="low" /></div>;
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
  return <figure className="project-carousel project-carousel--mobile" tabIndex={0} aria-label={`Galeria de ${name}`} onKeyDown={event => { if (event.key === "ArrowLeft") go(-1); if (event.key === "ArrowRight") go(1); }} onPointerDown={event => setPointerStart(event.clientX)} onPointerUp={event => { if (pointerStart === null) return; const distance = event.clientX - pointerStart; if (Math.abs(distance) > 48) go(distance < 0 ? 1 : -1); setPointerStart(null); }}>
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

function ProjectScrollGallery({ kind, name, current, onSelect }: { kind: "discord" | "finance"; name: string; current: number; onSelect: (index: number) => void }) {
  const slides = projectSlides[kind];
  const [visible, setVisible] = useState(current);
  const [transition, setTransition] = useState<{ from: number; to: number; direction: "next" | "prev" } | null>(null);

  useEffect(() => {
    if (transition || current === visible) return;
    setTransition({ from: visible, to: current, direction: current > visible ? "next" : "prev" });
  }, [current, transition, visible]);

  const finishTransition = () => {
    if (!transition) return;
    setVisible(transition.to);
    setTransition(null);
  };

  const displayed = transition?.to ?? visible;
  return <figure className={`project-scroll-gallery project-scroll-gallery--${kind}`} aria-label={`Galeria de ${name} controlada pelo scroll`}>
    <div className="project-scroll-gallery__stage">
      {transition ? <><div className={`project-scroll-gallery__frame carousel-frame carousel-frame--out carousel-frame--${transition.direction}`} aria-hidden="true"><ProjectVisual kind={kind} name={name} slide={transition.from} /></div><div className={`project-scroll-gallery__frame carousel-frame carousel-frame--in carousel-frame--${transition.direction}`} onAnimationEnd={finishTransition}><ProjectVisual kind={kind} name={name} slide={transition.to} /></div></> : <div className="project-scroll-gallery__frame is-active"><ProjectVisual kind={kind} name={name} slide={visible} /></div>}
      <span className="project-scroll-gallery__hint" aria-hidden="true">scroll para explorar</span>
    </div>
    <div className="project-scroll-gallery__footer"><figcaption aria-live="polite"><span>{String(displayed + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>{slides[displayed]}</figcaption><div className="carousel-dots" aria-label="Selecionar imagem">{slides.map((label, index) => <button key={label} className={index === displayed ? "active" : ""} onClick={() => onSelect(index)} aria-label={`Ver ${label}`} aria-current={index === displayed ? "true" : undefined} />)}</div></div>
  </figure>;
}

const caseStudyLabels = {
  problem: "Problema",
  solution: "Solução",
  contribution: "Contribuição",
  architecture: "Arquitetura",
  tests: "Testes",
  challenge: "Desafio",
  result: "Resultado",
} as const;

function ProjectEvidence({ details, projectId }: { details: (typeof projects)[number]["caseStudy"]; projectId: string }) {
  const entries = Object.entries(details) as [keyof typeof caseStudyLabels, string][];
  const [activeKey, setActiveKey] = useState<keyof typeof caseStudyLabels>("problem");
  const activeIndex = entries.findIndex(([key]) => key === activeKey);
  const selectRelative = (delta: number) => {
    const nextIndex = (activeIndex + delta + entries.length) % entries.length;
    setActiveKey(entries[nextIndex][0]);
  };
  return <div className="project-evidence">
    <div className="project-evidence__tabs" role="tablist" aria-label="Detalhes técnicos do projeto" onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); selectRelative(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); selectRelative(-1); }
    }}>
      {entries.map(([key]) => <button key={key} id={`${projectId}-tab-${key}`} type="button" role="tab" aria-selected={activeKey === key} aria-controls={`${projectId}-panel`} tabIndex={activeKey === key ? 0 : -1} onClick={() => setActiveKey(key)}>{caseStudyLabels[key]}</button>)}
    </div>
    <div className="project-evidence__panel" id={`${projectId}-panel`} role="tabpanel" aria-labelledby={`${projectId}-tab-${activeKey}`} tabIndex={0}>
      <span>{caseStudyLabels[activeKey]}</span>
      <p>{details[activeKey]}</p>
    </div>
  </div>;
}

export function ProjectCard({ project, reverse = false }: { project: (typeof projects)[number]; reverse?: boolean }) {
  const cardRef = useRef<HTMLElement>(null);
  const slideCount = projectSlides[project.visual].length;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!window.matchMedia("(min-width: 901px)").matches) return;
      const rect = card.getBoundingClientRect();
      const stickyTop = 110;
      const scrollable = Math.max(card.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, (-rect.top + stickyTop) / scrollable));
      card.style.setProperty("--project-progress", progress.toFixed(4));
      card.style.setProperty("--project-copy-y", `${((.5 - progress) * 28).toFixed(2)}px`);
      card.style.setProperty("--project-title-shift", `${((reverse ? 1 : -1) * progress * 18).toFixed(2)}vw`);
      card.style.setProperty("--project-line-x", `${(progress * 100).toFixed(2)}%`);
      card.style.setProperty("--project-mask-y", `${((1 - progress) * 3.5).toFixed(2)}%`);
      card.style.setProperty("--project-mask-x", `${((1 - progress) * 2.5).toFixed(2)}%`);
      card.style.setProperty("--project-scale", (.94 + progress * .06).toFixed(4));
      setCurrent(Math.round(progress * (slideCount - 1)));
    };
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => { window.removeEventListener("scroll", scheduleUpdate); window.removeEventListener("resize", scheduleUpdate); if (frame) window.cancelAnimationFrame(frame); };
  }, [reverse, slideCount]);

  const scrollToSlide = (index: number) => {
    const card = cardRef.current;
    if (!card) return;
    const cardTop = window.scrollY + card.getBoundingClientRect().top;
    const scrollable = Math.max(card.offsetHeight - window.innerHeight, 0);
    const progress = slideCount > 1 ? index / (slideCount - 1) : 0;
    window.scrollTo({ top: cardTop - 110 + scrollable * progress, behavior: "smooth" });
  };

  return <article ref={cardRef} className={`project-card project-card--scroll reveal ${reverse ? "project-card--reverse" : ""}`} style={{ "--slide-count": slideCount } as CSSProperties}><div className="project-card__sticky"><div className="project-card__cinematic" aria-hidden="true"><span>{project.name}</span><i /><small>{String(current + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}</small></div><div className="project-card__copy"><div className="project-number">{project.number} / SELECTED</div><h3>{project.name}</h3><p>{project.description}</p><div className="tag-list">{project.technologies.map(item => <span key={item}>{item}</span>)}</div><ProjectEvidence projectId={`project-${project.number}`} details={project.caseStudy} /><Button href={project.href} variant="outline">Ver no GitHub</Button></div><ProjectScrollGallery kind={project.visual} name={project.name} current={current} onSelect={scrollToSlide} /><ProjectCarousel kind={project.visual} name={project.name} /></div></article>;
}

export function TechnologyGroup({ group, index }: { group: (typeof technologyGroups)[number]; index: number }) {
  return <article className={`tech-group reveal ${"featured" in group && group.featured ? "tech-group--featured" : ""}`}><span>0{index + 1}</span><h3>{group.title}</h3><div>{group.items.map(item => <p key={item}>{item}</p>)}</div></article>;
}

export function SocialLink({ href, children, icon, variant }: { href: string; children: React.ReactNode; icon?: React.ReactNode; variant: "github" | "linkedin" | "instagram" | "email" | "whatsapp" }) {
  const unavailable = href === "#" || href.includes("exemplo.com");
  const external = href.startsWith("http");
  return <a className={`social-link social-link--${variant}`} href={unavailable ? undefined : href} aria-disabled={unavailable} title={unavailable ? "Link pronto para configurar" : undefined} target={!unavailable && external ? "_blank" : undefined} rel={!unavailable && external ? "noreferrer" : undefined}><span>{icon}{children}{unavailable && <small>CONFIGURAR</small>}</span><ArrowUpRight /></a>;
}

export function Footer() {
  return <footer><div><strong>Luiz Mesquita</strong><span>Backend Developer</span></div><p>Python / Django / APIs</p><p>© {new Date().getFullYear()} — Feito com código &amp; café.</p></footer>;
}

export function Portfolio() {
  const [active, setActive] = useState("inicio");
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (!("IntersectionObserver" in window)) {
      reveals.forEach(item => item.classList.add("is-visible"));
      return;
    }

    const sectionObserver = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach(section => sectionObserver.observe(section));

    const show = (item: Element) => {
      item.classList.remove("reveal--pending");
      item.classList.add("is-visible");
    };
    reveals.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= window.innerHeight * .98 && rect.bottom >= 0) show(item);
      else item.classList.add("reveal--pending");
    });

    const revealObserver = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        revealObserver.unobserve(entry.target);
      }),
      { threshold: .01, rootMargin: "0px 0px -2% 0px" },
    );
    reveals.forEach(item => {
      if (!item.classList.contains("is-visible")) revealObserver.observe(item);
    });

    let fallbackFrame = 0;
    const revealVisibleFallback = () => {
      fallbackFrame = 0;
      reveals.forEach(item => {
        if (!item.classList.contains("reveal--pending")) return;
        const rect = item.getBoundingClientRect();
        if (rect.top <= window.innerHeight * .98 && rect.bottom >= 0) show(item);
      });
    };
    const scheduleFallback = () => {
      if (!fallbackFrame) fallbackFrame = window.requestAnimationFrame(revealVisibleFallback);
    };
    window.addEventListener("scroll", scheduleFallback, { passive: true });
    window.addEventListener("resize", scheduleFallback);
    scheduleFallback();

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("scroll", scheduleFallback);
      window.removeEventListener("resize", scheduleFallback);
      if (fallbackFrame) window.cancelAnimationFrame(fallbackFrame);
    };
  }, []);

  useEffect(() => {
    const canRunTour = window.matchMedia("(min-width: 901px)").matches;
    if (!canRunTour || window.location.hash || window.scrollY > 24) return;

    let cancelled = false;
    let scrollFrame = 0;
    const cancelTour = () => {
      cancelled = true;
      window.clearTimeout(tourTimer);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      removeCancellationListeners();
    };
    const removeCancellationListeners = () => {
      window.removeEventListener("wheel", cancelTour);
      window.removeEventListener("touchstart", cancelTour);
      window.removeEventListener("pointerdown", cancelTour);
      window.removeEventListener("keydown", cancelTour);
    };
    const tourTimer = window.setTimeout(() => {
      if (cancelled) return;
      const aboutSection = document.getElementById("sobre");
      if (!aboutSection) return;
      const sectionTop = window.scrollY + aboutSection.getBoundingClientRect().top;
      const startY = window.scrollY;
      const targetY = Math.max(0, sectionTop - 84);
      const distance = targetY - startY;
      const duration = 1800;
      const startedAt = performance.now();
      const animateScroll = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) scrollFrame = window.requestAnimationFrame(animateScroll);
        else removeCancellationListeners();
      };
      scrollFrame = window.requestAnimationFrame(animateScroll);
    }, 3000);

    window.addEventListener("wheel", cancelTour, { passive: true });
    window.addEventListener("touchstart", cancelTour, { passive: true });
    window.addEventListener("pointerdown", cancelTour, { passive: true });
    window.addEventListener("keydown", cancelTour);

    return () => {
      window.clearTimeout(tourTimer);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      removeCancellationListeners();
    };
  }, []);

  return <><Navbar active={active} onNavigate={setActive} /><AmbientMeta /><ScrollToTop /><main>
    <section id="inicio" className="hero"><SectionCorners /><HeroParticles /><div className="orbit orbit--hero" aria-hidden="true" /><div className="hero__eyebrow"><span>PORTFÓLIO / 2026</span><span>BASED IN BRAZIL</span></div><h1><span>backend</span><span>developer<i className="hero-cursor" aria-hidden="true" /></span></h1><div className="hero__bottom"><div><p>Desenvolvo aplicações backend, integrações com APIs e sistemas focados em automação e organização de dados.</p><div className="tag-list"><span>Python</span><span>Django</span><span>APIs</span><span>Automação</span></div></div><div className="hero__actions"><Button href="#projetos">Ver projetos</Button><Button href={profile.github} variant="outline">GitHub</Button></div></div><a className="scroll-cue" href="#projetos" aria-label="Rolar até projetos"><ArrowDown /><span>SCROLL</span></a></section>
    <section id="sobre" className="section about-section reveal reveal--section"><SectionCorners /><div className="orbit orbit--about" aria-hidden="true" /><SectionTitle index="01">Sobre mim</SectionTitle><div className="about-grid"><div className="about-copy reveal"><p className="lead">Olá, sou Luiz Mesquita, desenvolvedor com foco em <em>backend.</em></p><p>Atualmente desenvolvo projetos principalmente utilizando Python e venho aprofundando meus conhecimentos em desenvolvimento web, APIs, bancos de dados, automação e arquitetura de software.</p><p>Gosto de transformar problemas em aplicações funcionais, organizadas e fáceis de manter.</p></div><div className="identity-card identity-card--portrait reveal"><img className="identity-photo" src="profile/luiz-mesquita.png" alt="Luiz Mesquita" loading="lazy" decoding="async" /><div className="identity-card__portrait-copy"><span>BACKEND DEVELOPER</span><strong>Luiz Mesquita</strong><p>Construindo, aprendendo,<br />evoluindo.</p><code>Python · APIs · Automação</code></div></div></div></section>
    <section id="projetos" className="section projects-section reveal reveal--section"><SectionCorners /><SectionTitle index="02">Projetos selecionados</SectionTitle><ProjectCard project={projects[0]} /><ProjectCard project={projects[1]} reverse /><article className="coming-soon reveal"><span>03</span><div><small>EM DESENVOLVIMENTO</small><h3>Novos projetos backend e APIs em desenvolvimento.</h3></div><code>{"{ work_in_progress: true }"}</code></article></section>
    <section id="tecnologias" className="section tech-section reveal reveal--section"><SectionCorners /><SectionTitle index="03">Tecnologias</SectionTitle><div className="tech-intro"><h2>ferramentas<br />de trabalho<span>.</span></h2><p>Algumas tecnologias que utilizo nos meus projetos.</p></div><div className="tech-grid">{technologyGroups.map((group, index) => <TechnologyGroup key={group.title} group={group} index={index} />)}</div></section>
    <section id="github" className="section github-section reveal reveal--section"><SectionCorners /><div className="github-code" role="img" aria-label="def build_future(): learn(), ship(), repeat()"><span className="github-code__signature">def build_future():</span><div className="github-code__wheel" aria-hidden="true"><div className="github-code__wheel-track"><span>&nbsp;&nbsp;repeat()</span><span>&nbsp;&nbsp;learn()</span><span>&nbsp;&nbsp;ship()</span><span>&nbsp;&nbsp;repeat()</span><span>&nbsp;&nbsp;learn()</span><span>&nbsp;&nbsp;ship()</span></div></div></div><div className="github-copy reveal"><span>04 / OPEN SOURCE</span><h2>CODE<span>.</span></h2><p>Além dos projetos apresentados aqui, mantenho outros estudos, experimentos e projetos disponíveis no GitHub.</p><Button href={profile.github}>Explorar GitHub</Button></div></section>
    <section id="contato" className="section contact-section reveal reveal--section"><SectionCorners /><div className="orbit orbit--contact" aria-hidden="true" /><span className="contact-index">05 / CONTATO</span><h2>VAMOS<br /><span>CONVERSAR</span><i>?</i></h2><p>Tem uma oportunidade, projeto ou quer conversar sobre desenvolvimento?</p><div className="social-list"><SocialLink href={profile.github} icon={<Code2 />} variant="github">GitHub</SocialLink><SocialLink href={profile.linkedin} icon={<BriefcaseBusiness />} variant="linkedin">LinkedIn</SocialLink><SocialLink href={profile.instagram} icon={<Camera />} variant="instagram">Instagram</SocialLink><SocialLink href={profile.email} icon={<Mail />} variant="email">E-mail</SocialLink><SocialLink href={profile.whatsapp} icon={<MessageCircle />} variant="whatsapp">WhatsApp</SocialLink></div></section>
  </main><Footer /></>;
}

