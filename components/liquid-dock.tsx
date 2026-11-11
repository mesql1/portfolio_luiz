"use client";

import { useCallback, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";

export type LiquidDockItem = readonly [id: string, label: string, icon: LucideIcon];

export function LiquidDock({
  items,
  active,
  onNavigate,
}: {
  items: readonly LiquidDockItem[];
  active: string;
  onNavigate: (id: string) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const orbRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const lensRef = useRef<HTMLSpanElement>(null);
  const pointerX = useRef<number | null>(null);
  const smoothX = useRef<number | null>(null);
  const velocity = useRef(0);
  const frame = useRef(0);
  const hovering = useRef(false);
  const focusedIndex = useRef<number | null>(null);
  const activeIndex = items.findIndex(([id]) => id === active);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const animate: () => void = useCallback(() => {
    frame.current = 0;
    const nav = navRef.current;
    const links = linkRefs.current;
    const lens = lensRef.current;
    if (!nav || !lens || !links.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const selectedIndex = focusedIndex.current ?? activeIndexRef.current;
    const selected = selectedIndex >= 0 ? links[selectedIndex] : null;
    const targetX = !reduced && hovering.current && pointerX.current !== null
      ? pointerX.current
      : selected
        ? selected.getBoundingClientRect().left + selected.getBoundingClientRect().width / 2
        : null;

    if (targetX === null) {
      lens.style.opacity = "0";
      orbRefs.current.forEach(orb => {
        if (!orb) return;
        orb.style.transform = "translate3d(0,0,0) scale(.78)";
        orb.style.opacity = ".68";
      });
      smoothX.current = null;
      velocity.current = 0;
      return;
    }

    if (smoothX.current === null || reduced) smoothX.current = targetX;
    const delta = targetX - smoothX.current;
    velocity.current = reduced ? 0 : velocity.current * .7 + delta * .14;
    smoothX.current += velocity.current;

    const currentX = smoothX.current;
    links.forEach((link, index) => {
      const orb = orbRefs.current[index];
      if (!link || !orb) return;
      const rect = link.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(center - currentX);
      const influence = reduced
        ? index === selectedIndex ? 1 : 0
        : Math.max(0, 1 - distance / 92);
      const scale = .78 + influence * .38;
      const lift = -8 * influence;
      orb.style.transform = `translate3d(0,${lift.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
      orb.style.opacity = (.68 + influence * .32).toFixed(3);
    });

    const navRect = nav.getBoundingClientRect();
    const lensWidth = lens.offsetWidth;
    const lensX = Math.min(
      navRect.width - lensWidth - 8,
      Math.max(8, currentX - navRect.left - lensWidth / 2),
    );
    lens.style.opacity = "1";
    lens.style.transform = `translate3d(${lensX.toFixed(2)}px,0,0) scale(.94)`;

    if (!reduced && (hovering.current || Math.abs(delta) > .1 || Math.abs(velocity.current) > .1)) {
      frame.current = window.requestAnimationFrame(animate);
    }
  }, []);

  const schedule = useCallback(() => {
    if (!frame.current) frame.current = window.requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    schedule();
    const update = () => {
      smoothX.current = null;
      schedule();
    };
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [active, schedule]);

  return <header className="nav-shell">
    <nav
      ref={navRef}
      className="nav-links nav-links--dock nav-links--liquid nav-links--cursor"
      aria-label="Navegação principal"
      onPointerEnter={event => {
        if (event.pointerType === "touch") return;
        hovering.current = true;
        pointerX.current = event.clientX;
        schedule();
      }}
      onPointerMove={event => {
        if (event.pointerType === "touch") return;
        hovering.current = true;
        pointerX.current = event.clientX;
        schedule();
      }}
      onPointerLeave={() => {
        hovering.current = false;
        pointerX.current = null;
        schedule();
      }}
    >
      <span ref={lensRef} className="nav-liquid-lens" aria-hidden="true" />
      {items.map(([id, label, Icon], index) => <a
        ref={node => { linkRefs.current[index] = node; }}
        key={id}
        className={active === id ? "active" : ""}
        href={`#${id}`}
        aria-label={label}
        aria-current={active === id ? "location" : undefined}
        onFocus={() => {
          focusedIndex.current = index;
          hovering.current = false;
          schedule();
        }}
        onBlur={() => {
          focusedIndex.current = null;
          schedule();
        }}
        onClick={() => onNavigate(id)}
      >
        <span ref={node => { orbRefs.current[index] = node; }} className="nav-orb">
          <Icon aria-hidden="true" />
        </span>
        <small>{label}</small>
        <i aria-hidden="true" />
      </a>)}
    </nav>
  </header>;
}
