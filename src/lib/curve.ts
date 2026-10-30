import { checkpoints } from "@/lib/site";

// A fake but plausible training curve: power-law decay, noise, and a loss
// spike at every change of domain. Seeded so every build draws the same run.

export const CURVE = { x0: 2018.3, x1: 2027.05, y0: 1.1, y1: 6.9, w: 1000, h: 300 } as const;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function expectedLoss(t: number) {
  let loss = 0.55 + 3.5 * Math.pow(t - CURVE.x0 + 0.3, -0.5);
  for (const cp of checkpoints) {
    if (cp.spike && t >= cp.t) loss += cp.spike * Math.exp(-(t - cp.t) / 0.22);
  }
  return loss;
}

const sx = (t: number) => ((t - CURVE.x0) / (CURVE.x1 - CURVE.x0)) * CURVE.w;
const sy = (loss: number) => CURVE.h - ((loss - CURVE.y0) / (CURVE.y1 - CURVE.y0)) * CURVE.h;

function toPath(points: [number, number][]) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
}

export type CurveData = {
  raw: string;
  smooth: string;
  markers: { x: number; y: number }[]; // percentages of the plot box
  yTicks: { value: number; y: number }[];
  xTicks: { label: string; x: number }[];
};

let cached: CurveData | undefined;

export function buildCurve(): CurveData {
  if (cached) return cached;

  const rand = mulberry32(7747);
  const end = checkpoints[checkpoints.length - 1].t;
  const step = 0.02;
  const ts: number[] = [];
  const raw: number[] = [];
  const smooth: number[] = [];

  // Debiased EMA, the same smoothing W&B applies to a noisy loss.
  const beta = 0.85;
  let ema = 0;
  for (let i = 0, t = CURVE.x0 + 0.04; t <= end + 1e-9; i++, t += step) {
    const noise = (rand() + rand() + rand() - 1.5) * 0.5;
    const value = expectedLoss(t) * (1 + 0.075 * noise);
    ema = beta * ema + (1 - beta) * value;
    ts.push(t);
    raw.push(value);
    smooth.push(ema / (1 - Math.pow(beta, i + 1)));
  }

  const at = (t: number) => {
    const i = Math.min(ts.length - 1, Math.max(0, Math.round((t - ts[0]) / step)));
    return smooth[i];
  };

  cached = {
    raw: toPath(ts.map((t, i) => [sx(t), sy(raw[i])])),
    smooth: toPath(ts.map((t, i) => [sx(t), sy(smooth[i])])),
    markers: checkpoints.map((cp) => ({
      x: (sx(cp.t) / CURVE.w) * 100,
      y: (sy(at(cp.t)) / CURVE.h) * 100,
    })),
    yTicks: [2, 3, 4, 5, 6].map((value) => ({ value, y: (sy(value) / CURVE.h) * 100 })),
    xTicks: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => ({
      label: String(year),
      x: (sx(year) / CURVE.w) * 100,
    })),
  };
  return cached;
}
