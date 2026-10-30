export function Section({
  id,
  index,
  title,
  aside,
  children,
}: {
  id: string;
  index: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="reveal border-t border-line pt-10 md:pt-14">
      <div className="grid gap-8 md:grid-cols-[11rem_1fr] md:gap-12">
        <header className="md:sticky md:top-24 md:self-start">
          <p className="font-mono text-xs text-accent-ink">§{index}</p>
          <h2 id={`${id}-title`} className="mt-1 font-serif text-2xl tracking-tight md:text-[1.75rem]">
            {title}
          </h2>
          {aside ? <div className="mt-3 text-sm text-fg-muted">{aside}</div> : null}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

export function ArrowUpRight({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
