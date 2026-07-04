import { getContributions } from "@/lib/github";

const CELL = 11;
const GAP = 3;

/**
 * GitHub contribution heatmap rendered as a pure server-side SVG —
 * zero client JS, colored via the site's accent scale.
 */
export async function ContributionGraph() {
  const data = await getContributions();
  if (!data || data.days.length === 0) return null;

  // group into weeks (columns), starting on the first day
  const weeks: (typeof data.days)[] = [];
  let week: typeof data.days = [];
  for (const day of data.days) {
    week.push(day);
    if (new Date(day.date + "T00:00:00Z").getUTCDay() === 6) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);

  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);
  const fills = [
    "var(--edge)",
    "color-mix(in srgb, var(--accent) 30%, transparent)",
    "color-mix(in srgb, var(--accent) 55%, transparent)",
    "color-mix(in srgb, var(--accent) 80%, transparent)",
    "var(--accent)",
  ];

  return (
    <div>
      <div className="overflow-x-auto pb-2" tabIndex={0} role="img" aria-label={`GitHub contribution calendar: ${data.total} contributions in the last year`}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
          aria-hidden="true"
        >
          {weeks.map((w, x) =>
            w.map((day) => {
              const dow = new Date(day.date + "T00:00:00Z").getUTCDay();
              return (
                <rect
                  key={day.date}
                  x={x * (CELL + GAP)}
                  y={dow * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  fill={fills[day.level]}
                >
                  <title>{`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>
      <p className="mt-2 font-mono text-xs text-subtle">
        {data.total.toLocaleString()} contributions in the last year
      </p>
    </div>
  );
}
