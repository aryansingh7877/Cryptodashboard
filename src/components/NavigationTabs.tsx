export function NavigationTabs() {
  const tabs = ["Market", "Portfolio", "Tools", "Insights"];

  return (
    <div className="mb-6 flex w-full max-w-3xl justify-between overflow-x-auto rounded-lg bg-surface/50 p-1">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            i === 0
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
