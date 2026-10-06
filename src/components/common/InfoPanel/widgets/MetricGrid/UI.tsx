import React from "react";
import { FaStar } from "react-icons/fa";
import { MetricKey, MetricMeta } from "../../../../../setting/metric";
import { MetricDistribution } from "../../../../../setting/metricDistributions";
import { RawData } from "../../../../../types/raw";
import { calculateStar } from "../../../../../utils/starUtils";
import { showValue } from "../../function";

const INFO_GRID_METRICS: MetricMeta[] = [
  MetricKey.av_avtemp,
  MetricKey.sm_sun,
  MetricKey.sm_rain,
  MetricKey.sm_snowing,
  MetricKey.av_wind,
  MetricKey.hitemp_35,
];

const DistributionHistogram: React.FC<{
  metric: MetricMeta;
  value: number | null | undefined;
}> = ({ metric, value }) => {
  const dist = metric.distribution;
  const color = metric.color;

  if (!dist || dist.bins.length === 0) {
    return <div className="h-4 bg-slate-100 rounded" />;
  }

  let positionPct = 50;
  if (value != null && !isNaN(value)) {
    const range = dist.max - dist.min;
    if (range > 0) {
      positionPct = Math.max(0, Math.min(100, ((value - dist.min) / range) * 100));
    }
  }

  return (
    <div className="relative w-full flex flex-col justify-end pt-0.5">
      <div className="flex items-end gap-[1px] h-3.5 w-full px-0.5">
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
              className="w-2 h-2 rounded-full border border-white shadow-2xs ring-1 ring-slate-700"
              style={{ backgroundColor: color }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 mt-0.5 px-0.5 leading-none">
        <span>{dist.min}</span>
        <span>{dist.max}</span>
      </div>
    </div>
  );
};

export const MetricGrid: React.FC<{ rawData: RawData }> = ({ rawData }) => {
  const climateData = rawData.climateData;

  return (
    <div className="flex-1 grid grid-cols-2 gap-2.5">
      {INFO_GRID_METRICS.map((m) => {
        const entries = climateData?.[m.key];
        const annual = entries && entries.length > 12 ? entries[12] : entries?.[0];
        const val = annual?.value;
        const hasVal = val != null && !isNaN(val);

        const starResult = hasVal && m.star ? calculateStar(val, m.star) : null;
        const myStar = starResult?.star ?? null;
        const maxStars = m.star?.levels.length ? m.star.levels.length + 1 : 10;
        const starLabel = starResult ? starResult.label : "データなし";
        const rank = annual?.top;

        return (
          <div
            key={m.key}
            className="bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100/90 shadow-2xs flex flex-col justify-between hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1 min-w-0">
                {(m.icon || m.high?.icon) && (
                  <span
                    className="text-xs shrink-0 p-0.5 rounded bg-white border border-slate-200/60 shadow-2xs"
                    style={{ color: m.color }}
                  >
                    {m.icon || m.high?.icon}
                  </span>
                )}
                <span className="text-[11px] font-black text-slate-700 truncate">
                  {m.label}
                </span>
              </div>
              <span
                className="text-[9.5px] font-black px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs shrink-0"
                style={{ color: hasVal ? m.color : "#94a3b8" }}
              >
                {starLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 my-0.5">
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-lg font-black text-slate-800 leading-none">
                  {hasVal ? showValue(val) : "--"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 shrink-0">
                  {m.unit}
                </span>
              </div>

              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <div className="flex items-center gap-0.5 bg-white/90 px-1 py-0.5 rounded border border-slate-100 shadow-2xs whitespace-nowrap">
                  <FaStar className="text-[9.5px]" style={{ color: hasVal ? m.color : "#cbd5e1" }} />
                  <span className="text-[9.5px] font-black font-mono text-slate-600">
                    {hasVal ? myStar : "-"}/{maxStars}
                  </span>
                </div>
                {rank != null && (
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-tight whitespace-nowrap leading-none pr-0.5">
                    RANK {rank}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-1">
              <DistributionHistogram metric={m} value={val} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricGrid;
