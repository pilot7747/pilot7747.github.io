import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  tags: string[];
  readingMinutes: number;
}

export interface Post extends PostMeta {
  content: string;
  headings: Heading[];
}

export interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

function postFiles() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((name) => /\.mdx?$/.test(name));
}

function normalizeDate(value: unknown) {
  // gray-matter turns unquoted YAML dates into Date objects.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value) return value.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function stripCode(content: string) {
  return content.replace(/^(```|~~~)[\s\S]*?^\1/gm, "");
}

function readingMinutes(content: string) {
  const words = stripCode(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

// Same ids rehype-slug assigns, so the table of contents links line up.
function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  for (const match of stripCode(content).matchAll(/^(#{2,3})\s+(.+?)\s*#*$/gm)) {
    const text = match[2].replace(/[*_`]|\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
    headings.push({ id: slugger.slug(text), text, depth: match[1].length as 2 | 3 });
  }
  return headings;
}

function parse(fileName: string): Post | null {
  const slug = fileName.replace(/\.mdx?$/, "");
  const source = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
  const { data, content } = matter(source);

  if (data.draft && process.env.NODE_ENV === "production") return null;

  return {
    slug,
    title: data.title || slug,
    date: normalizeDate(data.date),
    description: data.description || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingMinutes: readingMinutes(content),
    content,
    headings: extractHeadings(content),
  };
}

export function getAllPosts(): PostMeta[] {
  return postFiles()
    .map(parse)
    .filter((post): post is Post => post !== null)
    .map(({ slug, title, date, description, tags, readingMinutes }) => ({
      slug,
      title,
      date,
      description,
      tags,
      readingMinutes,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | null {
  const fileName = postFiles().find((name) => name.replace(/\.mdx?$/, "") === slug);
  return fileName ? parse(fileName) : null;
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

// view-transition-name must be a CSS identifier; slugs like "1.llm_infra" are not.
export function transitionName(slug: string) {
  return `post-${slug.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const mediumDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function formatDate(date: string, style: "long" | "medium" = "long") {
  return (style === "long" ? longDate : mediumDate).format(new Date(`${date}T00:00:00Z`));
}
