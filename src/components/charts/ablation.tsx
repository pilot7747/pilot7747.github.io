// The article's workhorse: one row per change, with up to three panels sharing the rows.
// measured: the change against its parent at each width, as bars.
// serving:  the model that fits the parent's FP8 serving budget, as bars (or, per
//           context, as lollipops from 1x).
// predicted: the fitted change at equal serving cost on 1T tokens, a dot and its range.

import { ChartFigure, type LegendItem } from "./figure";
import { color, Marker, XAxis, type ColorName } from "./parts";
import { fmt, scale, textWidth, wrap, type Scale } from "./scale";

export type Interval = { v: number; lo: number; hi: number };
export type Tone = "better" | "worse" | "neutral";

export type AblationRow = {
  label: string;
  /** Change in loss, %, at d512, d768, d1024; null where the width wasn't trained. */
  measured: (number | null)[];
  /** Active parameters, billions, at the parent's serving cost. */
  serving?: number;
  /** Serving multiplier against the parent, at 16-24k, 64k, 128k, 256k. */
  servingByContext?: (number | null)[];
  pred?: Interval;
  predByContext?: (number | null)[];
  /** Overrides the color the interval would get from its sign. */
  tone?: Tone;
  /** Filled dot: the change has its own exponent. Defaults to 3+ measured widths. */
  own?: boolean;
};

export type PanelAxis = { domain: [number, number]; ticks?: number[]; clip?: number };

export type AblationSpec = {
  kind: "ablation";
  label: string;
  subtitle?: string;
  /** Who the change is compared with in the axis titles. */
  vs?: string;
  measured: PanelAxis;
  serving?: PanelAxis & { parent: number };
  servingByContext?: PanelAxis;
  predicted?: PanelAxis;
  rows: AblationRow[];
  notes?: string[];
};

const WIDTHS = ["d512", "d768", "d1024"] as const;
const WIDTH_COLORS: ColorName[] = ["w512", "w768", "w1024"];
const CONTEXTS = ["16-24k", "64k", "128k", "256k"] as const;
const CONTEXT_COLORS: ColorName[] = ["ctx1", "ctx2", "ctx3", "ctx4"];
const TONE: Record<Tone, string> = { better: color.blue, worse: color.red, neutral: color.grey };

export function toneOf(row: AblationRow): Tone {
  if (row.tone) return row.tone;
  if (!row.pred) return "neutral";
  return row.pred.hi < 0 ? "better" : row.pred.lo > 0 ? "worse" : "neutral";
}

const pct = (v: number | null) => (v === null ? "" : `${fmt(v, 2, true)}%`);

function describe(row: AblationRow): string {
  const parts = [row.label];
  const m = row.measured.map((v, i) => (v === null ? null : `${WIDTHS[i]} ${pct(v)}`)).filter(Boolean);
  if (m.length) parts.push(`measured ${m.join(", ")}`);
  if (row.serving !== undefined) parts.push(`serves ${row.serving.toFixed(1)}B active`);
  if (row.servingByContext) {
    const s = row.servingByContext.map((v, i) => (v === null ? null : `${CONTEXTS[i]} ${v.toFixed(2)}x`));
    parts.push(`serving ${s.filter(Boolean).join(", ")}`);
  }
  if (row.pred) parts.push(`predicted ${pct(row.pred.v)} (${pct(row.pred.lo)} to ${pct(row.pred.hi)})`);
  if (row.predByContext) {
    const p = row.predByContext.map((v, i) => (v === null ? null : `${CONTEXTS[i]} ${pct(v)}`));
    parts.push(`predicted ${p.filter(Boolean).join(", ")}`);
  }
  return parts.join(" · ");
}

type Panel = { key: string; title: string; axis: string; x: Scale; weight: number };

