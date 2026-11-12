// Data for the per-change figures. Measured changes and predictions are the timeline
// fit's leaderboard in bux (docs/tutorials/timeline/tables/leaderboard.md); serving
// sizes are the values printed on the original figures.

import type { AblationRow, AblationSpec, Tone } from "@/components/charts/ablation";

type M = (number | null)[];

function row(label: string, measured: M, pred?: [number, number, number], serving?: number, tone?: Tone): AblationRow {
  return { label, measured, serving, tone, pred: pred && { v: pred[0], lo: pred[1], hi: pred[2] } };
}

const n = null;

export const positions: AblationSpec = {
  kind: "ablation",
  label: "Positional encodings against GPT-3's learned positions",
  subtitle: "parent: learned positions (GPT-3)",
  measured: { domain: [-8.8, 15.5], ticks: [-5, 0, 5, 10, 15], clip: 12 },
  predicted: { domain: [-3.5, 3.4], ticks: [-2, 0, 2] },
  rows: [
    row("RoPE (the 2021 reference)", [-6.95, -4.03, -2.33], [0.49, -0.6, 2.12]),
    row("RoPE, base 500k", [-7.71, -4.28, -2.84], [0.55, -0.61, 1.91]),
    row("partial RoPE (1/4 of dims)", [-7.06, -3.92], [-2.61, -2.92, -2.25]),
    row("partial RoPE, base 10M", [-6.34, -3.14], [-2.3, -2.66, -1.91]),
    row("iRoPE (NoPE every 4th layer)", [-7.43, -4.25], [-2.77, -3.16, -2.44]),
    row("RoPE, raise base at 16k (no YaRN)", [-6.87, -3.57], [-2.52, -2.87, -2.1]),
    row("RoPE, no YaRN at 16k", [-4.96, -2.27], [-1.71, -2.03, -1.33]),
    row("NoPE everywhere", [100.09, 84.72], [42.6, 40.81, 44.49]),
  ],
};

export const norms: AblationSpec = {
  kind: "ablation",
  label: "Normalization changes against the 2021 reference",
  subtitle: "parent: the 2021 reference",
  measured: { domain: [-1.3, 10.4], ticks: [0, 2, 4, 6, 8, 10], clip: 8 },
  predicted: { domain: [-2.6, 3.4], ticks: [-2, -1, 0, 1, 2, 3] },
  rows: [
    row("RMSNorm", [0.04, 0.08, -0.15], [-0.09, -1.33, 0.95]),
    row("no biases", [0.19, 0.15, -0.21], [-0.28, -2.01, 0.48]),
    row("QK-norm", [-1.14, -0.9, -0.88], [-0.75, -2.3, 0.18]),
    row("QK-norm, gains frozen", [0.27, 0.55], [0.05, -0.55, 0.15]),
    row("attention logit soft cap", [-0.21, -0.26], [-0.31, -0.96, -0.21], undefined, "neutral"),
    row("output logit soft cap", [-0.13, 0.13], [-0.19, -0.79, -0.14], undefined, "neutral"),
    row("sandwich norms", [0.34, 0.37], [0.05, -0.49, 0.16]),
    row("post-norm + QK-norm (OLMo 2)", [-0.86, -0.45], [-0.58, -1.28, -0.47], undefined, "neutral"),
    row("post-norm alone", [19.07, 26.81], [10.23, 8.31, 11.82]),
    row("DyT, embedding scaled", [3.06], [0.96, 0.15, 1.42]),
    row("DyT", [74.47, 9.54], [37.9, 31.92, 43.94]),
  ],
};

export const mlp: AblationSpec = {
  kind: "ablation",
  label: "MLP variants against the 2021 reference's GELU MLP",
  subtitle: "parent: the 2021 reference (GELU MLP)",
  measured: { domain: [-1.2, 0.6], ticks: [-1, -0.5, 0, 0.5] },
  serving: { domain: [0, 5.2], ticks: [0, 1, 2, 3, 4, 5], parent: 3.7 },
  predicted: { domain: [-3.2, 0.55], ticks: [-3, -2, -1, 0] },
  rows: [
    row("SwiGLU", [-0.07, -0.66, -0.92], [-1.42, -2.75, -0.4], 4.0),
    row("GeGLU", [-0.2, -0.64], [-0.53, -1.05, -0.42], 4.0, "neutral"),
    row("squared ReLU", [-0.26, -0.88, -1.07], [-1.45, -2.78, -0.04], 3.8),
  ],
};

