import { site, socials } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-line">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-fg-muted sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="font-serif text-base text-fg">{site.name}</p>
          <p>
            {site.tagline} {site.location}.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} className="link-underline hover:text-fg">
                {s.label.toLowerCase()}
              </a>
            </li>
          ))}
          <li>
            <a href="/feed.xml" className="link-underline hover:text-fg">
              rss
            </a>
          </li>
          <li>
            <a href="/llms.txt" className="link-underline hover:text-fg">
              llms.txt
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
