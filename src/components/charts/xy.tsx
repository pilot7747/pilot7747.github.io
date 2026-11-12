// A general x/y chart: small multiples of panels, each a stack of marks in data
// coordinates. Lines, scatters, forest plots and ladders are all specs of this.

import { ChartFigure, type LegendItem } from "./figure";
import { color, Marker, paint, XAxis, YAxis, type ColorName, type Shape } from "./parts";
import { decimals, fmt, scale, type Scale, type ScaleKind } from "./scale";

export type Pt = [number, number];
type Dash = "dash" | "dot";
type Pos = number | "left" | "right";
type VPos = number | "top" | "bottom";

export type Point = { x: number; y: number; hollow?: boolean; shape?: Shape; color?: ColorName; r?: number; title?: string };

export type XYMark =
  | { type: "line"; points: Pt[]; color: ColorName; width?: number; dash?: Dash; opacity?: number; title?: string; markers?: "dot" | "hollow"; r?: number }
  | { type: "points"; points: (Pt | Point)[]; color: ColorName; shape?: Shape; hollow?: boolean; r?: number }
  | { type: "errorbar"; dir?: "v" | "h"; at: number; lo: number; hi: number; color: ColorName; width?: number; dash?: Dash }
  | { type: "rule"; x?: number; y?: number; color?: ColorName; dash?: Dash; width?: number; strong?: boolean }
  | { type: "band"; x?: [number, number]; y?: [number, number] }
  | { type: "segment"; from: Pt; to: Pt; color?: ColorName; dash?: Dash; width?: number; opacity?: number }
  | { type: "text"; x: Pos; y: VPos; text: string | string[]; anchor?: "start" | "middle" | "end"; dx?: number; dy?: number; color?: ColorName; size?: number; strong?: boolean };

export type XYAxis = {
  kind?: ScaleKind;
  domain: [number, number];
  ticks?: number[];
  /** Labels for the ticks, in order; "\n" breaks a label into lines. */
  tickLabels?: string[];
  /** Digits after the point, "auto" for the shortest form, or "x" for multipliers. */
  format?: number | "auto" | "x";
  title?: string[];
  grid?: boolean;
  zero?: number;
  /** Tick labels are row names (forest plots): set in the label style. */
  rowLabels?: boolean;
};

export type XYPanel = { title?: string[]; marks: XYMark[] };

export type XYSpec = {
  kind: "xy";
  label: string;
  subtitle?: string;
  x: XYAxis;
  y: XYAxis;
  panels: XYPanel[];
  cols?: number;
  panelHeight: number;
  /** Space around the plot area, in viewBox px. */
  margin?: Partial<Record<"l" | "r" | "t" | "b", number>>;
  gap?: [number, number];
  /** Tick labels on every panel rather than the outer ones only. */
  ticksEverywhere?: boolean;
  legend?: LegendItem[];
  notes?: string[];
  width?: number;
  minWidth?: number;
};

const DASH: Record<Dash, string> = { dash: "5 3.5", dot: "1.5 3" };

function formatter(axis: XYAxis, s: Scale): (v: number) => string {
  if (axis.tickLabels) return (v) => axis.tickLabels![s.ticks.indexOf(v)] ?? "";
  if (axis.format === "x") return (v) => `${Number(v.toPrecision(3))}x`;
  if (axis.format === "auto" || axis.kind === "log") return (v) => fmt(v, decimals([v]));
  const d = typeof axis.format === "number" ? axis.format : decimals(s.ticks);
  return (v) => fmt(v, d);
}