export const attention: AblationSpec = {
  kind: "ablation",
  label: "Softmax attention variants against multi-head attention",
  subtitle: "parent: the 2021 reference (MHA)",
  measured: { domain: [-4.1, 3.2], ticks: [-4, -2, 0, 2] },
  serving: { domain: [0, 43], ticks: [0, 10, 20, 30, 40], parent: 3.7 },
  predicted: { domain: [-5.8, 0.6], ticks: [-5, -4, -3, -2, -1, 0] },
  rows: [
    row("gated attention + QK-norm", [-3.57, -2.6], [-1.97, -2.79, -1.68], 3.9),
    row("gated attention", [-2.14, -1.38, -1.54], [-0.75, -2.11, 0.16], 3.9),
    row("key-value conv (4 taps)", [-1.01, -0.67, -0.74], [-0.32, -1.89, 0.32], 3.5),
    row("attention sinks", [-0.31, -0.43], [-0.39, -0.98, -0.23], 3.7, "neutral"),
    row("heads of 128", [-0.1, 0.16], [-0.68, -1.23, -0.64], 4.5, "neutral"),
    row("MLA*", [0.55, 0.87, 0.21], [-4.09, -5.11, -3.31], 19.6),
    row("GQA (4 query heads per KV)", [1.12, 0.99, 1.11], [-3.17, -3.81, -2.27], 13.8),
    row("MQA", [1.61, 2.52, 2.48], [-2.54, -3.36, -1.66], 33.4),
  ],
};

export const hybrids: AblationSpec = {
  kind: "ablation",
  label: "Linear-attention and sliding-window hybrids against all-global attention",
  subtitle: "parent: the 2021 reference (all global)",
  measured: { domain: [-5.4, 3.1], ticks: [-4, -2, 0, 2] },
  serving: { domain: [0, 35], ticks: [0, 10, 20, 30], parent: 3.7 },
  predicted: { domain: [-6.6, 0.7], ticks: [-6, -4, -2, 0] },
  rows: [
    row("KDA, 3 of 4 layers", [-3.73, -3.4, -3.39], [-4.68, -5.84, -4.28], 13.3),
    row("KDA, 1 global in 8 (6 at d768)", [-3.21, -3.06], [-4.85, -5.39, -4.57], 24.5),
    row("KDA, every other layer", [-2.9, -2.63], [-3.36, -3.89, -3.11], 9.6),
    row("Gated DeltaNet, 3 of 4", [-2.62, -2.08, -2.47], [-4.16, -5.36, -3.31], 15.2),
    row("Gated DeltaNet-2, 3 of 4", [-4.71, -3.15], [-2.93, -3.68, -2.64], 5.8),
    row("RWKV-7, 3 of 4", [-2.9, -1.62, -2.07], [-2.57, -3.62, -1.46], 8.0),
    row("Mamba-2, 3 of 4", [-1.48, -0.94, -1.46], [-3.64, -4.71, -2.67], 14.4),
    row("SWA 512, 3 of 4", [1.5, 1.68, 0.88], [-2.78, -3.72, -1.97], 13.6),
    row("SWA 128, 3 of 4", [-0.08, 0.84], [-3.63, -4.08, -3.4], 17.9, "neutral"),
    row("SWA 2048, 3 of 4", [1.75, 2.32], [-2.58, -3.07, -2.42], 14.9),
    row("SWA 512, every other layer", [-0.1, 0.23], [-2.4, -2.88, -2.28], 9.5, "neutral"),
    row("SWA 512, 1 global in 8 (6 at d768)", [1.44, 0.78], [-3.87, -4.33, -3.64], 26.8),
  ],
};

export const moe: AblationSpec = {
  kind: "ablation",
  label: "Mixture-of-experts variants against a dense MLP",
  subtitle: "parent: the 2021 reference (dense)",
  measured: { domain: [-7, 0.6], ticks: [-6, -4, -2, 0] },
  serving: { domain: [0, 4.8], ticks: [0, 1, 2, 3, 4], parent: 3.7 },
  predicted: { domain: [-7.7, 0.6], ticks: [-6, -4, -2, 0] },
  rows: [
    row("LatentMoE: 256 experts in a d/2 latent", [-4.15, -5.45, -6.25], [-5.65, -6.92, -4.74], 2.9),
    row("DeepSeek-V3: 128 experts, sigmoid", [-4.88, -5.62, -6.23], [-5.48, -6.78, -4.66], 3.0),
    row("DeepSeekMoE: 64 experts + shared", [-4.26, -4.51, -5.1], [-4.18, -5.51, -3.43], 2.7),
    row("Mixtral: 8 experts, top 2", [-2.02, -2.32, -2.8], [-2.22, -3.54, -1.1], 2.9),
  ],
};

