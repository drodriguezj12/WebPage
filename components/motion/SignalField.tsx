"use client";

import { useEffect, useRef } from "react";
import { useMotionAllowed } from "@/lib/useReducedMotion";

const ACCENTS = ["#f0429f", "#c99a1c", "#3ecf8e"];
const LINK_DISTANCE = 170;
const POINTER_DISTANCE = 220;

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Packet = { from: Node; to: Node; t: number; speed: number; color: string };

/**
 * The hero's backdrop: a slowly drifting network of nodes with messages
 * travelling between them in the three project colours. It leans towards the
 * pointer, which joins the network as one more node.
 *
 * Canvas 2D rather than WebGL: a few dozen points and lines need no shader,
 * and this costs no extra dependency. The loop stops when the hero is off
 * screen or the tab is hidden, and never starts under reduced motion.
 */
export function SignalField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { animate } = useMotionAllowed();

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !animate) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let frame = 0;
    let last = 0;
    let sinceSpawn = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      const count = Math.round(Math.min(58, Math.max(16, (width * height) / 21000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.018,
        vy: (Math.random() - 0.5) * 0.018,
        r: 1.4 + Math.random() * 1.4,
      }));
      packets = [];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const spawn = () => {
      if (packets.length >= 9) return;
      const from = nodes[Math.floor(Math.random() * nodes.length)];
      const near = nodes.filter(
        (node) => node !== from && Math.hypot(node.x - from.x, node.y - from.y) < LINK_DISTANCE,
      );
      if (near.length === 0) return;
      packets.push({
        from,
        to: near[Math.floor(Math.random() * near.length)],
        t: 0,
        speed: 0.0006 + Math.random() * 0.0005,
        color: ACCENTS[Math.floor(Math.random() * ACCENTS.length)],
      });
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      // Clamp the step so a background tab does not teleport everything.
      const dt = Math.min(now - (last || now), 48);
      last = now;

      context.clearRect(0, 0, width, height);

      for (const node of nodes) {
        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < POINTER_DISTANCE && distance > 1) {
            node.vx += (dx / distance) * 0.00004 * dt;
            node.vy += (dy / distance) * 0.00004 * dt;
          }
        }
        // Light drag keeps the pointer's pull from accumulating.
        node.vx *= 0.995;
        node.vy *= 0.995;
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      context.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > LINK_DISTANCE) continue;
          context.strokeStyle = `rgba(29,29,31,${(1 - distance / LINK_DISTANCE) * 0.22})`;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
        if (pointer.active) {
          const distance = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (distance < POINTER_DISTANCE) {
            context.strokeStyle = `rgba(29,29,31,${(1 - distance / POINTER_DISTANCE) * 0.34})`;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(pointer.x, pointer.y);
            context.stroke();
          }
        }
      }

      context.fillStyle = "rgba(29,29,31,0.42)";
      for (const node of nodes) {
        context.beginPath();
        context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        context.fill();
      }

      sinceSpawn += dt;
      if (sinceSpawn > 420) {
        sinceSpawn = 0;
        spawn();
      }

      packets = packets.filter((packet) => packet.t < 1);
      for (const packet of packets) {
        packet.t += packet.speed * dt;
        const t = Math.min(packet.t, 1);
        const x = packet.from.x + (packet.to.x - packet.from.x) * t;
        const y = packet.from.y + (packet.to.y - packet.from.y) * t;
        context.globalAlpha = 0.22;
        context.fillStyle = packet.color;
        context.beginPath();
        context.arc(x, y, 7, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
        context.beginPath();
        context.arc(x, y, 2.8, 0, Math.PI * 2);
        context.fill();
      }
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        event.pointerType === "mouse" &&
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    viewObserver.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      sizeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [animate]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