export function XYChart({ spec }: { spec: XYSpec }) {
  const W = spec.width ?? 680;
  const cols = spec.cols ?? 1;
  const rows = Math.ceil(spec.panels.length / cols);
  const m = { l: 56, r: 12, t: 10, b: 52, ...spec.margin };
  const [gx, gy] = spec.gap ?? [18, 40];
  const pw = (W - m.l - m.r - gx * (cols - 1)) / cols;
  const ph = spec.panelHeight;
  const H = m.t + rows * ph + (rows - 1) * gy + m.b;

  return (
    <ChartFigure label={spec.label} subtitle={spec.subtitle} legend={spec.legend} notes={spec.notes} minWidth={spec.minWidth ?? 440}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label={spec.label}>
        {spec.panels.map((panel, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const left = m.l + col * (pw + gx);
          const top = m.t + row * (ph + gy);
          const x = scale(spec.x.kind ?? "linear", spec.x.domain, [left, left + pw], spec.x.ticks);
          const y = scale(spec.y.kind ?? "linear", spec.y.domain, [top + ph, top], spec.y.ticks);
          const lastRow = row === rows - 1 || i + cols >= spec.panels.length;
          const showX = spec.ticksEverywhere || lastRow;
          const showY = spec.ticksEverywhere || col === 0;
          return (
            <g key={i}>
              {panel.title?.map((t, k) => (
                <text key={t} className="chart-panel-title" x={left + pw / 2} y={top - 6 - (panel.title!.length - 1 - k) * 14} textAnchor="middle">
                  {t}
                </text>
              ))}
              <YAxis
                y={y}
                left={left}
                right={left + pw}
                grid={spec.y.grid ?? true}
                labels={showY}
                title={col === 0 && row === Math.floor((rows - 1) / 2) ? spec.y.title : undefined}
                format={formatter(spec.y, y)}
                zero={spec.y.zero}
                rowLabels={spec.y.rowLabels}
              />
              <XAxisLines x={x} top={top} bottom={top + ph} axis={spec.x} show={showX} title={lastRow && (cols === 1 || col === Math.floor((cols - 1) / 2)) ? spec.x.title : undefined} wide={cols > 1 ? W / 2 : undefined} />
              {panel.marks.map((mark, k) => (
                <Mark key={k} mark={mark} x={x} y={y} />
              ))}
            </g>
          );
        })}
      </svg>
    </ChartFigure>
  );
}

/** X axis with multi-line tick labels; the title centers under the whole chart for small multiples. */
function XAxisLines({ x, top, bottom, axis, show, title, wide }: { x: Scale; top: number; bottom: number; axis: XYAxis; show: boolean; title?: string[]; wide?: number }) {
  const label = formatter(axis, x);
  const multi = axis.tickLabels?.some((t) => t.includes("\n"));
  return (
    <g>
      <XAxis x={x} top={top} bottom={bottom} grid={axis.grid ?? true} zero={axis.zero} format={() => ""} />
      {show &&
        x.ticks.map((t) => (
          <text key={t} className="chart-tick" x={x(t)} y={bottom + 14} textAnchor="middle">
            {label(t)
              .split("\n")
              .map((line, k) => (
                <tspan key={k} x={x(t)} dy={k ? 13 : 0}>
                  {line}
                </tspan>
              ))}
          </text>
        ))}
      {title?.map((line, i) => (
        <text key={line} className="chart-axis-title" x={wide ?? (x.range[0] + x.range[1]) / 2} y={bottom + (multi ? 45 : 32) + i * 14} textAnchor="middle">
          {line}
        </text>
      ))}
    </g>
  );
}

function path(points: Pt[], x: Scale, y: Scale): string {
  return points.map(([a, b], i) => `${i ? "L" : "M"}${x(a).toFixed(1)} ${y(b).toFixed(1)}`).join("");
}

