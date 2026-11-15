import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Lenis and ScrollTrigger both want to own the frame loop. Left alone they
 * drift apart and scroll-linked sections lag the page by a frame or two, which
 * reads as jitter. Driving Lenis from GSAP's ticker keeps one clock.
 *
 * Returns a teardown; call it on unmount.
 */
export function startSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // In-page links glide instead of jumping.
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  // GSAP's lag smoothing skips frames to catch up, which desynchronises Lenis.
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}
