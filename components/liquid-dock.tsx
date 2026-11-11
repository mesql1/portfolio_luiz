"use client";

import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

export type LiquidDockItem = readonly [id: string, label: string, icon: LucideIcon];

const BASE_SIZE = 44;
const MAX_SIZE = 80;
const MAGNET_RADIUS = 150;

function DockItem({ id, label, Icon, active, mouseX, onNavigate }: {
  id: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onNavigate: (id: string) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const distance = useTransform(mouseX, value => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Number.POSITIVE_INFINITY;
    return value - bounds.left - bounds.width / 2;
  });
  const sizeTarget = useTransform(distance, [-MAGNET_RADIUS, 0, MAGNET_RADIUS], [BASE_SIZE, MAX_SIZE, BASE_SIZE]);
  const size = useSpring(sizeTarget, { mass: 0.1, stiffness: 150, damping: 12 });
  const influence = useTransform(size, [BASE_SIZE, MAX_SIZE], [0, 1]);
  const iconScale = useTransform(influence, [0, 1], [1, 1.16]);
  const orbOpacity = useTransform(influence, [0, 1], [0.72, 1]);

  return <motion.a
    ref={ref}
    href={"#" + id}
    className={active ? "active" : ""}
    aria-label={label}
    aria-current={active ? "location" : undefined}
    style={{ width: size, height: size, flexBasis: size }}
    onHoverStart={() => setHovered(true)}
    onHoverEnd={() => setHovered(false)}
    onFocus={() => {
      const bounds = ref.current?.getBoundingClientRect();
      if (bounds) mouseX.set(bounds.left + bounds.width / 2);
      setHovered(true);
    }}
    onBlur={() => {
      mouseX.set(Number.POSITIVE_INFINITY);
      setHovered(false);
    }}
    onClick={() => onNavigate(id)}
    whileTap={{ y: 3, transition: { duration: 0.08 } }}
  >
    <motion.span className="nav-orb" aria-hidden="true" style={{ opacity: orbOpacity }}>
      <motion.span className="nav-orb__icon" style={{ scale: iconScale }}><Icon /></motion.span>
    </motion.span>
    <AnimatePresence>
      {hovered && <motion.small
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.98 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >{label}</motion.small>}
    </AnimatePresence>
    <i aria-hidden="true" />
  </motion.a>;
}

export function LiquidDock({ items, active, onNavigate }: {
  items: readonly LiquidDockItem[];
  active: string;
  onNavigate: (id: string) => void;
}) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  return <header className="nav-shell">
    <motion.nav
      className="nav-links nav-links--dock nav-links--liquid nav-links--fisheye nav-links--integrated"
      aria-label="Navegação principal"
      onMouseMove={event => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
    >
      {items.map(([id, label, Icon]) => <DockItem
        key={id}
        id={id}
        label={label}
        Icon={Icon}
        active={active === id}
        mouseX={mouseX}
        onNavigate={onNavigate}
      />)}
    </motion.nav>
  </header>;
}
