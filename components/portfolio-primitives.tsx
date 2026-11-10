"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function AmbientMeta() {
  const [time, setTime] = useState("");
  const [viewport, setViewport] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(formatTime(new Date()));
    const updateViewport = () => setViewport(`${window.innerWidth} × ${window.innerHeight}`);
    updateTime();
    updateViewport();
    const timer = window.setInterval(updateTime, 30_000);
    window.addEventListener("resize", updateViewport);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  return <aside className="ambient-meta" aria-label="Informações da página">
    <span><i aria-hidden="true" />São Paulo · {time || "--:--"}</span>
    <span>{viewport || "carregando viewport"}</span>
  </aside>;
}

export function SectionCorners() {
  return <div className="section-corners" aria-hidden="true">
    <i className="section-corners__top-left" />
    <i className="section-corners__top-right" />
    <i className="section-corners__bottom-left" />
    <i className="section-corners__bottom-right" />
  </div>;
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * .7);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <button
    className={`scroll-top ${visible ? "is-visible" : ""}`}
    type="button"
    aria-label="Voltar ao topo"
    aria-hidden={!visible}
    tabIndex={visible ? 0 : -1}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  ><ArrowUp aria-hidden="true" /></button>;
}
