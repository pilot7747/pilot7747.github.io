import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight, Section } from "@/components/section";
import { TrainingCurve } from "@/components/training-curve";
import { formatDate, getAllPosts, transitionName } from "@/lib/posts";
import {
  education,
  experience,
  highlights,
  publications,
  site,
  socials,
  toolbox,
  type Publication,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const pageTransition = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
} as const;

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    worksFor: { "@type": "Organization", name: site.company, url: site.companyUrl },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Moscow Institute of Physics and Technology" },
    homeLocation: { "@type": "Place", name: site.location },
    knowsAbout: ["Large language models", "LLM pre-training", "Machine learning", "RLHF", "Code generation"],
    sameAs: Object.values(site.links),
  };

  return (
    <ViewTransition {...pageTransition} default="none">
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />

        {/* ---------------------------------------------------------------- hero */}
        <section className="container-page pb-14 pt-16 md:pb-20 md:pt-24">
          <h1 className="font-serif text-[clamp(2.4rem,1.6rem+3.6vw,4.25rem)] font-[420] leading-[1.05] tracking-[-0.02em]">
            I pre-train language models.
          </h1>

          <div className="mt-7 max-w-xl space-y-4 text-[1.0625rem] leading-relaxed text-fg-muted md:text-lg">
            <p>
              I&apos;m {site.name}, a {site.role} on the {site.team} team at{" "}
              <a href={site.companyUrl} className="link-underline text-fg">
                {site.company}
              </a>
              . Before that I spent two and a half years at JetBrains leading{" "}
              <a href="https://www.jetbrains.com/mellum/" className="link-underline text-fg">
                Mellum
              </a>
              , an open family of code LLMs.
            </p>
            <p>Earlier, I did research on crowdsourcing, evaluation and RLHF at Yandex and Toloka AI.</p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="link-underline text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------------- figure */}
        <div className="container-page pb-20 md:pb-28">
          <div className="rise" style={{ ["--i" as string]: 4 }}>
            <TrainingCurve />
          </div>
        </div>

        <div className="container-page space-y-20 md:space-y-28">
          {/* ------------------------------------------------------------- work */}
          <Section id="work" index="01" title="Selected work">
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((h) => (
                <article
                  key={h.title}
                  className="group relative flex flex-col rounded-xl border border-line p-6 transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-bg-elev"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="eyebrow">{h.kicker}</p>
                    <p className="font-mono text-xs text-fg-subtle">{h.year}</p>
                  </div>
                  <h3 className="mt-4 font-serif text-[1.625rem] leading-tight tracking-tight">{h.title}</h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-fg-muted">{h.body}</p>
                  {h.links.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      {h.links.map((l) => (
                        <a key={l.href} href={l.href} className="inline-flex items-center gap-1 text-accent-ink hover:underline hover:underline-offset-4">
                          {l.label}
                          <ArrowUpRight />
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </Section>

          {/* ------------------------------------------------------- experience */}
          <Section id="experience" index="02" title="Experience">
            <ol className="relative space-y-10 border-l border-line pl-6 md:pl-8">
              {experience.map((job) => (
                <li key={job.id} id={job.id} className="relative">
                  <span
                    aria-hidden
                    className={`absolute -left-[calc(1.5rem+4.5px)] top-2 size-2 rounded-full ring-4 ring-bg md:-left-[calc(2rem+4.5px)] ${
                      job.current ? "bg-accent" : "bg-line-strong"
                    }`}
                  />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3 className="font-serif text-[1.375rem] leading-tight tracking-tight">
                      {job.href ? (
                        <a href={job.href} className="link-underline decoration-transparent hover:decoration-current">
                          {job.company}
                        </a>
                      ) : (
                        job.company
                      )}
                      {job.current && (
                        <span className="ml-3 inline-block translate-y-[-0.2em] rounded-full bg-accent-soft px-2 py-0.5 align-middle font-sans text-[0.6875rem] font-medium text-accent-ink">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="shrink-0 font-mono text-xs text-fg-muted">
                      {job.period}
                      <span className="sm:hidden"> · {job.location}</span>
                    </p>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between gap-6">
                    <p className="text-[0.9375rem] text-fg">{job.role}</p>
                    <p className="hidden shrink-0 text-sm text-fg-subtle sm:block">{job.location}</p>
                  </div>
                  {job.points.length > 0 && (
                    <ul className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-fg-muted">
                      {job.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span aria-hidden className="mt-[0.75em] h-px w-2 shrink-0 bg-fg-subtle" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-12 rounded-xl border border-line p-6">
              <p className="eyebrow">Education</p>
              <ul className="mt-4 space-y-3">
                {education.map((e) => (
                  <li key={e.degree} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <span>
                      <span className="text-fg">{e.degree}</span>
                      <span className="text-fg-muted"> · {e.school}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-fg-muted">{e.period}</span>
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-8">Toolbox</p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[8rem_1fr]">
                {toolbox.map((row) => (
                  <div key={row.label} className="contents">
                    <dt className="text-fg">{row.label}</dt>
                    <dd className="text-fg-muted">{row.items}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Section>

          {/* ----------------------------------------------------- publications */}
          <Section
            id="publications"
            index="03"
            title="Publications"
            aside={
              <a href={site.links.scholar} className="inline-flex items-center gap-1 link-underline hover:text-fg">
                Google Scholar <ArrowUpRight className="size-3" />
              </a>
            }
          >
            <PublicationList items={publications} />
            <p className="mt-10 border-t border-line pt-6 text-sm text-fg-muted">
              <span className="eyebrow mr-3">Talks</span>
              Tutorial on reinforcement learning from human feedback, ICML 2023.
            </p>
          </Section>

          {/* ---------------------------------------------------------- writing */}
          <Section
            id="writing"
            index="04"
            title="Writing"
            aside={
              <Link href="/blog" transitionTypes={["nav-forward"]} className="inline-flex items-center gap-1 link-underline hover:text-fg">
                All posts →
              </Link>
            }
          >
            {posts.length === 0 ? (
              <p className="text-fg-muted">Nothing here yet.</p>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      transitionTypes={["nav-forward"]}
                      className="group grid gap-1 py-5 sm:grid-cols-[6.5rem_1fr] sm:gap-6"
                    >
                      <time dateTime={post.date} className="font-mono text-xs text-fg-muted sm:pt-1.5">
                        {formatDate(post.date, "medium")}
                      </time>
                      <div>
                        <ViewTransition name={transitionName(post.slug)} share="morph" default="none">
                          <h3 className="w-fit font-serif text-xl tracking-tight transition-colors group-hover:text-accent-ink">{post.title}</h3>
                        </ViewTransition>
                        {post.description && <p className="mt-1 text-[0.9375rem] text-fg-muted">{post.description}</p>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* ---------------------------------------------------------- contact */}
          <Section id="contact" index="05" title="Contact">
            <div className="max-w-2xl">
              <p className="text-fg-muted">
                Email is the best way to reach me. I&apos;m always happy to talk about pre-training data, evals, and
                making experiments cheaper.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="group mt-6 inline-flex max-w-full items-center gap-3 font-serif text-[clamp(1.35rem,0.9rem+2.2vw,2.5rem)] tracking-tight"
              >
                <span className="truncate border-b border-line-strong pb-1 transition-colors group-hover:border-accent group-hover:text-accent-ink">
                  {site.email}
                </span>
                <ArrowUpRight className="size-6 shrink-0 text-fg-subtle transition-[translate,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink" />
              </a>
            </div>
          </Section>
        </div>
      </div>
    </ViewTransition>
  );
}

function Authors({ value }: { value: string }) {
  const [before, after] = value.split("N. Pavlichenko");
  if (after === undefined) return <>{value}</>;
  return (
    <>
      {before}
      <span className="text-fg">N. Pavlichenko</span>
      {after}
    </>
  );
}

function PublicationList({ items }: { items: Publication[] }) {
  return (
    <ol className="space-y-7">
      {items.map((p, i) => (
        <li key={p.title} className="grid grid-cols-[2.25rem_1fr] gap-x-2">
          <span className="pt-1 font-mono text-xs text-fg-subtle">[{items.length - i}]</span>
          <div>
            <h3 className="font-serif text-[1.1875rem] leading-snug tracking-tight">
              {p.href ? (
                <a href={p.href} className="link-underline decoration-transparent hover:text-accent-ink hover:decoration-current">
                  {p.title}
                </a>
              ) : (
                p.title
              )}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              <Authors value={p.authors} />
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-xs text-fg-muted">
              <span>{p.venue}</span>
              {p.year && <span className="text-fg-subtle">· {p.year}</span>}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
