"use client";

import { useEffect, useRef } from "react";

type Point = {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  phase: number;
  size: number;
  color: string;
};

type Edge = { from: number; to: number };

const pointColor = "#ffffff";

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    const hero = canvas?.parentElement;
    if (!canvas || !context || !hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const points: Point[] = [];
    const edges: Edge[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let lastTime = 0;
    let elapsed = 0;
    let pointerX = -1;
    let pointerY = -1;
    let pointerActive = false;
    let pointerEnergy = 0;
    let previousPointerX = -1;
    let previousPointerY = -1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const spacing = Math.max(30, Math.min(42, width / 29));
      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      points.length = 0;
      edges.length = 0;

      for (let row = 0; row <= rows; row += 1) {
        for (let column = 0; column <= columns; column += 1) {
          const anchorX = column * spacing - spacing / 2 + (Math.random() - 0.5) * 9;
          const anchorY = row * spacing - spacing / 2 + (Math.random() - 0.5) * 9;
          points.push({
            anchorX,
            anchorY,
            x: anchorX,
            y: anchorY,
            phase: Math.random() * Math.PI * 2,
            size: 1 + Math.random() * 0.8,
            color: pointColor,
          });
        }
      }

      const indexAt = (row: number, column: number) => row * (columns + 1) + column;
      for (let row = 0; row <= rows; row += 1) {
        for (let column = 0; column <= columns; column += 1) {
          const from = indexAt(row, column);
          if (column < columns) edges.push({ from, to: indexAt(row, column + 1) });
          if (row < rows) edges.push({ from, to: indexAt(row + 1, column) });
          if (row < rows && column < columns && (row + column) % 2 === 0) {
            edges.push({ from, to: indexAt(row + 1, column + 1) });
          }
        }
      }
    };

    const render = () => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);

      const influenceRadius = Math.min(190, Math.max(125, width * 0.14));
      for (const edge of edges) {
        const from = points[edge.from];
        const to = points[edge.to];
        const middleX = (from.x + to.x) / 2;
        const middleY = (from.y + to.y) / 2;
        const dx = pointerActive ? middleX - pointerX : influenceRadius;
        const dy = pointerActive ? middleY - pointerY : influenceRadius;
        const distance = Math.hypot(dx, dy);
        const glow = pointerActive ? Math.max(0, 1 - distance / influenceRadius) : 0;
        context.globalAlpha = 0;
        context.strokeStyle = "#ffffff";
        context.lineWidth = 0.55 + glow * 0.55;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      }

      for (const point of points) {
        const dx = pointerActive ? point.anchorX - pointerX : 0;
        const dy = pointerActive ? point.anchorY - pointerY : 0;
        const distance = Math.hypot(dx, dy);
        const influence = pointerActive ? Math.max(0, 1 - distance / influenceRadius) : 0;
        const push = influence * influence * 38 * pointerEnergy;
        const angle = Math.atan2(dy, dx);
        const idleX = Math.sin(elapsed * 0.8 + point.phase) * 1.8;
        const idleY = Math.cos(elapsed * 0.65 + point.phase) * 1.8;
        const targetX = point.anchorX + Math.cos(angle) * push + idleX;
        const targetY = point.anchorY + Math.sin(angle) * push + idleY;
        point.x += (targetX - point.x) * 0.12;
        point.y += (targetY - point.y) * 0.12;

        context.globalAlpha = influence * pointerEnergy * 0.95;
        context.fillStyle = point.color;
        context.beginPath();
        context.arc(point.x, point.y, point.size + influence * 1.15 * pointerEnergy, 0, Math.PI * 2);
        context.fill();
      }

      if (pointerActive && pointerEnergy > 0.01) {
        const halo = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, influenceRadius * 0.68);
        halo.addColorStop(0, `rgba(187, 205, 239, ${0.1 * pointerEnergy})`);
        halo.addColorStop(1, "rgba(187, 205, 239, 0)");
        context.globalAlpha = 1;
        context.fillStyle = halo;
        context.beginPath();
        context.arc(pointerX, pointerY, influenceRadius * 0.68, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    const draw = (time: number) => {
      if (document.hidden) {
        animationFrame = 0;
        return;
      }

      const delta = Math.min((time - (lastTime || time)) / 1000, 0.04);
      lastTime = time;
      elapsed += delta;
      pointerEnergy += ((pointerActive ? 1 : 0) - pointerEnergy) * Math.min(1, delta * 7);
      render();
      animationFrame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (animationFrame || reducedMotion.matches || document.hidden) return;
      lastTime = 0;
      animationFrame = window.requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };
    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        stop();
        render();
      } else {
        start();
      }
    };
    const handleVisibility = () => document.hidden ? stop() : start();
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      if (previousPointerX >= 0) {
        const distance = Math.hypot(pointerX - previousPointerX, pointerY - previousPointerY);
        pointerEnergy = Math.min(1, pointerEnergy + distance * 0.008);
      }
      previousPointerX = pointerX;
      previousPointerY = pointerY;
      pointerActive = true;
      if (reducedMotion.matches) render();
    };
    const handlePointerLeave = () => {
      pointerActive = false;
      previousPointerX = -1;
      previousPointerY = -1;
      if (reducedMotion.matches) render();
    };

    resize();
    render();
    start();
    window.addEventListener("resize", resize, { passive: true });
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />;
}

