import React from "react";
import { useRouter } from "next/router";
import { MetricKey, MetricValue } from "../../../../setting/metric";

export const DAILY_METRICS: MetricValue[] = ["av_hitemp", "av_lwtemp", "sm_rain"];

interface DailySelectorProps {
  currentMetric: MetricValue;
}

export const DailySelector: React.FC<DailySelectorProps> = ({ currentMetric }) => {
  const router = useRouter();

  const handleSelectMetric = (nextMetric: MetricValue) => {
    if (nextMetric === currentMetric) return;
    router.push(`/ranking/daily/${nextMetric}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center pb-5 border-b border-slate-100">
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
        指標:
      </span>
      {DAILY_METRICS.map((m) => {
        const isSelected = currentMetric === m;
        const mConfig = MetricKey[m];
        return (
          <button
            key={m}
            type="button"
            onClick={() => handleSelectMetric(m)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected
                ? "text-white shadow-sm"
                : "text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/70"
              }`}
            style={isSelected ? { backgroundColor: mConfig.color } : {}}
          >
            <span>{mConfig.icon}</span>
            <span>{mConfig.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DailySelector;
