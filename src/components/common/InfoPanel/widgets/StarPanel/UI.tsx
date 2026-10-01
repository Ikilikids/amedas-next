import React from "react";
import { FaStar } from "react-icons/fa";
import { MetricMeta } from "../../../../../setting/metric";
import { MetricDistribution, METRIC_DISTRIBUTIONS } from "../../../../../setting/metricDistributions";
import { computePositionPct, evaluateStar } from "./function";

const metricDistributions = METRIC_DISTRIBUTIONS;

export interface ClimateStarPanelProps {
  metrics: {
    meta: MetricMeta;
    value: number | null | undefined;
  }[];
  accentColor?: string;
}

const DistributionHistogram: React.FC<{
  dist?: MetricDistribution;
  value: number | null | undefined;
  color: string;
}> = ({ dist, value, color }) => {
  if (!dist || dist.bins.length === 0) {
    return <div className="h-6 bg-slate-100 rounded" />;
  }

  const positionPct = computePositionPct(value, dist);

  return (
    <div className="relative w-full flex flex-col justify-end pt-1 pb-0.5">
      <div className="flex items-end gap-[1px] h-5 w-full px-0.5">
        {dist.bins.map((peak, idx) => {
          const heightPct = Math.max(8, peak);
          return (
            <div
              key={idx}
              className="flex-1 rounded-t-[1px] transition-all"
              style={{
                height: `${heightPct}%`,
                backgroundColor: color,
                opacity: 0.28,
              }}
            />
          );
        })}
      </div>

      <div className="w-full h-1 bg-slate-200/90 rounded-full relative">
        {value != null && !isNaN(value) && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none"
            style={{ left: `${positionPct}%` }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ring-2 ring-slate-800"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-0.5 px-0.5">
        <span>{dist.min}</span>
        <span>{dist.max}</span>
      </div>
    </div>
  );
};

export const ClimateStarPanel: React.FC<ClimateStarPanelProps> = ({
  metrics,
  accentColor = "#3b82f6",
}) => {
  return (
    <div className="h-full flex flex-col p-3 bg-white rounded-2xl">
      <div className="grid grid-cols-2 gap-2 flex-1 items-stretch">
        {metrics.map(({ meta, value }) => {
          const { starCount, maxStars, label: starLabel } = evaluateStar(
            value,
            meta.star
          );
          const dist = metricDistributions[meta.key];

          return (
            <div
              key={meta.key}
              className="px-2.5 py-2 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between shadow-2xs hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span
                    className="text-xs shrink-0 p-0.5 rounded bg-white border border-slate-200/60 shadow-2xs"
                    style={{ color: meta.color }}
                  >
                    {meta.icon}
                  </span>
                  <span className="text-[11px] font-black text-slate-800 truncate">
                    {meta.label}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs"
                    style={{ color: meta.color }}
                  >
                    {starLabel}
                  </span>
                </div>
              </div>

              <div className="my-1 flex items-center justify-between bg-white px-1.5 py-0.5 rounded border border-slate-100/80">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: maxStars }).map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-[10px] transition-colors"
                      style={{
                        color: i < starCount ? meta.color : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black font-mono text-slate-600 ml-1 shrink-0">
                  {starCount}/{maxStars}
                </span>
              </div>

              <div>
                <DistributionHistogram dist={dist} value={value} color={meta.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClimateStarPanel;