function Mark({ mark, x, y }: { mark: XYMark; x: Scale; y: Scale }) {
  const [x0, x1] = x.range;
  const [y0, y1] = [y.range[1], y.range[0]];
  switch (mark.type) {
    case "band": {
      const [a, b] = mark.x ? [x(mark.x[0]), x(mark.x[1])] : [x0, x1];
      const [c, d] = mark.y ? [y(mark.y[1]), y(mark.y[0])] : [y0, y1];
      return <rect className="chart-band" x={Math.min(a, b)} y={Math.min(c, d)} width={Math.abs(b - a)} height={Math.abs(d - c)} />;
    }
    case "rule": {
      const style = { stroke: mark.strong ? "var(--c-zero)" : paint(mark.color ?? "muted"), strokeWidth: mark.width ?? 1.25, strokeDasharray: mark.dash && DASH[mark.dash] };
      return mark.x !== undefined ? (
        <line x1={x(mark.x)} x2={x(mark.x)} y1={y0} y2={y1} style={style} />
      ) : (
        <line x1={x0} x2={x1} y1={y(mark.y!)} y2={y(mark.y!)} style={style} />
      );
    }
    case "segment":
      return (
        <line
          x1={x(mark.from[0])}
          y1={y(mark.from[1])}
          x2={x(mark.to[0])}
          y2={y(mark.to[1])}
          stroke={paint(mark.color ?? "subtle")}
          strokeWidth={mark.width ?? 1}
          strokeDasharray={mark.dash && DASH[mark.dash]}
          opacity={mark.opacity}
        />
      );
    case "errorbar": {
      const s = { stroke: color[mark.color], strokeWidth: mark.width ?? 1.5, strokeDasharray: mark.dash && DASH[mark.dash], strokeLinecap: "round" as const };
      return mark.dir === "h" ? (
        <line x1={x(mark.lo)} x2={x(mark.hi)} y1={y(mark.at)} y2={y(mark.at)} style={s} />
      ) : (
        <line x1={x(mark.at)} x2={x(mark.at)} y1={y(mark.lo)} y2={y(mark.hi)} style={s} />
      );
    }
    case "line":
      return (
        <g>
          <path
            d={path(mark.points, x, y)}
            fill="none"
            stroke={color[mark.color]}
            strokeWidth={mark.width ?? 2}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={mark.dash && DASH[mark.dash]}
            opacity={mark.opacity}
          >
            {mark.title && <title>{mark.title}</title>}
          </path>
          {mark.markers &&
            mark.points.map(([a, b], k) => <Marker key={k} x={x(a)} y={y(b)} r={mark.r ?? 4.5} fill={color[mark.color]} hollow={mark.markers === "hollow"} />)}
        </g>
      );
    case "points":
      return (
        <g>
          {mark.points.map((p, k) => {
            const pt: Point = Array.isArray(p) ? { x: p[0], y: p[1] } : p;
            return (
              <g key={k}>
                {pt.title && <title>{pt.title}</title>}
                <Marker
                  x={x(pt.x)}
                  y={y(pt.y)}
                  r={pt.r ?? mark.r ?? 4.5}
                  fill={color[pt.color ?? mark.color]}
                  hollow={pt.hollow ?? mark.hollow}
                  shape={pt.shape ?? mark.shape}
                />
              </g>
            );
          })}
        </g>
      );
    case "text": {
      const px = mark.x === "left" ? x0 : mark.x === "right" ? x1 : x(mark.x);
      const py = mark.y === "top" ? y0 : mark.y === "bottom" ? y1 : y(mark.y);
      const lines = Array.isArray(mark.text) ? mark.text : [mark.text];
      const size = mark.size ?? 11;
      return (
        <text
          className={mark.strong ? "chart-annot chart-annot-strong" : "chart-annot"}
          x={px + (mark.dx ?? 0)}
          y={py + (mark.dy ?? 0)}
          textAnchor={mark.anchor ?? "start"}
          fontSize={size}
          style={mark.color ? { fill: paint(mark.color) } : undefined}
        >
          {lines.map((line, k) => (
            <tspan key={k} x={px + (mark.dx ?? 0)} dy={k ? size * 1.2 : "0.34em"}>
              {line}
            </tspan>
          ))}
        </text>
      );
    }
  }
}
