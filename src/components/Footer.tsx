export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-border bg-[linear-gradient(180deg,rgba(8,14,28,0.98),rgba(7,12,24,1))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(87,109,255,0.12),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pt-12">
        <div className="px-1 text-center text-[11px] leading-relaxed text-slate-300/90 sm:text-sm">
          Copyright {year}. Nebula Markets. All Rights Reserved.
        </div>

        <div className="mt-7 flex justify-center sm:mt-10">
          <div
            className="select-none text-center font-display text-[clamp(2.05rem,13vw,11rem)] font-bold leading-none tracking-tight text-transparent opacity-80 md:text-[clamp(2.8rem,12vw,10rem)] lg:text-[clamp(3.6rem,18vw,14rem)]"
            style={{
              WebkitTextStroke: "1px rgba(123, 140, 255, 0.32)",
              textShadow: "0 0 32px rgba(72, 110, 255, 0.05)",
            }}
          >
            NebulaMarkets
          </div>
        </div>
      </div>
    </footer>
  );
}
