"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/#work", label: "Work", match: () => false },
  { href: "/#publications", label: "Papers", match: () => false },
  { href: "/blog", label: "Writing", match: (path: string) => path.startsWith("/blog") },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="site-header no-print sticky top-0 z-50 border-b bg-bg/80 backdrop-blur-md backdrop-saturate-150"
    >
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          transitionTypes={pathname === "/" ? undefined : ["nav-back"]}
          className="group flex items-center gap-2.5 font-serif text-[1.0625rem] tracking-tight text-fg"
        >
          <span aria-hidden className="relative grid size-7 place-items-center rounded-full border border-line-strong font-serif text-[0.95rem] italic leading-none transition-colors group-hover:border-accent">
            n
            <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-accent" />
          </span>
          <span>Nikita Pavlichenko</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          {nav.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="hidden rounded-full px-3 py-1.5 text-fg-muted transition-colors hover:text-fg aria-[current=page]:text-fg sm:inline-block"
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/blog"
            aria-current={pathname.startsWith("/blog") ? "page" : undefined}
            className="rounded-full px-3 py-1.5 text-fg-muted transition-colors hover:text-fg aria-[current=page]:text-fg sm:hidden"
          >
            Writing
          </Link>
          <span aria-hidden className="mx-1 h-4 w-px bg-line" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
