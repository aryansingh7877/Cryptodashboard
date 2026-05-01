import { useEffect, useRef } from "react";

/**
 * Updates the indicator outside React state so scroll stays smooth under load.
 */
export function ScrollIndicator() {
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? root.scrollTop / max : 0;

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress})`;
      }

      if (dotRef.current) {
        dotRef.current.style.top = `${progress * 100}%`;
      }
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-3 top-0 z-50 hidden h-screen w-[3px] sm:block"
    >
      <div className="absolute inset-0 rounded-full bg-border/30" />
      <div
        ref={fillRef}
        className="absolute left-0 top-0 h-full w-full rounded-full"
        style={{
          background: "linear-gradient(to bottom, #00e5ff, #00b3ff 50%, #3a7bff)",
          boxShadow: "0 0 8px #00e5ff, 0 0 16px #00b3ff, 0 0 28px rgba(0,179,255,0.7)",
          transform: "scaleY(0)",
          transformOrigin: "top",
        }}
      />
      <div
        ref={dotRef}
        className="absolute left-1/2 flex items-center justify-center rounded-lg bg-gradient-primary shadow-glow"
        style={{
          top: "0%",
          transform: "translate(-50%, -50%)",
          width: "20px",
          height: "20px",
        }}
      >
        <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v7l10 5 10-5v-7l-10 5z" />
        </svg>
      </div>
    </div>
  );
}
