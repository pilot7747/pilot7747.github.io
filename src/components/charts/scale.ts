// Scales, ticks and number formatting shared by every chart.

export type ScaleKind = "linear" | "log";

export type Scale = {
  (v: number): number;
  domain: [number, number];
  range: [number, number];
  ticks: number[];
};

export function scale(kind: ScaleKind, domain: [number, number], range: [number, number], ticks?: number[]): Scale {
  const t = kind === "log" ? Math.log : (v: number) => v;
  const [d0, d1] = [t(domain[0]), t(domain[1])];
  const f = ((v: number) => range[0] + ((t(v) - d0) / (d1 - d0)) * (range[1] - range[0])) as Scale;
  f.domain = domain;
  f.range = range;
  f.ticks = ticks ?? (kind === "log" ? logTicks(domain) : niceTicks(domain));
  return f;
}

/** Round steps of 1, 2, 2.5 or 5 times a power of ten, about `count` of them. */
export function niceTicks([lo, hi]: [number, number], count = 5): number[] {
  const raw = (hi - lo) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(round(v));
  return out;
}

function logTicks([lo, hi]: [number, number]): number[] {
  const out: number[] = [];
  for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) {
    for (const m of [1, 2, 5]) {
      const v = m * 10 ** e;
      if (v >= lo && v <= hi) out.push(round(v));
    }
  }
  return out;
}

const round = (v: number) => Number(v.toPrecision(12));

/** Decimals needed to tell the ticks apart: 0.25 steps need two. */
export function decimals(ticks: number[]): number {
  return Math.max(0, ...ticks.map((t) => (String(round(Math.abs(t))).split(".")[1] ?? "").length));
}

/** A typographic minus, so negative numbers line up with positive ones. */
export function fmt(v: number, digits = 0, signed = false): string {
  const s = Math.abs(v).toFixed(digits);
  if (Number(s) === 0) return s;
  return (v < 0 ? "−" : signed ? "+" : "") + s;
}

/** Rough advance width of `text` in the chart's sans at `size` px, for layout only. */
export function textWidth(text: string, size: number): number {
  let w = 0;
  for (const ch of text) {
    if ("il.,:;|'!()[]".includes(ch)) w += 0.28;
    else if ("ftjr ".includes(ch)) w += 0.36;
    else if ("mwMW".includes(ch)) w += 0.85;
    else if (ch >= "A" && ch <= "Z") w += 0.66;
    else if (ch >= "0" && ch <= "9") w += 0.58;
    else w += 0.54;
  }
  return w * size * 1.06;
}

/** Greedy word wrap to `max` px; a line break in the text always breaks. */
export function wrap(text: string, max: number, size: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (line && textWidth(next, size) > max) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    lines.push(line);
  }
  return lines;
}