export function AblationChart({ spec }: { spec: AblationSpec }) {
  const { rows } = spec;
  const vs = spec.vs ?? "the parent";
  const nWidths = Math.max(...rows.map((r) => r.measured.length));
  const byContext = Boolean(spec.servingByContext);
  const rowH = byContext ? 36 : nWidths >= 3 ? 30 : 25;
  const labelW = Math.max(...rows.map((r) => textWidth(r.label, 12))) + 14;

  const defs: Omit<Panel, "x">[] = [
    { key: "measured", title: "measured: same width, same tokens", axis: `change in loss vs ${vs}, %\n(left is better)`, weight: 1.12 },
  ];
  if (spec.serving)
    defs.push({ key: "serving", title: "serving: model you can afford", axis: "active params at the baseline's\nFP8 serving cost, billions\n(dashed: parent)", weight: 1 });
  if (spec.servingByContext)
    defs.push({ key: "servingByContext", title: "serving: model you can afford", axis: `active params at equal FP8\nserving cost, x ${vs}'s\nat that context`, weight: 1 });
  if (spec.predicted)
    defs.push({ key: "predicted", title: "predicted: equal serving cost, 1T tokens", axis: `change in loss vs ${vs}\nat its target, %\n(left is better)`, weight: 1 });

  const W = defs.length >= 3 ? 800 : 700;
  const gap = 20;
  const avail = W - labelW - gap * (defs.length - 1);
  const total = defs.reduce((s, d) => s + d.weight, 0);
  let cursor = labelW;
  const panels: Panel[] = defs.map((d) => {
    const w = (avail * d.weight) / total;
    const axis = spec[d.key as "measured"] as PanelAxis;
    const x = scale("linear", axis.domain, [cursor + 4, cursor + w - 4], axis.ticks);
    cursor += w + gap;
    return { ...d, x };
  });
  const panel = (k: string) => panels.find((p) => p.key === k);
  const pw = (p: Panel) => p.x.range[1] - p.x.range[0] + 8;
  const oneLine = panels.every((p) => textWidth(p.title, 11.5) <= pw(p));
  const titles = panels.map((p) => (oneLine ? [p.title] : p.title.split(/(?<=:) /)));
  const axes = panels.map((p) => wrap(p.axis, pw(p) + gap - 4, 11));
  const top = 12 + Math.max(...titles.map((t) => t.length)) * 14;
  const bottom = top + rows.length * rowH + (spec.serving ? 14 : 6);
  const height = bottom + 34 + Math.max(...axes.map((a) => a.length)) * 14;
  const cy = (i: number) => top + (i + 0.5) * rowH;

  const barH = Math.min(7, (rowH * 0.74 - (nWidths - 1) * 1.5) / nWidths);
  const group = nWidths * barH + (nWidths - 1) * 1.5;

  return (
    <ChartFigure
      label={spec.label}
      subtitle={spec.subtitle}
      notes={spec.notes}
      minWidth={panels.length >= 3 ? 560 : 460}
      legend={legendFor(spec, nWidths)}
    >
      <svg viewBox={`0 0 ${W} ${height}`} className="chart-svg" role="img" aria-label={spec.label}>
        {panels.map((p, k) => (
          <g key={p.key}>
            {titles[k].map((t, j) => (
              <text key={t} className="chart-panel-title" x={p.x.range[0] - 4} y={top - 12 - (titles[k].length - 1 - j) * 14}>
                {t}
              </text>
            ))}
            <line className="chart-axis" x1={p.x.range[0] - 4} x2={p.x.range[0] - 4} y1={top - 6} y2={bottom} />
            <XAxis
              x={p.x}
              top={top - 6}
              bottom={bottom}
              title={axes[k]}
              zero={p.key === "measured" || p.key === "predicted" ? 0 : undefined}
            />
          </g>
        ))}

        {spec.serving && (() => {
          const x = panel("serving")!.x;
          const px = x(spec.serving.parent);
          return (
            <g>
              <line className="chart-ref" x1={px} x2={px} y1={top - 6} y2={bottom} />
              <text className="chart-value" x={px + 3} y={bottom - 3}>
                parent {spec.serving.parent.toFixed(1)}B
              </text>
            </g>
          );
        })()}
        {spec.servingByContext && (() => {
          const px = panel("servingByContext")!.x(1);
          return <line className="chart-ref" x1={px} x2={px} y1={top - 6} y2={bottom} />;
        })()}

        {rows.map((row, i) => (
          <g key={row.label} className="chart-row">
            <title>{describe(row)}</title>
            <rect className="chart-row-hit" x={0} y={cy(i) - rowH / 2} width={W} height={rowH} />
            <text className="chart-label" x={labelW - 10} y={cy(i)} dy="0.34em" textAnchor="end">
              {row.label}
            </text>
            <Measured row={row} x={panel("measured")!.x} clip={spec.measured.clip} y={cy(i) - group / 2} h={barH} />
            {row.serving !== undefined && <Serving v={row.serving} x={panel("serving")!.x} y={cy(i)} h={rowH * 0.6} />}
            {row.servingByContext && (
              <Lollipops values={row.servingByContext} x={panel("servingByContext")!.x} y={cy(i)} rowH={rowH} />
            )}
            {row.pred && <Predicted row={row} x={panel("predicted")!.x} y={cy(i)} />}
            {row.predByContext && <ContextDots values={row.predByContext} x={panel("predicted")!.x} y={cy(i)} rowH={rowH} />}
          </g>
        ))}
      </svg>
    </ChartFigure>
  );
}

