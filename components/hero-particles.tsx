"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  rotation: number;
  spin: number;
  shape: "dot" | "dash" | "square";
  color: string;
};

const colors = ["#e8c56a", "#d98b73", "#91a8cf", "#93ae91", "#c5a0c5"];

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const particles: Particle[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let lastTime = 0;
    let pointerX = -1;
    let pointerY = -1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.min(96, Math.max(34, Math.round((width * height) / 18000)));
      particles.length = 0;
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 1 + Math.random() * 2.1,
          speed: 5 + Math.random() * 15,
          drift: (Math.random() - 0.5) * 12,
          phase: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.7,
          shape: (["dot", "dash", "square"] as const)[Math.floor(Math.random() * 3)],
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const drawParticle = (particle: Particle) => {
      const pulse = 0.45 + (Math.sin(particle.phase) + 1) * 0.2;
      context.globalAlpha = pulse;
      context.fillStyle = particle.color;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      if (particle.shape === "dash") {
        context.fillRect(-particle.size * 2.1, -particle.size * 0.45, particle.size * 4.2, particle.size * 0.9);
      } else if (particle.shape === "square") {
        context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      } else {
        context.beginPath();
        context.arc(0, 0, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      context.setTransform(Math.min(window.devicePixelRatio || 1, 2), 0, 0, Math.min(window.devicePixelRatio || 1, 2), 0, 0);
    };

    const draw = (time: number) => {
      if (document.hidden) {
        animationFrame = 0;
        return;
      }

      const delta = Math.min((time - (lastTime || time)) / 1000, 0.04);
      lastTime = time;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const influenceX = pointerX < 0 ? 0 : (particle.x - pointerX) * 0.008;
        const influenceY = pointerY < 0 ? 0 : (particle.y - pointerY) * 0.008;
        particle.y -= particle.speed * delta;
        particle.x += (particle.drift + influenceX) * delta;
        particle.y += influenceY * delta;
        particle.rotation += particle.spin * delta;
        particle.phase += delta * 1.5;

        if (particle.y < -12) {
          particle.y = height + 8;
          particle.x = Math.random() * width;
        }
        if (particle.x < -12) particle.x = width + 8;
        if (particle.x > width + 12) particle.x = -8;
        drawParticle(particle);
      }

      context.globalAlpha = 1;
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
    const handleMotionPreference = () => reducedMotion.matches ? stop() : start();
    const handleVisibility = () => document.hidden ? stop() : start();
    const handlePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const clearPointer = () => {
      pointerX = -1;
      pointerY = -1;
    };

    resize();
    start();
    window.addEventListener("resize", resize, { passive: true });
    canvas.addEventListener("pointermove", handlePointer, { passive: true });
    canvas.addEventListener("pointerleave", clearPointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />;
}

