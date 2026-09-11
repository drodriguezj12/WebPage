"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

const VERTEX = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Slow drifting bands, warped near the pointer. Cheap: no loops, no textures.
const FRAGMENT = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uResolution;

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vec2(vUv.x * aspect, vUv.y);
    vec2 pointer = vec2(uPointer.x * aspect, uPointer.y);

    float distance = length(uv - pointer);
    float warp = 0.06 / (distance + 0.35);

    float band = sin((uv.x + uv.y) * 6.0 - uTime * 0.15 + warp * 6.0);
    float line = smoothstep(0.985, 1.0, band);

    // Steel, at the edge of visible. The background must never fight the type.
    vec3 colour = vec3(0.796, 0.835, 0.882) * line;
    gl_FragColor = vec4(colour, line * 0.16);
  }
`;

export default function ShaderField({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maybeMount = holder.current;
    if (!maybeMount) return;
    // TypeScript does not narrow a const across nested function declarations
    // (resize, below), so rebind once with an explicit non-null type here.
    const mount: HTMLDivElement = maybeMount;

    // OGL's Renderer sets `gl.renderer = this` unconditionally, even when
    // getContext returned null (hardware acceleration off, blocked GPU, a
    // VM without WebGL) — so construction throws instead of failing softly.
    // Nothing has touched the DOM yet at this point, so on failure there is
    // nothing to clean up: render nothing and register no listeners/loops.
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        antialias: false,
        // A retina pixel ratio quadruples the fragment work for a background
        // nobody is looking at directly.
        dpr: Math.min(window.devicePixelRatio, 1.5),
      });
      if (!renderer.gl) throw new Error("WebGL context unavailable");
    } catch (error) {
      console.error("ShaderField: WebGL renderer unavailable; skipping the background.", error);
      return;
    }
    const gl = renderer.gl;
    gl.canvas.setAttribute("aria-hidden", "true");
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    mount.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: [0.5, 0.5] },
        uResolution: { value: [1, 1] },
      },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    function resize() {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      program.uniforms.uResolution.value = [mount.clientWidth, mount.clientHeight];
    }
    resize();
    window.addEventListener("resize", resize);

    function onPointer(event: PointerEvent) {
      program.uniforms.uPointer.value = [
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      ];
    }
    window.addEventListener("pointermove", onPointer);

    // Two independent conditions. Combining them with AND is the point: a
    // single shared flag lets whichever fired last decide, so returning to the
    // tab would resume a shader whose section is still off-screen.
    let inViewport = true;
    let tabVisible = true;

    let frame = 0;
    let last = 0;
    const MIN_STEP = 1000 / 30;

    function loop(now: number) {
      // Ending the chain here is the point: an off-screen background that
      // keeps waking every frame is exactly the cost this design avoids.
      if (!inViewport || !tabVisible) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(loop);
      if (now - last < MIN_STEP) return;
      last = now;
      program.uniforms.uTime.value = now * 0.001;
      renderer.render({ scene: mesh });
    }

    function start() {
      if (!frame) frame = requestAnimationFrame(loop);
    }

    function stop() {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    function sync() {
      if (inViewport && tabVisible) start();
      else stop();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(mount);

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={holder} className={className} aria-hidden="true" />;
}
