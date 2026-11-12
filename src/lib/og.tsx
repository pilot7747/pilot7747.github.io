import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { buildCurve, CURVE } from "@/lib/curve";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "assets/fonts");
const fonts = Promise.all([
  readFile(join(fontDir, "Newsreader-Medium.ttf")),
  readFile(join(fontDir, "Newsreader-Italic.ttf")),
  readFile(join(fontDir, "GeistMono-Regular.ttf")),
]);

const colors = {
  bg: "#fbf9f5",
  fg: "#2a2420",
  muted: "#6d655e",
  line: "#e4ded5",
  accent: "#d9572b",
};

export async function ogImage({ eyebrow, title, footer }: { eyebrow?: string; title: string; footer: string }) {
  const [serif, serifItalic, mono] = await fonts;
  const curve = buildCurve();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: colors.bg,
          color: colors.fg,
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <svg
          width="1200"
          height="300"
          viewBox={`0 0 ${CURVE.w} ${CURVE.h}`}
          preserveAspectRatio="none"
          style={{ position: "absolute", left: 0, bottom: 40, opacity: 0.9 }}
        >
          <path d={curve.smooth} fill="none" stroke={colors.accent} strokeWidth="3" strokeOpacity="0.18" />
        </svg>

        {eyebrow ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "Geist Mono", fontSize: 22, color: colors.muted }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: colors.accent }} />
            {eyebrow}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            fontFamily: "Newsreader",
            fontWeight: 500,
            fontSize: title.length > 48 ? 72 : 88,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${colors.line}`,
            paddingTop: 24,
            fontFamily: "Geist Mono",
            fontSize: 22,
            color: colors.muted,
          }}
        >
          <span style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: 30, color: colors.fg }}>{site.name}</span>
          <span>{footer}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Newsreader", data: serif, style: "normal", weight: 500 },
        { name: "Newsreader", data: serifItalic, style: "italic", weight: 400 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
