// Data for the line, scatter and forest figures. Sources: the tables of the timeline
// tutorial in bux (docs/tutorials/timeline/tables), and, where a figure holds more than
// the tables do (training curves, per-seed points, label positions), values read off
// the original matplotlib figures.

import type { LegendItem } from "@/components/charts/figure";
import type { ColorName } from "@/components/charts/parts";
import type { Pt, XYMark, XYSpec } from "@/components/charts/xy";
import gradients from "./dense0-gradients.json";
import switchCurves from "./switch-16k.json";

const series = (ys: (number | null)[], xs = [0, 1, 2, 3]): Pt[] =>
  ys.flatMap((y, i) => (y === null ? [] : [[xs[i], y] as Pt]));
const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(2)}%`;

// ------------------------------------------------------------------ the 16k switch

export const switch16k: XYSpec = {
  kind: "xy",
  label: "Training loss through the switch to 16k context, with and without YaRN",
  x: { domain: [4100, 5430], ticks: [4200, 4400, 4600, 4800, 5000, 5200, 5400], format: 0, title: ["training step (d512; the 16k phase starts at 90%)"] },
  y: { domain: [1.65, 2.8], ticks: [1.8, 2, 2.2, 2.4, 2.6, 2.8], format: 1, title: ["training loss, nats per token"] },
  panelHeight: 270,
  margin: { l: 56, r: 10, t: 8, b: 48 },
  panels: [
    {
      marks: [
        { type: "rule", x: 4608, color: "grey", dash: "dot", width: 1.5 },
        { type: "text", x: 4608, y: 2.25, dx: -6, anchor: "end", text: ["16k phase", "starts"] },
        { type: "line", points: switchCurves.yarn as Pt[], color: "violet", title: "2021 reference, YaRN" },
        { type: "line", points: switchCurves.noyarn as Pt[], color: "yellow", title: "2021 reference, no YaRN" },
        { type: "line", points: switchCurves.base as Pt[], color: "red", title: "2020 baseline" },
        { type: "text", x: 5135, y: 1.895, text: "2020 baseline", strong: true },
        { type: "text", x: 5135, y: 1.832, text: "no YaRN", strong: true },
        { type: "text", x: 5135, y: 1.77, text: "YaRN", strong: true },
      ],
    },
  ],
  legend: [
    { label: "2021 reference, YaRN (median of seeds 0, 1, 2)", color: "violet", mark: "line" },
    { label: "2021 reference, no YaRN (median of seeds 0, 1, 2)", color: "yellow", mark: "line" },
    { label: "2020 baseline (seed 0)", color: "red", mark: "line" },
  ],
};

// ---------------------------------------------------------------- learning rates

const LR = [0, 1, 2, 3];
const lrRef: Pt[] = series([0.7497, 0.7475, 0.7572]);

function lrPanel(title: string, ys: number[], above: { at: number; label: string; dx?: number; dy?: number; anchor?: "start" | "middle" }[] = []): { title: string[]; marks: XYMark[] } {
  const pts: Pt[] = [...series(ys), ...above.map((a) => [a.at, 0.8] as Pt)];
  return {
    title: [title],
    marks: [
      { type: "line", points: lrRef, color: "violet", markers: "dot", r: 4, title: "2021 reference" },
      { type: "line", points: pts, color: "blue", title },
      { type: "points", points: series(ys), color: "blue", r: 4 },
      { type: "points", points: above.map((a) => [a.at, 0.8] as Pt), color: "blue", shape: "triangle", r: 4.5 },
      ...above.map(
        (a): XYMark => ({ type: "text", x: a.at, y: 0.8, text: a.label, dx: a.dx ?? 7, dy: a.dy ?? 0, anchor: a.anchor ?? "start", size: 10, strong: true }),
      ),
    ],
  };
}

export const stabilityLr: XYSpec = {
  kind: "xy",
  label: "Learning-rate scans for the stability changes",
  x: { domain: [-0.45, 3.75], ticks: LR, tickLabels: ["1", "2", "4", "8"], title: ["learning rate, units of 10⁻³ (d512, seed 0)"] },
  y: { domain: [0.715, 0.806], ticks: [0.72, 0.74, 0.76, 0.78, 0.8], format: 2, title: ["objective, bits per byte"] },
  cols: 4,
  panelHeight: 120,
  gap: [14, 40],
  margin: { l: 56, r: 22, t: 24, b: 48 },
  panels: [
    lrPanel("QK-norm", [0.7452, 0.7388, 0.7448, 0.7487]),
    lrPanel("soft cap", [0.7523, 0.7455, 0.7525, 0.7828]),
    lrPanel("sandwich norms", [0.7557, 0.7509, 0.7904], [{ at: 3, label: "0.84" }]),
    lrPanel("post-branch norms", [], [
      { at: 0, label: "0.89", dx: 0, dy: 12, anchor: "middle" },
      { at: 1, label: "1.43", dx: 0, dy: 12, anchor: "middle" },
      { at: 2, label: "1.65", dx: 0, dy: 12, anchor: "middle" },
      { at: 3, label: "2.99" },
    ]),
    lrPanel("gated attention", [0.7418, 0.7316, 0.7535], [{ at: 3, label: "3.07" }]),
    lrPanel("hyper-connections", [0.7357, 0.7228, 0.7543], [{ at: 3, label: "1.07" }]),
    lrPanel("mHC (fixed init)", [0.7369, 0.73, 0.7346], [{ at: 3, label: "0.88" }]),
  ],
  legend: [
    { label: "2021 reference", color: "violet", mark: "line-dot" },
    { label: "the panel's arm", color: "blue", mark: "line-dot" },
    { label: "above the scale (value printed)", color: "blue", mark: "triangle" },
  ],
  notes: ["The reference wasn't run at 8e-3."],
};

// ------------------------------------------------------- serving size by context

const ctxX = [4.3, 6, 7, 8]; // log2 of the context in thousands of tokens
const refTarget = [3.7, 4.1, 2.7, 2.8];
const times = (mult: number[]) => series(mult.map((m, i) => Number((m * refTarget[i]).toFixed(2))), ctxX);

const servingLines: [string, ColorName, Pt[]][] = [
  ["2021 reference", "violet", series(refTarget, ctxX)],
  ["GQA, 4 kv heads", "aqua", times([3.73, 2.55, 2.79, 2.06])],
  ["MQA", "yellow", times([9.04, 6.0, 5.35, 3.01])],
  ["sliding window", "magenta", times([3.67, 4.04, 5.63, 5.01])],
  ["KDA", "green", times([3.59, 3.52, 5.1, 4.94])],
  ["Mamba-2", "red", times([3.91, 4.09, 5.89, 5.29])],
];

export const servingContext: XYSpec = {
  kind: "xy",
  label: "Model size affordable at equal serving cost, by context length",
  x: {
    domain: [3.85, 8.45],
    ticks: ctxX,
    tickLabels: ["16-24k\n1,924/h", "64k\n634/h", "128k\n290/h", "256k\n121/h"],
    title: ["context, tokens (under it: the budget model's sessions per hour per GPU)"],
  },
  y: { kind: "log", domain: [2.3, 42], ticks: [3, 5, 10, 20, 30], title: ["parameters per token at equal cost, billions"] },
  panelHeight: 300,
  margin: { l: 56, r: 10, t: 8, b: 64 },
  panels: [
    {
      marks: servingLines.map(([name, c, pts]): XYMark => ({ type: "line", points: pts, color: c, markers: "dot", r: 5, title: name })),
    },
  ],
  legend: servingLines.map(([label, color]) => ({ label, color, mark: "line-dot" as const })),
};

// ----------------------------------------------------- the best models by context

const contextLines: [string, ColorName, (number | null)[], boolean?][] = [
  ["2026 hybrid + hc + V + K (candidate)", "blue", [-0.44, -0.5, -0.44, -0.47]],
  ["candidate + copy pointer + GatedNorm", "red", [-0.95, -0.98, -0.93, -0.91]],
  ["candidate + copy pointer", "green", [-0.81, -0.84, -0.79, -0.78]],
  ["mHC in place of hc", "violet", [-0.71, -0.81, -0.69, -0.75]],
  ["AttnRes in place of hc", "magenta", [-0.41, -0.4, -0.4, -0.37]],
  ["candidate + DSA, IndexShare 1 in 4", "yellow", [-0.28, -0.46, -0.57, -0.45], true],
];

export const contextBest: XYSpec = {
  kind: "xy",
  label: "Serving comparison of the best models at each context",
  subtitle: "quality trained and measured at 16k tokens or less: only the serving cost changes with context",
  x: { domain: [-0.2, 3.75], ticks: [0, 1, 2, 3], tickLabels: ["16-24k", "64k", "128k", "256k"], title: ["context, tokens (each context's FP8 targets of equal serving cost)"] },
  y: { domain: [-1.2, 1.3], ticks: [-1, -0.5, 0, 0.5, 1], format: 1, title: ["predicted objective vs the 2026 hybrid,", "1T tokens, % (lower is better)"] },
  panelHeight: 320,
  margin: { l: 64, r: 10, t: 8, b: 48 },
  panels: [
    {
      marks: [
        { type: "rule", y: 0, color: "orange", width: 2 },
        { type: "text", x: 3, y: 0, dx: 12, dy: -10, text: "2026 hybrid", color: "orange", size: 10.5 },
        { type: "line", points: series([0.33, 0.17, 0.24, 0.45]), color: "ink", dash: "dash", width: 2.25, markers: "dot", r: 5, title: "2026 frontier" },
        { type: "line", points: series([0.08, 0.03, 0.53, 1.1]), color: "ink", dash: "dot", width: 2.25, markers: "dot", r: 5, title: "DeepSeek-V3, DeepSeek's dims" },
        { type: "text", x: 3, y: 1.1, dx: 12, text: "DeepSeek-V3*", size: 10.5 },
        { type: "text", x: 3, y: 0.45, dx: 12, text: "2026 frontier", size: 10.5 },
        ...contextLines.map(([name, c, ys, hollow]): XYMark => ({ type: "line", points: series(ys), color: c, markers: hollow ? "hollow" : "dot", r: 5, title: name })),
        { type: "points", points: [[0, -0.3], [3, -0.35]], color: "aqua", hollow: true, r: 5 },
        {
          type: "text",
          x: "left",
          y: "top",
          dx: 8,
          dy: 10,
          size: 10.5,
          text: ["Llama 3: +4.2 / +4.8 / +5.5 / +6.2%, off the axis", "candidate + DSA: no target at 64k, 128k", "* sized at DeepSeek's MLA dims"],
        },
      ],
    },
  ],
  legend: [
    ...contextLines.map(([label, color, , hollow]): LegendItem => ({ label, color, mark: hollow ? "line-hollow" : "line-dot" })),
    { label: "candidate + DSA", color: "aqua", mark: "hollow" },
    { label: "2026 frontier", color: "ink", mark: "dash" },
    { label: "DeepSeek-V3*", color: "ink", mark: "dot-line" },
    { label: "hollow: ≤ 2 rungs, borrows its parent's exponent", color: "muted", mark: "hollow" },
  ],
};

// ------------------------------------------------------------- dense0 gradients

const gradPanel = (name: string, points: Pt[], c: ColorName, stats: string, extra: XYMark[] = []) => ({
  marks: [
    { type: "rule", x: 4608, color: "grey", dash: "dot", width: 1.25 },
    { type: "rule", y: 1, color: "ink", dash: "dash", width: 1.25 },
    { type: "line", points, color: c, width: 1.1, title: name },
    { type: "text", x: "left", y: "top", dx: 6, dy: 11, text: name, strong: true, size: 11 },
    { type: "text", x: "right", y: "top", dx: -4, dy: 11, text: stats, anchor: "end", size: 10 },
    ...extra,
  ] as XYMark[],
});

export const dense0Gradients: XYSpec = {
  kind: "xy",
  label: "Gradient norms with the dense layer first, routed, and last",
  x: { domain: [-150, 5300], ticks: [0, 1000, 2000, 3000, 4000, 5000], format: 0, title: ["training step (d512, seed 0)"] },
  y: { kind: "log", domain: [0.13, 11], ticks: [0.2, 0.5, 1, 2, 5], title: ["gradient norm, before clipping"] },
  panelHeight: 112,
  gap: [0, 14],
  margin: { l: 52, r: 8, t: 6, b: 48 },
  panels: [
    gradPanel("candidate: a dense first layer", gradients.candidate as Pt[], "blue", "seeds 0/1/2: clipped 9.9/9.0/11.1% of steps, 22/21/31 spikes"),
    gradPanel("no dense layer (dense0)", gradients.dense0 as Pt[], "aqua", "seeds 0/1/2: clipped 2.5/1.1/0.2% of steps, 16/15/3 spikes"),
    gradPanel("the dense layer last (dense_last)", gradients.dense_last as Pt[], "magenta", "seeds 0/1/2: clipped 0.2/0.0/0.0% of steps, 4/3/5 spikes", [
      { type: "text", x: 4608, y: 2.7, dx: -6, anchor: "end", text: "16k phase", size: 10 },
      { type: "text", x: 2700, y: 1, dy: -9, anchor: "middle", text: "clip at 1.0", size: 10 },
    ]),
  ],
  legend: [
    { label: "candidate", color: "blue", mark: "line" },
    { label: "no dense layer", color: "aqua", mark: "line" },
    { label: "dense layer last", color: "magenta", mark: "line" },
  ],
};

// ------------------------------------------------------- index sharing by position

type Seeds = [string, number[]][];
function sharePanel(title: string[], c: ColorName, d768: Seeds, d512: number[][], labelY: number[]) {
  return {
    title,
    marks: [
      ...d512.map((ys): XYMark => ({ type: "line", points: series(ys), color: "grey", width: 1.5, markers: "dot", r: 3.5, title: "d512" })),
      ...d768.map(([seed, ys]): XYMark => ({ type: "line", points: series(ys), color: c, width: 2.25, markers: "dot", r: 4.5, title: `d768, ${seed}` })),
      ...d768.map(([seed], k): XYMark => ({ type: "text", x: 2, y: labelY[k], dx: 8, text: seed, size: 10.5, strong: true })),
    ],
  };
}

export const indexshare: XYSpec = {
  kind: "xy",
  label: "Index sharing by position in the repository",
  subtitle: "d768: 3 seeds (IndexShare 1 in 2: 2)",
  x: { domain: [-0.35, 2.75], ticks: [0, 1, 2], tickLabels: ["0", "2k", "8k"], title: ["position in the repository context, tokens"] },
  y: { domain: [-1.85, 6.9], ticks: [-1, 0, 1, 2, 3, 4, 5, 6], zero: 0, format: 0, title: ["repo bpb change vs the candidate, %"] },
  cols: 4,
  panelHeight: 230,
  gap: [12, 40],
  margin: { l: 50, r: 14, t: 34, b: 48 },
  panels: [
    sharePanel(["IndexShare", "1 in 4"], "yellow", [["s0", [0.62, 2.85, 6.47]], ["s1", [0.1, 0.4, 1.12]], ["s2", [-0.17, -0.08, -0.14]]], [[0.5, 1.05, 1.13], [0.1, 0.14, 0.21], [-0.2, -0.4, -0.45]], [6.47, 1.12, -0.2]),
    sharePanel(["IndexShare", "1 in 2"], "green", [["s0", [0.2, 0.6, 1.37]], ["s1", [-0.14, -0.2, 0.1]], ["s2", [-0.14, -0.22, -0.12]]], [], [1.37, 0.3, -0.22]),
    sharePanel(["1 in 4 with the", "cross-layer loss"], "magenta", [["s0", [0.5, 0.2, 0.22]], ["s1", [0.05, 0.05, 0.24]], ["s2", [-0.02, 0, -0.15]]], [[0.5, 0.93, 1.03], [0.25, 0.05, 0.12], [-0.12, -0.48, -0.47]], [0.7, 0.24, -0.2]),
    sharePanel(["DSA, an indexer", "per global layer"], "aqua", [["s2", [0.48, 0.57, 0.53]], ["s1", [0.23, 0.26, 0.25]], ["s0", [-0.07, -0.22, -0.21]]], [[0.48, 0.91, 0.93], [0, -0.15, -0.16], [-0.8, -1.3, -1.48]], [0.6, 0.22, -0.25]),
  ],
  legend: [
    { label: "d768, a line per seed (s0, s1, s2), in the arm's color", color: "ink", mark: "line-dot" },
    { label: "d512, a line per seed (0, 1, 2)", color: "grey", mark: "line-dot" },
  ],
};

// ------------------------------------------------------------------- the compass

type Labeled = { x: number; y: number; label?: string; dx?: number; dy?: number; anchor?: "start" | "middle" | "end" };

const compassGroups: [string, ColorName, Labeled[]][] = [
  ["positions, norms, other", "green", [
    { x: 0.599, y: 1.19, label: "DyT (scaled embedding)", dy: -12, anchor: "middle" },
    { x: 0.755, y: 0.998, label: "untied head", dy: -12, anchor: "middle" },
    { x: 1.1, y: 0.554, label: "deep and thin", dx: 7 },
    { x: 0.831, y: 1.01 }, { x: 0.975, y: 0.994 }, { x: 0.994, y: 0.991 }, { x: 1.04, y: 1.0 }, { x: 1.07, y: 0.998 },
    { x: 1.09, y: 0.899 }, { x: 1.12, y: 0.998 }, { x: 1.23, y: 0.991 }, { x: 1.35, y: 0.998 }, { x: 1.62, y: 0.991 },
    { x: 1.96, y: 0.987 }, { x: 2.14, y: 0.991 }, { x: 2.25, y: 0.991 }, { x: 2.4, y: 0.991 },
  ]],
  ["residual streams", "yellow", [
    { x: 1.67, y: 0.879, label: "hyper-connections", dx: 7, dy: 6 },
    { x: 1.42, y: 1.0 }, { x: 1.47, y: 1.03 }, { x: 1.51, y: 0.954 }, { x: 1.21, y: 0.983 },
  ]],
  ["MLP", "magenta", [{ x: 1.18, y: 1.07 }, { x: 1.26, y: 1.01 }]],
  ["softmax attention", "aqua", [
    { x: 0.742, y: 9.0, label: "MQA", dx: 7 },
    { x: 0.969, y: 3.72, label: "GQA", dx: 7 },
    { x: 1.04, y: 5.29, label: "MLA", dx: 7, dy: -6 },
    { x: 1.06, y: 1.21, label: "heads of 128", dx: 7, dy: -7 },
    { x: 2.05, y: 1.04, label: "gated attn + QK-norm", dx: 8, dy: -13, anchor: "middle" },
    { x: 1.16, y: 1.0 }, { x: 1.29, y: 0.958 },
  ]],
  ["linear and windowed hybrids", "orange", [
    { x: 0.702, y: 4.02, label: "SWA 2048", dy: -12, anchor: "middle" },
    { x: 0.814, y: 3.68, label: "SWA 512", dy: 12, anchor: "middle" },
    { x: 0.852, y: 7.22, label: "SWA, 1 global in 8", dx: 7, dy: -7 },
    { x: 0.983, y: 4.83, label: "SWA 128", dx: 6, dy: 8 },
    { x: 1.05, y: 2.56, label: "SWA, every other layer", dx: -8, anchor: "end" },
    { x: 1.24, y: 3.89, label: "Mamba-2", dy: 12, anchor: "middle" },
    { x: 1.51, y: 4.1, label: "Gated DeltaNet", dx: 7, dy: -7 },
    { x: 1.7, y: 6.62, label: "KDA, 1 global in 8", dx: 7, dy: -6 },
    { x: 1.71, y: 2.15, label: "RWKV-7", dx: 7 },
    { x: 1.72, y: 2.59, label: "KDA, every other layer", dx: 7 },
    { x: 2.01, y: 1.58, label: "GDN-2", dx: 7, dy: -6 },
    { x: 2.14, y: 3.59, label: "KDA", dx: 7, dy: -6 },
  ]],
  ["MoE", "blue", [
    { x: 1.91, y: 0.794, label: "Mixtral 8x2", dx: -8, dy: 4, anchor: "end" },
    { x: 4.38, y: 0.726, label: "DeepSeekMoE", dx: -8, dy: 4, anchor: "end" },
    { x: 4.62, y: 0.777, label: "LatentMoE", dx: -8, dy: -3, anchor: "end" },
    { x: 5.02, y: 0.812, label: "DeepSeek-V3 MoE", dx: 0, dy: -12, anchor: "middle" },
  ]],
];

const mult = (v: number) => `${Number(v.toPrecision(3))}x`;

export const compass: XYSpec = {
  kind: "xy",
  label: "Every single change: quality per parameter against serving cost",
  x: { kind: "log", domain: [0.5, 6.4], ticks: [0.5, 1, 2, 4], format: "x", title: ["quality: worth N times its parameters (effective-parameter multiplier at the rungs)"] },
  y: { kind: "log", domain: [0.5, 16], ticks: [0.5, 1, 2, 4, 8, 16], format: "x", title: ["serving: parameters you can serve at the", "same FP8 cost, x the parent"] },
  panelHeight: 400,
  margin: { l: 66, r: 8, t: 8, b: 48 },
  panels: [
    {
      marks: [
        { type: "rule", x: 1, strong: true },
        { type: "rule", y: 1, strong: true },
        { type: "text", x: "left", y: "top", dx: 8, dy: 10, size: 10.5, text: ["worse per parameter,", "but cheaper to serve"] },
        { type: "text", x: "right", y: "top", dx: -8, dy: 10, size: 10.5, anchor: "end", text: ["better per parameter", "and cheaper to serve"] },
        { type: "text", x: "left", y: "bottom", dx: 8, dy: -10, size: 10.5, text: "worse, and costs more" },
        { type: "text", x: "right", y: "bottom", dx: -8, dy: -22, size: 10.5, anchor: "end", text: ["better per parameter,", "but costs more to serve"] },
        ...compassGroups.map(([group, c, pts]): XYMark => ({
          type: "points",
          color: c,
          r: 4.5,
          points: pts.map((p) => ({ x: p.x, y: p.y, title: `${p.label ?? group}: ${mult(p.x)} per parameter, serves ${mult(p.y)}` })),
        })),
        ...compassGroups.flatMap(([, , pts]) =>
          pts
            .filter((p) => p.label)
            .map((p): XYMark => ({ type: "text", x: p.x, y: p.y, text: p.label!, dx: p.dx ?? 0, dy: p.dy ?? 0, anchor: p.anchor ?? "start", size: 10.5, strong: true })),
        ),
      ],
    },
  ],
  legend: compassGroups.map(([label, color]) => ({ label, color, mark: "dot" as const })).reverse(),
  notes: ["Not shown, far worse per parameter: NoPE everywhere, post-norm alone, DyT."],
};

// ------------------------------------------------------------------ shrink

type Shrink = { x: number; y: number; c: ColorName; label?: string; at?: Pt; anchor?: "start" | "end"; square?: boolean };
const shrinkPts: Shrink[] = [
  { x: -4.78, y: -3.07, c: "blue", label: "stack6 −4.78 → −3.07", at: [-2.3, -3.2] },
  { x: -4.84, y: -2.79, c: "blue", label: "stack5 −4.84 → −2.79", at: [-2.3, -2.82] },
  { x: -4.14, y: -2.45, c: "blue", label: "copy pointer −4.14 → −2.45", at: [-2.3, -2.45] },
  { x: -4.02, y: -2.18, c: "blue" },
  { x: -2.18, y: -1.77, c: "blue", square: true, label: "Muon (training) −2.18 → −1.77", at: [-1.55, -1.88] },
  { x: -0.71, y: -0.49, c: "blue", label: "GatedNorm −0.71 → −0.49", at: [-2, -0.75], anchor: "end" },
  { x: -0.36, y: -0.53, c: "blue" },
  { x: -1.17, y: -0.11, c: "grey", label: "E+G+O+L (stack3) −1.17 → −0.12", at: [-2, 0.1], anchor: "end" },
  { x: -0.5, y: -0.1, c: "grey", label: "doc copy −0.51 → −0.10", at: [-2, -0.35], anchor: "end" },
  { x: -0.42, y: -0.27, c: "grey", label: "dense layer last −0.42 → −0.27", at: [-0.45, -1.2] },
  { x: -0.35, y: 0.02, c: "grey" },
  { x: -0.23, y: 0.06, c: "grey" },
  { x: -0.19, y: -0.05, c: "grey" },
  { x: -0.24, y: -0.12, c: "grey" },
  { x: -0.13, y: 0.15, c: "grey" },
  { x: -0.03, y: 0.14, c: "grey" },
  { x: 0.11, y: 0.12, c: "grey" },
  { x: 0.12, y: 0.06, c: "grey" },
  { x: -0.73, y: 0.74, c: "red", label: "E+O+L (stack3) −0.73 → +0.74", at: [-1.9, 0.74], anchor: "end" },
  { x: -0.73, y: 0.79, c: "red", label: "embedding × √d −0.73 → +0.79", at: [-2.3, 1.02], anchor: "end" },
  { x: 0.14, y: 0.43, c: "red" },
  { x: 0.42, y: 0.67, c: "red" },
  { x: 0.64, y: 0.74, c: "red", label: "AttnRes in place of hc +0.64 → +0.74", at: [-0.9, 1.42], anchor: "end" },
];

export const shrink: XYSpec = {
  kind: "xy",
  label: "Most d=512 wins don't survive one width",
  x: { domain: [-5.4, 1.4], ticks: [-5, -4, -3, -2, -1, 0, 1], format: 0, title: ["change vs the candidate at d512, % (paired by seed, 3 seeds)"] },
  y: { domain: [-3.5, 1.6], ticks: [-3, -2, -1, 0, 1], format: 0, title: ["change vs the candidate at d768, % (paired by seed)"] },
  panelHeight: 400,
  margin: { l: 52, r: 8, t: 8, b: 48 },
  panels: [
    {
      marks: [
        { type: "band", y: [-0.33, 0.33] },
        { type: "text", x: "left", y: 0.33, dx: 6, dy: -9, text: "±0.33%: a run's paired noise", size: 10.5 },
        { type: "rule", x: 0, strong: true },
        { type: "rule", y: 0, strong: true },
        { type: "segment", from: [-3.5, -3.5], to: [1.4, 1.4], color: "ink", dash: "dash", width: 1.5 },
        { type: "text", x: -3.55, y: -3.5, dy: -8, anchor: "end", text: "y = x", size: 10.5 },
        ...shrinkPts.filter((p) => p.label).map((p): XYMark => ({ type: "segment", from: [p.x, p.y], to: p.at!, color: "subtle", width: 0.8 })),
        {
          type: "points",
          color: "blue",
          r: 5,
          points: shrinkPts.map((p) => ({ x: p.x, y: p.y, color: p.c, shape: p.square ? "square" : "circle", hollow: p.square, title: p.label ?? `${pct(p.x)} at d512 → ${pct(p.y)} at d768` })),
        },
        ...shrinkPts
          .filter((p) => p.label)
          .map((p): XYMark => ({ type: "text", x: p.at![0], y: p.at![1], dx: p.anchor === "end" ? -3 : 3, anchor: p.anchor ?? "start", text: p.label!, size: 10.5, strong: true })),
      ],
    },
  ],
  legend: [
    { label: "better at d768", color: "blue", mark: "dot" },
    { label: "within the noise at d768", color: "grey", mark: "dot" },
    { label: "worse at d768", color: "red", mark: "dot" },
    { label: "a training option, d768 on 1 seed", color: "blue", mark: "hollow-square" },
  ],
  notes: ["Circles: d768 on 2 seeds."],
};

// --------------------------------------------------------------- factorial forest

const factorialRows: [string, number, number, ColorName, string][] = [
  ["R: hyper-connections", -1.8, 0.2, "blue", "t = −18.5"],
  ["R: AttnRes", -1.12, 0.22, "blue", "t = −10.0"],
  ["V: value residual", -0.43, 0.16, "blue", "t = −5.1"],
  ["K: key-value conv", -0.69, 0.16, "blue", "t = −8.2"],
  ["F: ReLU² experts", 0.68, 0.18, "red", "t = +7.8"],
  ["P: partial RoPE", 0.17, 0.16, "red", "t = +2.0"],
  ["S: DSA indexer", 0.01, 0.18, "grey", "t = +0.1"],
  ["hc × F (interaction model)", -1.02, 0.7, "blue", "t = −2.9"],
];
const factorialY = [0, 1, 2, 3, 4, 5, 6, 7.5];

export const factorial: XYSpec = {
  kind: "xy",
  label: "Average effect of each change in round 1",
  x: { domain: [-2.2, 0.95], ticks: [-2, -1.5, -1, -0.5, 0, 0.5], format: 1, title: ["effect on the objective, % (± 2 standard errors; below 0 is better)"] },
  y: { domain: [8.1, -0.6], ticks: factorialY, tickLabels: factorialRows.map((r) => r[0]), grid: false, rowLabels: true },
  panelHeight: 250,
  margin: { l: 160, r: 120, t: 6, b: 48 },
  panels: [
    {
      marks: [
        { type: "rule", x: 0, strong: true },
        ...factorialRows.flatMap(([label, v, e, c, t], i): XYMark[] => [
          { type: "errorbar", dir: "h", at: factorialY[i], lo: v - e, hi: v + e, color: c, width: 3 },
          { type: "points", points: [{ x: v, y: factorialY[i], title: `${label}: ${pct(v)} ± ${e.toFixed(2)}, ${t}` }], color: c, r: 6 },
          { type: "text", x: "right", y: factorialY[i], dx: 50, anchor: "end", text: pct(v), strong: true, size: 11 },
          { type: "text", x: "right", y: factorialY[i], dx: 58, text: t, size: 11 },
        ]),
      ],
    },
  ],
};

// ------------------------------------------------------------------ copy pointer

type Ladder = [string, ColorName, [number, number][], number, [number, number]?];
const ladders: Ladder[] = [
  ["2026 hybrid + hc + V + K (candidate)", "blue", [[-2.61, 0.2], [-2.16, 0.22], [-1.88, 0.16], [-1.84, 0.02]], -0.44],
  ["candidate + copy pointer", "green", [[-6.65, 0.25], [-4.57, 0.22], [-3.3, 0]], -0.81],
  ["candidate + copy pointer + GatedNorm", "red", [[-7.32, 0.21], [-4.89, 0.27], [-3.64, 0], [-3.4, 0]], -0.95],
  ["candidate, its dense layer last", "magenta", [[-3.03, 0.3], [-2.43, 0.35], [-2.21, 0]], -0.98, [-0.98, -0.74]],
  ["mHC in place of hc", "violet", [[-2.84, 0.25], [-2.1, 0.12], [-1.78, 0.06], [-1.72, 0]], -0.71, [-0.93, -0.5]],
];

export const cplmRungs: XYSpec = {
  kind: "xy",
  label: "The copy pointer, alone and with other additions, against the hybrid",
  x: { domain: [-0.45, 5.55], ticks: [0, 1, 2, 3, 4.95], tickLabels: ["d512", "d768", "d1024", "d1280", "target,\n1T tokens"], grid: false, title: ["rung (d_model), then the target at equal FP8 serving cost"] },
  y: { domain: [-8.4, 0.75], ticks: [-8, -6, -4, -2, 0], format: 0, title: ["objective vs the 2026 hybrid, % (lower is better)"] },
  panelHeight: 330,
  margin: { l: 52, r: 8, t: 8, b: 62 },
  panels: [
    {
      marks: [
        { type: "rule", y: 0, color: "orange", width: 2 },
        { type: "text", x: "left", y: 0, dx: 8, dy: -10, text: "2026 hybrid", color: "orange", size: 10.5 },
        { type: "rule", x: 4.1, color: "ink", dash: "dot", width: 1.25 },
        { type: "text", x: "left", y: "bottom", dx: 8, dy: -9, text: "measured: equal width and tokens, paired by seed (bars ±1 sd)", size: 10 },
        { type: "text", x: 4.95, y: "bottom", dy: -22, anchor: "middle", text: ["predicted:", "equal FP8 cost"], size: 10 },
        ...ladders.flatMap(([name, c, rungs, target, range], k): XYMark[] => {
          const tx = 4.71 + k * 0.12;
          return [
            ...rungs.filter(([, sd]) => sd > 0).map(([v, sd], i): XYMark => ({ type: "errorbar", at: i, lo: v - sd, hi: v + sd, color: c, width: 1.5 })),
            { type: "line", points: rungs.map(([v], i) => [i, v] as Pt), color: c, width: 2.25, markers: "dot", r: 5.5, title: name },
            ...(range ? [{ type: "errorbar", at: tx, lo: range[0], hi: range[1], color: c, width: 1.5 } as XYMark] : []),
            { type: "points", points: [{ x: tx, y: target, title: `${name}: ${pct(target)} at the target` }], color: c, r: 5.5 },
          ];
        }),
      ],
    },
  ],
  legend: ladders.map(([label, color]) => ({ label, color, mark: "line-dot" as const })),
};

// -------------------------------------------------------------------- milestones

type Milestone = [string, number | null, number, number, number, ColorName, "pred" | "meas"];
const milestoneRows: Milestone[] = [
  ["GPT-3", null, 0, 0, 0, "ink", "meas"],
  ["GPT-NeoX", -0.29, -1.43, 0.83, -3.36, "ink", "meas"],
  ["PaLM", -3.98, -4.72, -3.06, -1.14, "ink", "pred"],
  ["Llama 2", -3.99, -4.77, -3.4, -2.22, "ink", "pred"],
  ["Llama 3", -4.71, -5.46, -4.11, -3.32, "ink", "pred"],
  ["DeepSeek-V3*", -8.42, -9.04, -7.84, -9.66, "ink", "meas"],
  ["Qwen3-Next", -8.51, -9.18, -7.98, -12.47, "ink", "meas"],
  ["2026 frontier", -8.24, -8.91, -7.47, -10.77, "ink", "meas"],
  ["2026 hybrid", -8.55, -9.28, -8.17, -13.25, "orange", "meas"],
  ["the candidate", -8.95, -9.38, -8.95, -15.06, "blue", "meas"],
];

export const milestones: XYSpec = {
  kind: "xy",
  label: "The milestones, measured and at the target",
  x: { domain: [-0.55, 9.6], ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], tickLabels: ["2020", "2021", "2022", "2023", "2024", "2024", "2025", "2026", "2026", "today"], grid: false, title: ["the milestone's year"] },
  y: { domain: [-17.2, 2.2], ticks: [-15, -12.5, -10, -7.5, -5, -2.5, 0], format: 1, title: ["objective vs the 2020 baseline, %", "(lower is better)"] },
  panelHeight: 340,
  margin: { l: 66, r: 8, t: 8, b: 48 },
  panels: [
    {
      marks: [
        { type: "rule", y: 0, strong: true },
        ...milestoneRows.flatMap(([name, pred, lo, hi, meas, c, below], i): XYMark[] => {
          const marks: XYMark[] = [];
          if (pred !== null) {
            marks.push({ type: "segment", from: [i, pred], to: [i, meas], color: "subtle", dash: "dot", width: 1.25 });
            marks.push({ type: "errorbar", at: i, lo, hi, color: c, width: 3 });
            marks.push({ type: "points", points: [{ x: i, y: pred, title: `${name}: ${pct(pred)} predicted (${pct(lo)} to ${pct(hi)})` }], color: c, r: 6.5 });
          }
          marks.push({ type: "points", points: [{ x: i, y: meas, title: `${name}: ${pct(meas)} measured at d768` }], color: c, r: pred === null ? 6 : 4.5, hollow: true });
          const anchorY = below === "pred" && pred !== null ? Math.min(pred, lo) : meas;
          marks.push({ type: "text", x: i, y: anchorY, dy: 17, anchor: "middle", text: name, size: 10.5, strong: true });
          return marks;
        }),
        { type: "text", x: "left", y: "bottom", dx: 6, dy: -9, text: "* sized at DeepSeek's MLA dims", size: 10 },
      ],
    },
  ],
  legend: [
    { label: "predicted at target: 1T tokens, equal FP8 serving cost (bar: range)", color: "ink", mark: "dot" },
    { label: "measured at d768: equal width and tokens", color: "ink", mark: "hollow" },
  ],
};

// -------------------------------------------------------------- best at target

type Best = [string, number, boolean, number, number, number | null, string];
const bestRows: Best[] = [
  ["stack5, no dense layer", -1.167, true, -1.167, -1.006, -1.113, "d512-d768"],
  ["stack5, its dense layer last", -1.165, true, -1.165, -1.006, -1.104, "d512-d768"],
  ["candidate + copy pointer + GatedNorm + VE + XSA + diff", -1.057, true, -1.057, -0.963, -1.005, "d512-d768"],
  ["candidate + copy pointer, 4k window", -1.05, true, -1.156, -0.914, -1.156, "d512-d768"],
  ["candidate, its dense layer last", -0.98, false, -1.094, -0.723, -1.094, "d512-d1024"],
  ["candidate + copy pointer + GatedNorm", -0.95, false, -0.95, -0.812, -0.873, "d512-d1280"],
  ["hybrid + hc + V", -0.83, false, -0.934, -0.572, -0.934, "d512-d1280"],
  ["candidate + copy pointer", -0.81, false, -0.943, -0.723, -0.943, "d512-d1024"],
  ["mHC in place of hc", -0.71, false, -0.934, -0.501, -0.934, "d512-d1280"],
  ["candidate + GatedNorm + VE + XSA + diff", -0.46, true, -0.518, -0.38, -0.38, "d768"],
  ["2026 hybrid + hc + V + K (candidate)", -0.44, false, -0.571, -0.44, -0.571, "d512-d1280"],
  ["candidate, no dense layer", -0.41, true, -0.571, -0.41, -0.571, "d512-d768"],
  ["AttnRes in place of hc", -0.41, false, -0.429, -0.32, -0.429, "d512-d1280"],
  ["IndexShare 1 in 4 + cross-layer loss", -0.41, true, -0.456, -0.41, null, "d512-d768"],
  ["candidate + DSA, IndexShare 1 in 2", -0.32, true, -0.611, -0.32, -0.611, "d768"],
  ["candidate + DSA", -0.29, true, -0.601, -0.29, -0.601, "d512-d768"],
  ["candidate + DSA, IndexShare 1 in 4", -0.28, true, -0.561, -0.28, -0.561, "d512-d768"],
  ["candidate + QSA (blocks of 4)", -0.19, true, -0.58, -0.19, -0.58, "d512-d768"],
  ["candidate + MSA (blocks per kv group)", -0.17, true, -0.592, -0.17, -0.592, "d512-d768"],
];
const CANDIDATE = 10;

export const bestAtTarget: XYSpec = {
  kind: "xy",
  label: "The best models at equal serving cost, against the 2026 hybrid",
  x: {
    domain: [-1.29, 0.03],
    ticks: [-1.25, -1, -0.75, -0.5, -0.25, 0],
    format: 2,
    title: ["predicted change vs the 2026 hybrid, 1T tokens,", "equal FP8 serving cost, % (lower is better)"],
  },
  y: { domain: [18.6, -1.6], ticks: bestRows.map((_, i) => i), tickLabels: bestRows.map((r) => r[0]), grid: false, rowLabels: true },
  panelHeight: 470,
  width: 720,
  margin: { l: 322, r: 78, t: 4, b: 62 },
  panels: [
    {
      marks: [
        { type: "band", x: [-0.96, -0.44] },
        { type: "text", x: -0.7, y: -1.05, anchor: "middle", text: ["the fit can't rank", "within this band"], size: 10 },
        { type: "rule", x: 0, color: "orange", width: 2 },
        { type: "text", x: 0, y: -0.85, dx: -4, anchor: "end", text: "2026 hybrid", color: "orange", size: 10.5 },
        { type: "text", x: "right", y: -0.85, dx: 10, text: "rungs", size: 10.5, strong: true },
        ...bestRows.flatMap(([name, p, hollow, lo, hi, tick, rungs], i): XYMark[] => {
          const c: ColorName = i === CANDIDATE ? "blue" : "ink";
          const marks: XYMark[] = [{ type: "errorbar", dir: "h", at: i, lo, hi, color: c, width: 3 }];
          if (i === CANDIDATE) {
            marks.push({ type: "segment", from: [-0.96, i], to: [lo, i], color: "blue", dash: "dot", width: 2 });
            marks.push({ type: "points", points: [{ x: -0.96, y: i, title: "candidate: other end of the range, own exponent, −0.96%" }], color: "blue", shape: "diamond", r: 5 });
          }
          if (tick !== null) marks.push({ type: "segment", from: [tick, i - 0.32], to: [tick, i + 0.32], color: "ink", width: 2.25 });
          marks.push({ type: "points", points: [{ x: p, y: i, title: `${name}: ${pct(p)} (${pct(lo)} to ${pct(hi)}), ${rungs}` }], color: c, hollow, r: 5.5 });
          marks.push({ type: "text", x: "right", y: i, dx: 10, text: rungs, size: 10.5 });
          return marks;
        }),
      ],
    },
  ],
  legend: [
    { label: "1T tokens, E held (bar: E and cost range)", color: "ink", mark: "line-dot" },
    { label: "at the serving cost's lower bound", color: "ink", mark: "tick" },
    { label: "other end of the range (own exponent)", color: "blue", mark: "diamond" },
    { label: "≤ 2 rungs: borrows its parent's exponent", color: "ink", mark: "hollow" },
  ],
};
