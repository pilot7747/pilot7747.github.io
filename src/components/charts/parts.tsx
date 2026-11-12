// Small SVG pieces every chart draws the same way.

import { decimals, fmt, type Scale } from "./scale";

/** Colors are CSS variables from globals.css, so both themes come for free. */
export const color = {
  blue: "var(--c-blue)",
  orange: "var(--c-orange)",
  aqua: "var(--c-aqua)",
  yellow: "var(--c-yellow)",
  magenta: "var(--c-magenta)",
  green: "var(--c-green)",
  violet: "var(--c-violet)",
  red: "var(--c-red)",
  grey: "var(--c-grey)",
  ink: "var(--c-ink)",
  muted: "var(--fg-muted)",
  subtle: "var(--fg-subtle)",
  w512: "var(--c-w512)",
  w768: "var(--c-w768)",
  w1024: "var(--c-w1024)",
  serve: "var(--c-serve)",
  ctx1: "var(--c-ctx1)",
  ctx2: "var(--c-ctx2)",
  ctx3: "var(--c-ctx3)",
  ctx4: "var(--c-ctx4)",
  accent: "var(--accent)",
} as const;

export type ColorName = keyof typeof color;
export const paint = (c: ColorName | undefined) => (c ? color[c] : undefined);

type AxisProps = {
  x: Scale;
  top: number;
  bottom: number;
  title?: string[];
  format?: (v: number) => string;
  /** Draw a strong line at this value (usually 0). */
  zero?: number;
  grid?: boolean;
};

/** Vertical gridlines, a baseline, tick labels and a title under a panel. */
export function XAxis({ x, top, bottom, title = [], format, zero, grid = true }: AxisProps) {
  const d = decimals(x.ticks);
  const label = format ?? ((v: number) => fmt(v, d));
  return (
    <g>
      {grid &&
        x.ticks.map((t) => <line key={t} className="chart-grid" x1={x(t)} x2={x(t)} y1={top} y2={bottom} />)}
      {zero !== undefined && <line className="chart-zero" x1={x(zero)} x2={x(zero)} y1={top} y2={bottom} />}
      <line className="chart-axis" x1={x.range[0]} x2={x.range[1]} y1={bottom} y2={bottom} />
      {x.ticks.map((t) => (
        <text key={t} className="chart-tick" x={x(t)} y={bottom + 14} textAnchor="middle">
          {label(t)}
        </text>
      ))}
      {title.map((line, i) => (
        <text
          key={line}
          className="chart-axis-title"
          x={(x.range[0] + x.range[1]) / 2}
          y={bottom + 32 + i * 14}
          textAnchor="middle"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

type YAxisProps = {
  y: Scale;
  left: number;
  right: number;
  title?: string[];
  format?: (v: number) => string;
  zero?: number;
  grid?: boolean;
  labels?: boolean;
  rowLabels?: boolean;
};

/** Horizontal gridlines, a left spine, tick labels and a rotated title. */
export function YAxis({ y, left, right, title = [], format, zero, grid = true, labels = true, rowLabels }: YAxisProps) {
  const d = decimals(y.ticks);
  const label = format ?? ((v: number) => fmt(v, d));
  const mid = (y.range[0] + y.range[1]) / 2;
  return (
    <g>
      {grid && y.ticks.map((t) => <line key={t} className="chart-grid" x1={left} x2={right} y1={y(t)} y2={y(t)} />)}
      {zero !== undefined && <line className="chart-zero" x1={left} x2={right} y1={y(zero)} y2={y(zero)} />}
      <line className="chart-axis" x1={left} x2={left} y1={y.range[0]} y2={y.range[1]} />
      {labels &&
        y.ticks.map((t) => (
          <text key={t} className={rowLabels ? "chart-label chart-label-sm" : "chart-tick"} x={left - 8} y={y(t)} dy="0.34em" textAnchor="end">
            {label(t)}
          </text>
        ))}
      {title.map((line, i) => (
        <text
          key={line}
          className="chart-axis-title"
          transform={`translate(${left - 40 - (title.length - 1 - i) * 14} ${mid}) rotate(-90)`}
          textAnchor="middle"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export type Shape = "circle" | "square" | "diamond" | "triangle";

type MarkerProps = { x: number; y: number; r?: number; fill: string; hollow?: boolean; shape?: Shape };

/** A data point; hollow ones keep the surface inside a colored ring. */
export function Marker({ x, y, r = 4.5, fill, hollow, shape = "circle" }: MarkerProps) {
  const style = hollow
    ? { fill: "var(--bg)", stroke: fill, strokeWidth: 2 }
    : { fill, stroke: "var(--bg)", strokeWidth: 1.25 };
  const rr = hollow ? r - 0.5 : r;
  if (shape === "square") return <rect x={x - rr} y={y - rr} width={rr * 2} height={rr * 2} rx={1} style={style} />;
  if (shape === "diamond") {
    const k = rr * 1.25;
    return <path d={`M${x} ${y - k}L${x + k} ${y}L${x} ${y + k}L${x - k} ${y}Z`} style={style} />;
  }
  if (shape === "triangle") {
    const k = rr * 1.2;
    return <path d={`M${x} ${y - k}L${x + k} ${y + k * 0.8}L${x - k} ${y + k * 0.8}Z`} style={style} />;
  }
  return <circle cx={x} cy={y} r={rr} style={style} />;
}