export const shortconv: AblationSpec = {
  kind: "ablation",
  label: "Inkling's key-value conv on the 2021 reference",
  subtitle: "parent: the 2021 reference",
  measured: { domain: [-2.6, 0.65], ticks: [-2, -1, 0] },
  serving: { domain: [0, 4.8], ticks: [0, 1, 2, 3, 4], parent: 3.7 },
  predicted: { domain: [-2.6, 0.55], ticks: [-2, -1, 0] },
  rows: [
    row("Inkling's key-value conv (4 taps)", [-1.01, -0.67, -0.74], [-0.32, -1.89, 0.32], 3.5),
    row("key-value conv + QK-norm", [-2.25, -1.58], [-1.23, -1.87, -1.02], 3.5),
    row("QK-norm alone, for comparison", [-1.14, -0.9, -0.88], [-0.75, -2.3, 0.18], 3.7),
  ],
};

export const canon: AblationSpec = {
  kind: "ablation",
  label: "Canon layers on the candidate",
  subtitle: "parent: the candidate (already has KDA's convs and the key-value conv)",
  vs: "the parent",
  measured: { domain: [-0.58, 1.02], ticks: [-0.5, 0, 0.5, 1] },
  serving: { domain: [0, 11.8], ticks: [0, 5, 10], parent: 9.1 },
  predicted: { domain: [-0.58, 0.58], ticks: [-0.4, 0, 0.4] },
  rows: [
    row("Canon-C: a conv before every MLP", [0.07], [0.07, 0.02, 0.2], 8.5, "neutral"),
    row("Canon-A: a conv before every mixer*", [0.78], [0.29, 0.2, 0.45], 7.5),
    row("Canon-A + Canon-C", [0.43], [0.15, 0.09, 0.31], 8.3, "neutral"),
  ],
};

export const lfm2Ref: AblationSpec = {
  kind: "ablation",
  label: "LFM2's short conv as a mixer on the 2021 reference",
  subtitle: "parent: the 2021 reference (all global)",
  measured: { domain: [-4.3, 2.9], ticks: [-4, -2, 0, 2] },
  serving: { domain: [0, 22], ticks: [0, 5, 10, 15, 20], parent: 3.7 },
  predicted: { domain: [-7.2, 0.6], ticks: [-6, -4, -2, 0] },
  rows: [
    row("LFM2 short conv, 3 of 4 layers", [2.13, 2.28], [-2.7, -3.35, -2.53], 17.0),
    row("KDA, 3 of 4 layers", [-3.73, -3.4, -3.39], [-4.68, -5.84, -4.28], 13.3),
    row("Mamba-2, 3 of 4 layers", [-1.48, -0.94, -1.46], [-3.64, -4.71, -2.67], 14.4),
    row("SWA 512, 3 of 4 layers", [1.5, 1.68, 0.88], [-2.78, -3.72, -1.97], 13.6),
  ],
};

export const lfm2Cand: AblationSpec = {
  kind: "ablation",
  label: "LFM2's short conv in place of the candidate's KDA layers",
  subtitle: "parent: the candidate (KDA in 3 of 4 layers)",
  measured: { domain: [-0.6, 15], ticks: [0, 5, 10, 15] },
  serving: { domain: [0, 13.5], ticks: [0, 4, 8, 12], parent: 9.1 },
  predicted: { domain: [-0.55, 2.1], ticks: [0, 1, 2] },
  rows: [
    row("short conv in place of KDA", [11.5, 8.3], [1.44, 1.08, 1.82], 10.4),
    row("the same, RoPE on the global layers", [7.4, 5.8], [0.87, 0.65, 1.17], 10.4),
    row("LFM2-1.2B's layout (GQA in 3 of 8)", [8.5, 6.5], [1.11, 0.84, 1.38], 9.6),
  ],
};

