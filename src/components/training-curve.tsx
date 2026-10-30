import { buildCurve, CURVE } from "@/lib/curve";
import { checkpoints } from "@/lib/site";

export function TrainingCurve() {
  const curve = buildCurve();
  const last = checkpoints.length - 1;

  return (
    <figure className="curve" aria-labelledby="curve-caption">
      <div className="relative">
        {/* Y axis */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 font-mono text-[0.625rem] text-fg-subtle">
          {curve.yTicks.map((tick) => (
            <span key={tick.value} className="absolute -translate-y-1/2" style={{ top: `${tick.y}%` }}>
              {tick.value.toFixed(1)}
            </span>
          ))}
        </div>

        <div className="curve-plot relative ml-8 h-52 sm:h-64 md:h-72">
          <svg
            viewBox={`0 0 ${CURVE.w} ${CURVE.h}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
            role="img"
            aria-label="An illustrative training loss curve that falls from 2018 to 2026, with small spikes at each new job."
          >
            {curve.yTicks.map((tick) => (
              <line
                key={tick.value}
                x1="0"
                x2={CURVE.w}
                y1={(tick.y / 100) * CURVE.h}
                y2={(tick.y / 100) * CURVE.h}
                stroke="var(--line)"
                strokeDasharray="2 4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path d={curve.raw} fill="none" stroke="var(--fg-subtle)" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path
              d={curve.smooth}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {curve.markers.map((m, i) => (
            <span
              key={checkpoints[i].title}
              aria-hidden
              className="curve-dot"
              data-cp={i}
              data-live={i === last ? "" : undefined}
              style={{ left: `${m.x}%`, top: `${m.y}%`, ["--p" as string]: m.x / 100 }}
            >
              {i + 1}
            </span>
          ))}

          <div aria-hidden className="absolute right-0 top-0 flex items-center gap-3 font-mono text-[0.625rem] text-fg-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-px w-4 bg-fg-subtle/60" /> raw
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded-full bg-accent" /> smoothed
            </span>
          </div>
        </div>

        {/* X axis */}
        <div aria-hidden className="relative ml-8 mt-2 h-4 border-t border-line font-mono text-[0.625rem] text-fg-subtle">
          {curve.xTicks.map((tick, i) => (
            <span
              key={tick.label}
              className={`absolute top-1.5 -translate-x-1/2 ${i % 2 ? "max-sm:hidden" : ""}`}
              style={{ left: `${tick.x}%` }}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      <ol className="curve-legend mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {checkpoints.map((cp, i) => (
          <li key={cp.title} data-cp={i} className="flex gap-3">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[0.625rem] text-fg-muted">
              {i + 1}
            </span>
            <div className="min-w-0 leading-snug">
              <p className="text-[0.9375rem]">
                <span className="font-medium text-fg">{cp.title}</span>
                <span className="ml-2 font-mono text-[0.6875rem] text-fg-subtle">{cp.date}</span>
              </p>
              <p className="text-sm text-fg-muted">{cp.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <figcaption id="curve-caption" className="mt-6 text-sm text-fg-muted">
        <span className="font-mono text-xs uppercase tracking-wider text-fg">Fig. 1</span>
        <span className="mx-2 text-fg-subtle">·</span>
        My career as a training run. The loss is made up; the checkpoints are real.
      </figcaption>
    </figure>
  );
}
