import { charts } from "@/charts";
import { AblationChart } from "./ablation";
import { XYChart } from "./xy";

/** A native chart from the registry in src/charts, drawn on the server as SVG. */
export function Chart({ id }: { id: string }) {
  const spec = charts[id];
  if (!spec) throw new Error(`Unknown chart "${id}"`);
  return spec.kind === "ablation" ? <AblationChart spec={spec} /> : <XYChart spec={spec} />;
}
