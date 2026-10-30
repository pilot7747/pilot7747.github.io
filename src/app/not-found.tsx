import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-start py-28 md:py-40">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 max-w-[16ch] font-serif text-[clamp(2.4rem,1.6rem+3.6vw,4.25rem)] font-[420] leading-[1.05] tracking-[-0.02em]">
        This page diverged. <em className="text-accent-ink">Loss is NaN.</em>
      </h1>
      <p className="mt-5 max-w-md text-lg text-fg-muted">
        Nothing lives at this address. Rolling back to the last good checkpoint is usually the right call.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex h-10 items-center rounded-full bg-fg px-5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
      >
        Restore from checkpoint
      </Link>
    </div>
  );
}
