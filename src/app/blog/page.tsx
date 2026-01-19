import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { format } from "date-fns";

export const metadata = {
  title: "Blog | Nikita Pavlichenko",
  description: "Thoughts on ML, engineering, and other random things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="font-mono text-accent-secondary mb-2">
          <span className="text-accent">$</span> ls -la blog/
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
        <p className="text-accent-secondary">
          Occasional thoughts on ML, engineering, and random things I find interesting.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border border-border rounded-lg p-8 bg-card-bg text-center">
          <p className="text-accent-secondary font-mono mb-2">
            # No posts yet
          </p>
          <p className="text-sm text-accent-secondary">
            Check back soon. Or don&apos;t. I&apos;m not your boss.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border border-border rounded-lg p-6 bg-card-bg hover:border-accent transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <h2 className="text-xl font-semibold hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <time className="text-sm text-accent-secondary font-mono whitespace-nowrap">
                  {format(new Date(post.date), "MMM d, yyyy")}
                </time>
              </div>
              <p className="text-accent-secondary mb-3">{post.description}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-background border border-border rounded font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-sm text-accent-secondary font-mono">
          <span className="text-accent">$</span> # Want to discuss something?{" "}
          <a href="mailto:nikita.v.pavlichenko@gmail.com" className="text-accent hover:underline">
            Email me
          </a>
        </p>
      </div>
    </div>
  );
}
