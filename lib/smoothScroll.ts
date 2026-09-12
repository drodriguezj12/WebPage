import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { registerScroller } from "./scrollControl";

/**
 * Lenis and ScrollTrigger both want to own the frame loop. Left alone they
 * drift apart and pinned sections lag behind the page by a frame or two, which
 * reads as jitter. Driving Lenis from GSAP's ticker keeps one clock.
 *
 * Returns a teardown; call it on unmount.
 */
export function startSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.05,
    // Long, slow exit. Matches the easing of everything else on the page.
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  // GSAP's lag smoothing skips frames to catch up, which desynchronises Lenis.
  gsap.ticker.lagSmoothing(0);

  // Route programmatic scrolls (e.g. focus jumping to a pinned beat) through
  // Lenis: it only adopts an external scroll position while idle, so a native
  // window.scrollTo mid-flight would be overridden on the next frame.
  registerScroller((top) => lenis.scrollTo(top, { immediate: true, force: true }));

  return () => {
    registerScroller(null);
    gsap.ticker.remove(raf);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}
