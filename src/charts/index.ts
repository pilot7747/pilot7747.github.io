// Every native chart, by the id an MDX post passes to <Chart id="..." />.

import type { AblationSpec } from "@/components/charts/ablation";
import type { XYSpec } from "@/components/charts/xy";
import * as ablations from "./every-llm-architecture-change/ablations";
import * as figures from "./every-llm-architecture-change/figures";

export type ChartSpec = AblationSpec | XYSpec;

export const charts: Record<string, ChartSpec> = { ...ablations, ...figures };