export const residuals: AblationSpec = {
  kind: "ablation",
  label: "Residual stream variants against x + f(x)",
  subtitle: "parent: the 2021 reference (x + f(x))",
  measured: { domain: [-3.3, 0.65], ticks: [-3, -2, -1, 0] },
  serving: { domain: [0, 5.8], ticks: [0, 1, 2, 3, 4, 5], parent: 3.7 },
  predicted: { domain: [-3.1, 1.4], ticks: [-3, -2, -1, 0, 1] },
  rows: [
    row("mHC (4 streams)*", [-2.76], [-1.99, -2.68, -1.82], 4.4),
    row("hyper-connections (4 streams)", [-2.38, -2.18, -1.27], [0.2, -0.98, 1.23], 3.2),
    row("gated residual (gr)", [-2.91, -1.34], [-1.38, -2.08, -1.21], 3.8),
    row("AttnRes", [-1.59, -1.2, -1.18], [-0.65, -2.55, 0.23], 3.5),
    row("value residual", [-2.11, -0.84, -1.01], [0.04, -1.06, 1.13], 3.7),
    row("variance-preserving gate", [-0.47, -0.6], [-0.42, -1.01, -0.27], 3.6, "neutral"),
  ],
};

export const sparse: AblationSpec = {
  kind: "ablation",
  label: "Sparse attention on the candidate's global layers",
  subtitle: "on the candidate's global layers (one layer in four); quality measured at 16k or less",
  vs: "the candidate",
  measured: { domain: [-0.16, 0.46], ticks: [0, 0.2, 0.4] },
  servingByContext: { domain: [0.6, 1.45], ticks: [0.6, 0.8, 1, 1.2, 1.4] },
  predicted: { domain: [-0.16, 0.27], ticks: [-0.1, 0, 0.1, 0.2] },
  rows: [
    { label: "DSA (DeepSeek-V3.2)", measured: [-0.13, 0.15], servingByContext: [0.81, n, n, 0.83], predByContext: [0.14, n, n, 0.11] },
    { label: "QSA (Qwen)", measured: [0.11, -0.02], servingByContext: [0.73, n, n, 1.05], predByContext: [0.25, n, n, 0] },
    { label: "MSA (MiniMax-M3)", measured: [0.11, -0.03], servingByContext: [0.7, n, n, 0.97], predByContext: [0.25, n, n, 0.03] },
    { label: "DSA, IndexShare 1 in 2", measured: [n, 0.03], servingByContext: [0.85, 1.01, 1.33, 0.98], predByContext: [0.11, 0, -0.14, 0.03] },
    { label: "DSA, IndexShare 1 in 4", measured: [0.13, 0.43], servingByContext: [0.86, 1.01, 1.37, 1.04], predByContext: [0.14, 0.03, -0.11, 0.03] },
    { label: "IndexShare 1 in 4 + cross-layer loss", measured: [0.09, 0.11] },
  ],
};

export const other: AblationSpec = {
  kind: "ablation",
  label: "Other changes against the 2021 reference",
  subtitle: "parent: the 2021 reference",
  measured: { domain: [-0.58, 3.05], ticks: [0, 1, 2, 3] },
  serving: { domain: [0, 4.8], ticks: [0, 1, 2, 3, 4], parent: 3.7 },
  predicted: { domain: [-1.1, 2.8], ticks: [-1, 0, 1, 2] },
  rows: [
    row("multi-token prediction", [-0.4, -0.05], [-0.33, -0.92, -0.25], 3.7, "neutral"),
    row("Engram (lookup memory)", [-0.12, -0.06], [0.05, -0.57, 0.19], 3.3),
    row("deeper and thinner", [-0.19, -0.07, -0.33], [1.48, -0.1, 2.46], 2.0),
    row("parallel attention + MLP", [0.96, 1.43], [0.38, -0.23, 0.5], 3.7),
    row("untied head", [2.33, 1.14], [1.05, 0.5, 1.17], 3.7),
  ],
};

export const stackR1: AblationSpec = {
  kind: "ablation",
  label: "Round 1: stacking the winners on the 2026 hybrid",
  subtitle: "parent: the 2026 KDA hybrid",
  measured: { domain: [-3.3, 0.65], ticks: [-3, -2, -1, 0] },
  serving: { domain: [0, 14.5], ticks: [0, 5, 10], parent: 11.3 },
  predicted: { domain: [-1.6, 0.6], ticks: [-1.5, -1, -0.5, 0, 0.5] },
  rows: [
    row("hc + V + K (the candidate)", [-2.61, -2.09, -1.88], [-0.44, -1.11, 0.25], 9.1),
    row("hc + V", [-1.96, -1.69, -1.51], [-0.83, -1.31, -0.14], 9.2),
    row("mHC + V + K", [-2.85, -2.1, -1.78], [-0.71, -1.36, 0], 7.4),
    row("AttnRes + V + K", [-1.99, -1.44, -0.77], [-0.41, -1.05, 0.36], 10.9),
    row("hc + V + K + ReLU² experts", [-2.63], [-0.38, -0.57, -0.21], 9.3),
    row("V + K, plain residual", [-1.09, -0.58], [-0.28, -0.46, -0.14], 11.3),
    row("K: key-value conv alone", [-0.54, -0.56], [-0.22, -0.37, -0.09], 11.4, "neutral"),
    row("V: value residual alone", [-0.48, 0.07], [-0.19, -0.33, -0.06], 11.4, "neutral"),
    row("partial RoPE on the global layers", [0.42, 0.33], [-0.05, -0.2, 0.04], 11.4),
  ],
};

