import { ogImage, ogSize } from "@/lib/og";
import { formatDate, getAllPosts, getPostBySlug } from "@/lib/posts";

export const alt = "Blog post cover";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return ogImage({
    eyebrow: post ? `Writing · ${formatDate(post.date)}` : "Writing",
    title: post?.title ?? "Writing",
    footer: "nikita-pavlichenko.com/blog",
  });
}
