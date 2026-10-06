import React, { useMemo, useState, useEffect } from "react";
import { MetricKey, MetricMeta } from "../../../../../../setting/metric";
import UonzuChart from "../../../../../common/UonzuChart";
import { formatTrendChartData, HistoryEntry } from "./function";

interface StatsData {
  [key: string]: any;
}

interface TrendChartProps {
  history: HistoryEntry[];
  stats?: StatsData;
  color?: string;
  renderSelectOnly?: boolean;
  renderChartOnly?: boolean;
}

const GroupCard: React.FC<{
  title: string;
  dotColor: string;
  metrics: MetricMeta[];
  stats: StatsData;
}> = ({ title, dotColor, metrics, stats }) => (
  <div className="w-full min-w-0">
    <div className="text-[11px] font-black text-slate-400 mb-1 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: dotColor }} />
      <span>{title}</span>
    </div>
    <div
      className="grid border border-gray-400 overflow-hidden rounded shadow-sm"
      style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
    >
      <div className="contents">
        {metrics.map((m) => (
          <div
            key={`label-${m.key}`}
            className="px-1 py-1 text-white border-l border-white/20 first:border-l-0 text-center text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
            style={{ backgroundColor: m.color }}
          >
            {m.icon && <span className="text-sm shrink-0">{m.icon}</span>}
            <span className="truncate">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="contents">
        {metrics.map((m) => {
          const val = stats[m.key];
          return (
            <div
              key={`val-${m.key}`}
              className="px-1 py-2 border-l first:border-l-0 border-t border-gray-200 flex flex-col items-center justify-center bg-white"
            >
              <div className="text-sm font-bold text-slate-800">
                {val !== undefined ? `${val}${m.unit}` : "---"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export const TrendChart: React.FC<TrendChartProps> = ({
  history,
  stats,
  renderSelectOnly = false,
  renderChartOnly = false,
}) => {
  const [isBelowXl, setIsBelowXl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 1279px)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1279px)");
    const handler = (e: MediaQueryListEvent) => setIsBelowXl(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const allMetrics = useMemo(() => Object.values(MetricKey), []);
  const heatMetrics = useMemo(() => allMetrics.filter((m) => m?.detail?.group === "heat"), [allMetrics]);
  const coldMetrics = useMemo(() => allMetrics.filter((m) => m?.detail?.group === "cold"), [allMetrics]);
  const rainMetrics = useMemo(() => allMetrics.filter((m) => m?.detail?.group === "rain"), [allMetrics]);

  const { labels, shortLabels, uonzuMap } = useMemo(
    () => formatTrendChartData(history),
    [history]
  );

  if (history.length === 0) return null;
  if (renderSelectOnly) return null;

  return (
    <div className="flex flex-col gap-6">
      {stats && (
        <div className="flex flex-col gap-3 w-full min-w-0">
          <GroupCard title="暑さ" dotColor="#ef4444" metrics={heatMetrics} stats={stats} />
          <div className="flex flex-col xl:flex-row gap-3 items-stretch w-full min-w-0">
            <div className="xl:flex-1 min-w-0">
              <GroupCard title="寒さ" dotColor="#3b82f6" metrics={coldMetrics} stats={stats} />
            </div>
            <div className="xl:flex-1 min-w-0">
              <GroupCard title="降水" dotColor="#0891b2" metrics={rainMetrics} stats={stats} />
            </div>
          </div>
        </div>
      )}

      <div className="h-[350px] w-full">
        <UonzuChart
          rawData={{ station: {}, climateData: uonzuMap }}
          selectedBar={MetricKey.sm_rain}
          labels={isBelowXl ? shortLabels : labels}
          tooltipLabels={labels}
          height="100%"
        />
      </div>
    </div>
  );
};

export default TrendChart;