export const stackR2: AblationSpec = {
  kind: "ablation",
  label: "Round 2: additions on the candidate",
  subtitle: "parent: the candidate (hybrid + hc + V + K)",
  measured: { domain: [-2.5, 0.9], ticks: [-2, -1, 0] },
  predicted: { domain: [-0.57, 0.57], ticks: [-0.4, -0.2, 0, 0.2, 0.4] },
  rows: [
    row("E: embedding × √d", [-0.73, 0.71], [-0.09, -0.16, 0.05]),
    row("G: GatedNorm", [-0.71, -0.56], [-0.06, -0.12, 0.07]),
    row("O: norm on attention outputs", [-0.3], [-0.03, -0.08, 0.08]),
    row("L: learned value-residual mix", [-0.13], [0, -0.05, 0.11]),
    row("E + O + L", [-0.73, 0.66], [-0.09, -0.16, 0.03]),
    row("E + G + O + L", [-1.17, -0.19], [-0.11, -0.18, 0]),
    row("Muon (an optimizer, for scale)", [-2.18, -1.78], [-0.35, -0.47, -0.16]),
  ],
};

export const stackR3: AblationSpec = {
  kind: "ablation",
  label: "Round 3: copy pointer and the 2026 layers on the candidate",
  subtitle: "parent: the candidate (hybrid + hc + V + K)",
  measured: { domain: [-5.6, 1.7], ticks: [-4, -2, 0] },
  serving: { domain: [0, 12.7], ticks: [0, 4, 8, 12], parent: 9.1 },
  predicted: { domain: [-1.08, 2.4], ticks: [-1, 0, 1, 2] },
  rows: [
    row("stack6: stack5 + VE + XSA + diff", [-4.78, -3.14], [-0.62, -0.81, -0.43], 8.3),
    row("stack5: copy pointer + GatedNorm", [-4.84, -2.86, -1.78], [-0.51, -0.92, -0.21], 7.9),
    row("copy pointer (CPLM)", [-4.14, -2.53, -1.45], [-0.37, -0.74, 0.06], 8.5),
    row("copy pointer, 4k window", [-4.02, -2.26], [-0.61, -0.8, -0.38], 8.7),
    row("stack4: GatedNorm + VE + XSA + diff", [n, -0.91], [-0.02, -0.11, 0.11], 8.5),
    row("document-local copy", [-0.51, -0.17], [-0.07, -0.17, 0.05], 9.3),
    row("value embeddings (VE)", [-0.35, -0.05], [0.11, 0.06, 0.24], 9.7, "neutral"),
    row("learned XSA", [-0.2, -0.14], [-0.01, -0.07, 0.12], 9.0),
    row("differential attention", [-0.25, -0.19], [0.01, -0.04, 0.11], 8.7),
    row("null experts", [0.17], [0.15, 0.08, 0.28], 9.2, "neutral"),
    row("paired heads", [0.18], [0.13, 0.06, 0.25], 8.1, "neutral"),
    row("MSAR", [0.53], [1.55, 1.08, 2.08], 2.0, "neutral"),
    row("K = V", [1.28], [0.22, 0.14, 0.38], 9.1),
  ],
};

export const denseLayer: AblationSpec = {
  kind: "ablation",
  label: "Where the candidate's one dense FFN goes",
  subtitle: "parent: the candidate (its first layer's FFN is dense)",
  measured: { domain: [-0.57, 0.65], ticks: [-0.4, 0, 0.4] },
  serving: { domain: [0, 11.8], ticks: [0, 5, 10], parent: 9.1 },
  predicted: { domain: [-1.05, 0.6], ticks: [-1, -0.5, 0, 0.5] },
  rows: [
    row("the dense FFN moved to the last layer", [-0.42, -0.34, -0.33], [-0.54, -0.9, -0.24], 9.1),
    row("no dense FFN (every layer routed)", [-0.04, 0.07], [0.03, -0.06, 0.17], 9.0),
  ],
};
