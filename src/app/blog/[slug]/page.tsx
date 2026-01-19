import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { format } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Nikita Pavlichenko`,
    description: post.description,
  };
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold mt-6 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-accent pl-4 my-4 italic text-accent-secondary"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-code-bg border border-border rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !props.className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="bg-code-bg px-1.5 py-0.5 rounded border border-border font-mono text-sm"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-accent hover:underline" {...props} />
  ),
  hr: () => <hr className="border-border my-8" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-lg my-4 max-w-full" alt={props.alt || ""} {...props} />
  ),
};

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-accent-secondary hover:text-accent font-mono text-sm transition-colors"
        >
          <span className="text-accent">$</span> cd ..
        </Link>
      </div>

      <article>
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-accent-secondary font-mono">
            <time>{format(new Date(post.date), "MMMM d, yyyy")}</time>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-accent">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="prose max-w-none">
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>

      <footer className="mt-16 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm font-mono">
          <Link
            href="/blog"
            className="text-accent-secondary hover:text-accent transition-colors"
          >
            <span className="text-accent">$</span> ls blog/
          </Link>
          <a
            href={`mailto:nikita.v.pavlichenko@gmail.com?subject=Re: ${post.title}`}
            className="text-accent-secondary hover:text-accent transition-colors"
          >
            <span className="text-accent">$</span> # Questions? Email me
          </a>
        </div>
      </footer>
    </div>
  );
}
