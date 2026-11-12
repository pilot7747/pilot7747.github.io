import * as diagrams from "@/charts/every-llm-architecture-change/diagrams";

type Props = {
  id: keyof typeof diagrams;
  /** Height on the page, px; the width follows the diagram's aspect ratio. */
  height?: number;
  /** The full-size source, for readers who want to zoom in. */
  href?: string;
};

/** A bux studio diagram, inlined as SVG so its colors follow the theme. */
export function Diagram({ id, height = 720, href }: Props) {
  const svg = diagrams[id];
  if (!svg) throw new Error(`Unknown diagram "${id}"`);
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)![1].split(/\s+/).map(Number);
  const inner = <div style={{ width: Math.round((height * w) / h), maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />;
  return (
    <figure className="diagram">
      {href ? (
        <a href={href} title="Open the full-size diagram">
          {inner}
        </a>
      ) : (
        inner
      )}
    </figure>
  );
}
