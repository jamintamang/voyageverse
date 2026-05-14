import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scrolling via Lenis (Arc-like feel).
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
    });

    let raf = 0;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);
}
