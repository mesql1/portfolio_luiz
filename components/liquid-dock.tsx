"use client";

import { useCallback, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";

export type LiquidDockItem = readonly [id: string, label: string, icon: LucideIcon];

const BASE_SIZE = 44;
const MAX_SIZE = 80;
const MAGNET_RADIUS = 150;

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
  const pointerX = useRef<number | null>(null);
  const focusedIndex = useRef<number | null>(null);
  const sizes = useRef<number[]>([]);
  const velocities = useRef<number[]>([]);
  const frame = useRef(0);

  const animate = useCallback(() => {
    frame.current = 0;
    const links = linkRefs.current;
    if (!links.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focusLink = focusedIndex.current === null ? null : links[focusedIndex.current];
    const focusRect = focusLink?.getBoundingClientRect();
    const interactionX = pointerX.current ?? (
      focusRect ? focusRect.left + focusRect.width / 2 : null
    );
    let unsettled = false;

    links.forEach((link, index) => {
      if (!link) return;
      const rect = link.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = interactionX === null ? Number.POSITIVE_INFINITY : Math.abs(interactionX - center);
      const influence = reduced ? 0 : Math.max(0, 1 - distance / MAGNET_RADIUS);
      const target = BASE_SIZE + (MAX_SIZE - BASE_SIZE) * influence;

      const current = sizes.current[index] ?? BASE_SIZE;
      let velocity = velocities.current[index] ?? 0;
      velocity = velocity * 0.68 + (target - current) * 0.16;
      let next = current + velocity;

      if (Math.abs(target - next) < 0.02 && Math.abs(velocity) < 0.02) {
        next = target;
        velocity = 0;
      } else {
        unsettled = true;
      }

      sizes.current[index] = next;
      velocities.current[index] = velocity;
      link.style.setProperty("--dock-size", next.toFixed(3) + "px");
      link.style.setProperty("--dock-influence", influence.toFixed(4));
      link.style.zIndex = String(1 + Math.round(influence * 10));
    });

    if (unsettled) frame.current = window.requestAnimationFrame(animate);
  }, []);

  const schedule = useCallback(() => {
    if (!frame.current) frame.current = window.requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    sizes.current = items.map(() => BASE_SIZE);
    velocities.current = items.map(() => 0);
    schedule();

    const reset = () => {
      pointerX.current = null;
      schedule();
    };
    window.addEventListener("resize", reset);
    return () => {
      window.removeEventListener("resize", reset);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [items, schedule]);

  return <header className="nav-shell">
    <nav
      ref={navRef}
      className="nav-links nav-links--dock nav-links--liquid nav-links--fisheye"
      aria-label="Navegação principal"
      onPointerEnter={event => {
        if (event.pointerType === "touch") return;
        pointerX.current = event.clientX;
        schedule();
      }}
      onPointerMove={event => {
        if (event.pointerType === "touch") return;
        pointerX.current = event.clientX;
        schedule();
      }}
      onPointerLeave={() => {
        pointerX.current = null;
        schedule();
      }}
    >
      {items.map(([id, label, Icon], index) => <a
        ref={node => { linkRefs.current[index] = node; }}
        key={id}
        className={active === id ? "active" : ""}
        href={"#" + id}
        aria-label={label}
        aria-current={active === id ? "location" : undefined}
        onFocus={() => {
          focusedIndex.current = index;
          pointerX.current = null;
          schedule();
        }}
        onBlur={() => {
          focusedIndex.current = null;
          schedule();
        }}
        onClick={() => onNavigate(id)}
      >
        <span className="nav-orb" aria-hidden="true">
          <Icon />
        </span>
        <small>{label}</small>
        <i aria-hidden="true" />
      </a>)}
    </nav>
  </header>;
}
