import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: `${site.company} · ${site.team} · LLM pre-training`,
    title: "I pre-train language models, and mostly work on what goes into them.",
    footer: "nikita-pavlichenko.com",
  });
}
