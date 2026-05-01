import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useStatsAnimation(isReady: boolean) {
  const trackedRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const avgRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isReady) return;
    
    const elements = [trackedRef.current, totalRef.current, avgRef.current];
    if (elements.some((e) => !e) || !statsRef.current) return;

    // Reset initial state
    gsap.set(trackedRef.current, { x: 120, opacity: 0 });
    gsap.set(totalRef.current, { y: 40, opacity: 0 });
    gsap.set(avgRef.current, { x: -120, opacity: 0 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    timeline
      .to(trackedRef.current, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" })
      .to(avgRef.current, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "<0.15")
      .to(totalRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "<0.2");

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, [isReady]);

  return { trackedRef, totalRef, avgRef, statsRef };
}
