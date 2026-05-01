interface Props {
  value: string;
  onChange: (v: string) => void;
  count: number;
}

export function SearchBar({ value, onChange, count }: Props) {
  return (
    <div className="glass flex items-center gap-2 rounded-xl px-3 py-3 shadow-soft sm:gap-3 sm:px-4">
      <svg
        className="h-4 w-4 shrink-0 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name or symbol..."
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground tabular-nums max-[360px]:hidden">
        {count}
      </span>
    </div>
  );
}
