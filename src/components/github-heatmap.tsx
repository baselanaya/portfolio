"use client";

import { useEffect, useState } from "react";

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface HeatmapData {
  totalContributions: number;
  weeks: { days: DayData[] }[];
}

const LEVEL_COLORS: Record<number, string> = {
  0: "var(--color-surface-2)",
  1: "rgba(245,158,11,0.2)",
  2: "rgba(245,158,11,0.45)",
  3: "rgba(245,158,11,0.72)",
  4: "var(--color-amber)",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildHeatmap(contributions: Record<string, number>): HeatmapData {
  const today = new Date();
  // Start from 52 weeks ago, aligned to Sunday
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay()); // back to Sunday

  let totalContributions = 0;
  const weeks: { days: DayData[] }[] = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const week: DayData[] = [];
    for (let d = 0; d < 7; d++) {
      const key = cursor.toISOString().split("T")[0];
      const count = contributions[key] ?? 0;
      totalContributions += count;
      const level =
        count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
      week.push({ date: key, count, level: level as 0 | 1 | 2 | 3 | 4 });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push({ days: week });
  }

  return { totalContributions, weeks };
}

export default function GitHubHeatmap({ username = "baselanaya" }: { username?: string }) {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    // GitHub's contribution calendar via the public API proxy
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((json) => {
        // API returns { contributions: [{ date, count, level }] }
        const map: Record<string, number> = {};
        for (const entry of json.contributions ?? []) {
          map[entry.date] = entry.count;
        }
        setData(buildHeatmap(map));
      })
      .catch(() => setError(true));
  }, [username]);

  if (error) return null;

  // Derive month labels from weeks
  const monthLabels: { label: string; col: number }[] = [];
  if (data) {
    let lastMonth = -1;
    data.weeks.forEach((week, i) => {
      const month = new Date(week.days[0].date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], col: i });
        lastMonth = month;
      }
    });
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-mono"
          style={{ fontSize: "11px", color: "var(--color-muted)", letterSpacing: "0.1em" }}
        >
          GITHUB ACTIVITY
        </span>
        {data && (
          <span
            className="font-mono"
            style={{ fontSize: "11px", color: "var(--color-amber-dim)" }}
          >
            {data.totalContributions.toLocaleString()} contributions / year
          </span>
        )}
      </div>

      {/* Skeleton while loading */}
      {!data ? (
        <div
          className="animate-pulse rounded-sm"
          style={{ height: "112px", backgroundColor: "var(--color-surface-2)" }}
        />
      ) : (
        <div style={{ position: "relative", overflowX: "auto" }}>
          {/* Month labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${data.weeks.length}, 12px)`,
              gap: "2px",
              marginBottom: "4px",
              marginLeft: "0px",
            }}
          >
            {data.weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.col === i);
              return (
                <div
                  key={i}
                  style={{
                    fontSize: "9px",
                    color: label ? "var(--color-muted)" : "transparent",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  {label?.label ?? "."}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${data.weeks.length}, 12px)`,
              gridTemplateRows: "repeat(7, 12px)",
              gap: "2px",
              gridAutoFlow: "column",
            }}
          >
            {data.weeks.flatMap((week) =>
              week.days.map((day) => (
                <div
                  key={day.date}
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: LEVEL_COLORS[day.level],
                    borderRadius: "2px",
                    cursor: day.count > 0 ? "default" : "default",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      text: `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3">
            <span
              className="font-mono"
              style={{ fontSize: "9px", color: "var(--color-muted)" }}
            >
              less
            </span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div
                key={l}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  backgroundColor: LEVEL_COLORS[l],
                }}
              />
            ))}
            <span
              className="font-mono"
              style={{ fontSize: "9px", color: "var(--color-muted)" }}
            >
              more
            </span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="font-mono pointer-events-none fixed z-50 px-2 py-1 border border-border"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
            fontSize: "10px",
            color: "var(--color-text)",
            backgroundColor: "var(--color-surface)",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
