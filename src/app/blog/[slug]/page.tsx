import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Mdx } from "@/components/mdx";
import { formatDate, getAllPosts, getPostBySlug, transitionName } from "@/lib/posts";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const toc = post.headings.filter((h) => h.depth === 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${site.url}/blog/${post.slug}`,
    image: `${site.url}/blog/${post.slug}/opengraph-image`,
    author: { "@type": "Person", name: site.name, url: site.url },
    keywords: post.tags.join(", "),
  };

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <article className="container-page pt-12 md:pt-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

        <div className="grid gap-x-12 lg:grid-cols-[11rem_minmax(0,1fr)]">
          <div className="no-print">
            <Link
              href="/blog"
              transitionTypes={["nav-back"]}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-fg"
            >
              <span aria-hidden>←</span> Writing
            </Link>
          </div>

          <header className="mt-10 max-w-[42rem] lg:mt-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-fg-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-fg-subtle">·</span>
              <span>{post.readingMinutes} min read</span>
              {post.tags.map((tag) => (
                <span key={tag} className="text-fg-subtle">
                  · {tag}
                </span>
              ))}
            </p>
            <ViewTransition name={transitionName(post.slug)} share="morph" default="none">
              <h1 className="mt-4 w-fit font-serif text-[clamp(2.25rem,1.5rem+3.2vw,3.75rem)] font-[420] leading-[1.06] tracking-[-0.02em]">
                {post.title}
              </h1>
            </ViewTransition>
            {post.description && <p className="mt-5 text-lg leading-relaxed text-fg-muted md:text-xl">{post.description}</p>}
          </header>

          <aside className="no-print hidden lg:block">
            {toc.length >= 2 && (
              <nav aria-label="On this page" className="sticky top-24 mt-14">
                <p className="eyebrow">On this page</p>
                <ol className="mt-3 space-y-2 border-l border-line text-[0.8125rem] leading-snug">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-3 text-fg-muted transition-colors hover:border-accent hover:text-fg">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>

          <div className="mt-12 max-w-[42rem] border-t border-line pt-10">
            <div className="prose">
              <Mdx source={post.content} />
            </div>

            <footer className="no-print mt-16 space-y-10">
              <p className="rounded-xl border border-line p-5 text-[0.9375rem] text-fg-muted">
                Thoughts, corrections, war stories from your own runs?{" "}
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(`Re: ${post.title}`)}`}
                  className="link-underline text-fg"
                >
                  Reply by email
                </a>
                .
              </p>

              {(newer || older) && (
                <nav aria-label="More posts" className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
                  {older ? (
                    <Link href={`/blog/${older.slug}`} transitionTypes={["nav-back"]} className="group">
                      <span className="font-mono text-xs text-fg-muted">← Older</span>
                      <span className="mt-1 block font-serif text-lg leading-snug group-hover:text-accent-ink">{older.title}</span>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {newer && (
                    <Link href={`/blog/${newer.slug}`} transitionTypes={["nav-forward"]} className="group sm:text-right">
                      <span className="font-mono text-xs text-fg-muted">Newer →</span>
                      <span className="mt-1 block font-serif text-lg leading-snug group-hover:text-accent-ink">{newer.title}</span>
                    </Link>
                  )}
                </nav>
              )}
            </footer>
          </div>
        </div>
      </article>
    </ViewTransition>
  );
}