function Measured({ row, x, clip, y, h }: { row: AblationRow; x: Scale; clip?: number; y: number; h: number }) {
  const max = clip ?? x.domain[1];
  return (
    <g>
      {row.measured.map((v, k) => {
        if (v === null) return null;
        const shown = Math.min(v, max);
        const [a, b] = [x(Math.min(0, shown)), x(Math.max(0, shown))];
        const yy = y + k * (h + 1.5);
        return (
          <g key={k}>
            <rect x={a} y={yy} width={Math.max(b - a, 0.75)} height={h} rx={1} fill={color[WIDTH_COLORS[k]]} />
            {v > max && (
              <text className="chart-value" x={b + 3} y={yy + h / 2} dy="0.34em">
                +{Math.round(v)}%
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Serving({ v, x, y, h }: { v: number; x: Scale; y: number; h: number }) {
  return (
    <g>
      <rect x={x(0)} y={y - h / 2} width={x(v) - x(0)} height={h} rx={1} fill={color.serve} />
      <text className="chart-value" x={x(v) + 3} y={y} dy="0.34em">
        {v.toFixed(1)}B
      </text>
    </g>
  );
}

function Predicted({ row, x, y }: { row: AblationRow; x: Scale; y: number }) {
  const { v, lo, hi } = row.pred!;
  const c = TONE[toneOf(row)];
  const own = row.own ?? row.measured.filter((m) => m !== null).length >= 3;
  const [d0, d1] = x.domain;
  if (v > d1) {
    const right = x.range[1] + 4;
    return (
      <g>
        <line x1={right - 12} x2={right} y1={y} y2={y} stroke={c} strokeWidth={2.5} strokeLinecap="round" />
        <text className="chart-value" x={right - 15} y={y} dy="0.34em" textAnchor="end">
          +{Math.round(v)}% →
        </text>
      </g>
    );
  }
  const clamp = (t: number) => Math.min(d1, Math.max(d0, t));
  return (
    <g>
      <line x1={x(clamp(lo))} x2={x(clamp(hi))} y1={y} y2={y} stroke={c} strokeWidth={2.25} strokeLinecap="round" />
      <Marker x={x(v)} y={y} r={5} fill={c} hollow={!own} />
    </g>
  );
}

const ctxOffset = (k: number, rowH: number) => (k - 1.5) * rowH * 0.21;

function Lollipops({ values, x, y, rowH }: { values: (number | null)[]; x: Scale; y: number; rowH: number }) {
  return (
    <g>
      {values.map((v, k) =>
        v === null ? null : (
          <g key={k}>
            <line x1={x(1)} x2={x(v)} y1={y + ctxOffset(k, rowH)} y2={y + ctxOffset(k, rowH)} stroke={color[CONTEXT_COLORS[k]]} strokeWidth={2} />
            <Marker x={x(v)} y={y + ctxOffset(k, rowH)} r={3.5} fill={color[CONTEXT_COLORS[k]]} />
          </g>
        ),
      )}
    </g>
  );
}

function ContextDots({ values, x, y, rowH }: { values: (number | null)[]; x: Scale; y: number; rowH: number }) {
  return (
    <g>
      {values.map((v, k) =>
        v === null ? null : <Marker key={k} x={x(v)} y={y + ctxOffset(k, rowH)} r={3.5} fill={color[CONTEXT_COLORS[k]]} />,
      )}
    </g>
  );
}

function legendFor(spec: AblationSpec, nWidths: number): LegendItem[] {
  const items: LegendItem[] = WIDTHS.slice(0, nWidths).map((w, k) => ({ label: w, color: WIDTH_COLORS[k] }));
  if (spec.servingByContext) {
    CONTEXTS.forEach((c, k) => items.push({ label: `${c} context`, color: CONTEXT_COLORS[k], mark: "dot" }));
  } else if (spec.predicted) {
    items.push({ label: "own exponent (3+ rungs)", color: "muted", mark: "dot" });
    items.push({ label: "borrows the parent's exponent", color: "muted", mark: "hollow" });
  }
  return items;
}
