import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  visible: boolean;
  onHidden: () => void;
}

export function PageLoader({ visible, onHidden }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const hiddenFiredRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, subtitleRef.current], { y: 18, opacity: 0 });
      gsap.set(pulseRef.current, { scale: 0.85, opacity: 0.5 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(logoRef.current, { y: 0, opacity: 1, duration: 0.6 })
        .to(subtitleRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.28");

      gsap.to(pulseRef.current, {
        scale: 1.1,
        opacity: 1,
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.fromTo(
        progressFillRef.current,
        { xPercent: -100 },
        {
          xPercent: 100,
          duration: 1.35,
          ease: "none",
          repeat: -1,
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (visible || hiddenFiredRef.current) return;

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        hiddenFiredRef.current = true;
        onHidden();
      },
    });
  }, [visible, onHidden]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-120 flex items-center justify-center bg-[radial-gradient(circle_at_20%_10%,rgba(88,118,255,0.2),transparent_42%),radial-gradient(circle_at_85%_90%,rgba(0,229,255,0.14),transparent_40%),linear-gradient(180deg,rgba(8,15,30,0.995),rgba(7,12,24,0.995))]"
      aria-live="polite"
      role="status"
    >
      <div className="flex w-[min(88vw,420px)] flex-col items-center gap-4 rounded-3xl border border-border/70 bg-card/20 px-6 py-8 shadow-elevated backdrop-blur-sm">
        <div
          ref={pulseRef}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow"
        >
          <svg className="h-6 w-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v7l10 5 10-5v-7l-10 5z" />
          </svg>
        </div>

        <div ref={logoRef} className="text-center font-display text-2xl font-bold text-foreground">
          Nebula <span className="gradient-text">Markets</span>
        </div>

        <p ref={subtitleRef} className="text-center text-xs uppercase tracking-[0.26em] text-muted-foreground">
          Loading Dashboard
        </p>

        <div className="relative mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <div ref={progressFillRef} className="absolute inset-y-0 left-0 w-1/2 bg-gradient-primary" />
        </div>
      </div>
    </div>
  );
}
