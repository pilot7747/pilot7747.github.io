import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { formatDate, getAllPosts, transitionName, type PostMeta } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on training language models, the data that goes into them, and the infrastructure in between.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const byYear = Map.groupBy(posts, (post: PostMeta) => post.date.slice(0, 4));

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div className="container-page pt-16 md:pt-24">
        <header className="max-w-3xl">
          <p className="rise eyebrow">Writing</p>
          <h1
            className="rise mt-5 font-serif text-[clamp(2.4rem,1.6rem+3.6vw,4.25rem)] font-[420] leading-[1.05] tracking-[-0.02em]"
            style={{ ["--i" as string]: 1 }}
          >
            Notes from the training run.
          </h1>
          <p className="rise mt-5 max-w-xl text-lg text-fg-muted" style={{ ["--i" as string]: 2 }}>
            On training language models, the data that goes into them, and the infrastructure in between. Subscribe
            via{" "}
            <a href="/feed.xml" className="link-underline text-fg">
              RSS
            </a>
            .
          </p>
        </header>

        <div className="rise mt-16 space-y-14 md:mt-20" style={{ ["--i" as string]: 3 }}>
          {posts.length === 0 && (
            <p className="border-t border-line pt-8 text-fg-muted">
              Nothing published yet.{" "}
              <a href={`mailto:${site.email}`} className="link-underline text-fg">
                Tell me what you&apos;d like to read
              </a>
              .
            </p>
          )}

          {[...byYear].map(([year, items]) => (
            <section key={year} aria-label={year} className="grid gap-4 border-t border-line pt-6 md:grid-cols-[11rem_1fr] md:gap-12">
              <h2 className="font-mono text-sm text-fg-muted md:sticky md:top-24 md:self-start">{year}</h2>
              <ul className="space-y-10">
                {items.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} transitionTypes={["nav-forward"]} className="group block">
                      <p className="flex items-center gap-2 font-mono text-xs text-fg-muted">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span className="text-fg-subtle">·</span>
                        <span>{post.readingMinutes} min read</span>
                      </p>
                      <ViewTransition name={transitionName(post.slug)} share="morph" default="none">
                        <h3 className="mt-2 w-fit font-serif text-[1.75rem] leading-tight tracking-tight transition-colors group-hover:text-accent-ink md:text-[2rem]">
                          {post.title}
                        </h3>
                      </ViewTransition>
                      {post.description && <p className="mt-2 max-w-2xl text-fg-muted">{post.description}</p>}
                      {post.tags.length > 0 && (
                        <p className="mt-3 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.6875rem] text-fg-muted">
                              {tag}
                            </span>
                          ))}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </ViewTransition>
  );
}
