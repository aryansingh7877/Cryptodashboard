export default function BackgroundCanvas() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(180deg,rgba(5,11,24,0.98),rgba(6,12,26,1))]"
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37, 92, 171, 0.26) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 92, 171, 0.26) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,123,255,0.16),transparent_34%),radial-gradient(circle_at_82%_82%,rgba(0,229,255,0.08),transparent_24%)]" />
      <div className="absolute inset-y-0 right-3 w-px bg-gradient-to-b from-transparent via-cyan-300/80 to-transparent opacity-80 sm:right-4" />
      <div className="absolute inset-y-0 right-3 translate-x-1 w-3 rounded-full bg-cyan-300/18 blur-md opacity-85 sm:right-4" />
    </div>
  );
}
