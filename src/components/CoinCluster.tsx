import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import type { Coin } from "@/services/cryptoApi";

interface Props {
  coins: Coin[];
}

export function CoinCluster({ coins }: Props) {
  const [hovered, setHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );
  const orbitRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ringRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  const rotationTween = useRef<gsap.core.Tween | null>(null);

  const isPhone = viewportWidth < 480;
  const showPhoneToggle = viewportWidth < 640;
  const isCompact = viewportWidth < 768;
  const radius = isPhone ? 118 : isCompact ? 146 : 182;
  const orbitCoins = coins.slice(0, isPhone ? 8 : 12);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setViewportWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const elements = orbitRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!elements.length) return;

    if (hovered) {
      elements.forEach((element, index) => {
        const angle = -Math.PI / 2 - (index / elements.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        gsap.to(element, {
          x,
          y,
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: "elastic.out(1, 0.65)",
          delay: index * 0.02,
          overwrite: "auto",
        });
      });

      gsap.to(ringRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(stackRef.current, {
        scale: 0.84,
        opacity: 0.58,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (rotatorRef.current) {
        gsap.set(rotatorRef.current, { rotation: 0 });
        rotationTween.current?.kill();
        rotationTween.current = gsap.to(rotatorRef.current, {
          rotation: 360,
          duration: isPhone ? 20 : 16,
          ease: "none",
          repeat: -1,
          overwrite: "auto",
        });
      }
    } else {
      rotationTween.current?.kill();
      rotationTween.current = null;

      if (rotatorRef.current) {
        gsap.to(rotatorRef.current, {
          rotation: 0,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      elements.forEach((element, index) => {
        gsap.to(element, {
          x: 0,
          y: 0,
          scale: 0.4,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
          delay: index * 0.012,
          overwrite: "auto",
        });
      });

      gsap.to(ringRef.current, {
        opacity: 0,
        scale: 0.72,
        duration: 0.35,
        ease: "power2.in",
        overwrite: "auto",
      });

      gsap.to(stackRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    return () => {
      rotationTween.current?.kill();
    };
  }, [hovered, orbitCoins.length, radius, isPhone]);

  if (!orbitCoins.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(11,19,39,0.95),rgba(10,18,35,0.9))] shadow-soft"
      onMouseEnter={() => {
        if (!isCompact) {
          setHovered(true);
        }
      }}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" && !showPhoneToggle) {
          setHovered((value) => !value);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,123,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(0,229,255,0.08),transparent_26%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(50, 95, 171, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(50, 95, 171, 0.12) 1px, transparent 1px)",
          backgroundSize: isPhone ? "36px 36px" : "48px 48px",
        }}
      />

      <div className="relative flex h-[340px] items-center justify-center sm:h-[400px] lg:h-[460px]">
        <div
          ref={ringRef}
          className="pointer-events-none absolute rounded-full border border-primary/25 opacity-0"
          style={{
            width: isPhone ? 236 : isCompact ? 292 : 380,
            height: isPhone ? 236 : isCompact ? 292 : 380,
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--primary) 16%, transparent) 0%, transparent 68%)",
          }}
        />

        <div
          ref={rotatorRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          {(() => {
            orbitRefs.current.length = orbitCoins.length;

            return orbitCoins.map((coin, index) => (
              <div
                key={coin.id}
                ref={(element) => {
                  orbitRefs.current[index] = element;
                }}
                className="absolute opacity-0"
                style={{ transform: "translate(0,0) scale(0.4)" }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-10 w-10 rounded-full border border-border/70 bg-slate-950/80 p-1 shadow-elevated sm:h-11 sm:w-11 lg:h-12 lg:w-12"
                  />
                  <span className="rounded-full border border-white/8 bg-slate-950/70 px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    {coin.symbol}
                  </span>
                </div>
              </div>
            ));
          })()}
        </div>

        <div
          ref={stackRef}
          className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-[24px] border border-border/80 bg-[linear-gradient(180deg,rgba(12,23,43,0.98),rgba(11,20,38,0.94))] px-3 shadow-elevated sm:h-32 sm:w-32 sm:rounded-[26px] lg:h-36 lg:w-36"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,rgba(102,143,255,0.14),transparent_40%)]" />
          <div className="relative h-12 w-20 sm:h-12 sm:w-22 lg:h-14 lg:w-24">
            {orbitCoins.slice(0, 4).map((coin, index) => (
              <img
                key={coin.id}
                src={coin.image}
                alt={coin.name}
                className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-border/70 bg-slate-950/90 p-0.5 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                style={{ left: `${index * 14}px`, zIndex: 10 - index }}
              />
            ))}
          </div>
          <div className="mt-2 text-center text-sm font-medium text-foreground sm:text-[15px]">
            Top Assets
          </div>
          <div className="text-center text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
            {showPhoneToggle
              ? "Tap the button below"
              : isCompact
                ? "Live market focus"
                : "Hover to explore"}
          </div>
        </div>

        {showPhoneToggle && (
          <button
            type="button"
            onClick={() => setHovered((value) => !value)}
            className="absolute bottom-5 z-20 rounded-full border border-primary/20 bg-primary/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
          >
            {hovered ? "Hide Assets" : "Show Assets"}
          </button>
        )}
      </div>
    </div>
  );
}
