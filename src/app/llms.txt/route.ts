import { getAllPosts } from "@/lib/posts";
import { experience, highlights, publications, site } from "@/lib/site";

export const dynamic = "force-static";

// A plain-text profile for language models and agents, per https://llmstxt.org.
export function GET() {
  const posts = getAllPosts();
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Location: ${site.location}. Contact: ${site.email}.`,
    "",
    "## Experience",
    "",
    ...experience.map((job) => `- ${job.company}: ${job.role} (${job.period}).${job.points[0] ? ` ${job.points[0]}` : ""}`),
    "",
    "## Selected work",
    "",
    ...highlights.map((h) => `- ${h.title} (${h.year}): ${h.body}${h.links[0] ? ` ${h.links[0].href}` : ""}`),
    "",
    "## Publications",
    "",
    ...publications.map((p) => `- ${p.title}. ${p.authors}. ${p.venue}${p.year ? `, ${p.year}` : ""}.${p.href ? ` ${p.href}` : ""}`),
    "",
    "## Writing",
    "",
    ...(posts.length ? posts.map((post) => `- [${post.title}](${site.url}/blog/${post.slug}): ${post.description}`) : ["- No posts yet."]),
    "",
    "## Links",
    "",
    ...Object.entries(site.links).map(([name, url]) => `- ${name}: ${url}`),
    "",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
