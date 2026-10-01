import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  MetricGroup,
  MetricKey,
  MetricValue,
} from "../../../setting/metric";

export const ALL_RECENT_METRICS = (Object.values(MetricKey) as Array<(typeof MetricKey)[MetricValue]>)
  .filter((m) => m.detail.group !== undefined)
  .map((m) => m.key);

export const GROUPS: { key: MetricGroup; label: string; metrics: MetricValue[] }[] = [
  {
    key: "heat",
    label: "暑さ",
    metrics: ALL_RECENT_METRICS.filter((m) => MetricKey[m].detail.group === "heat"),
  },
  {
    key: "cold",
    label: "寒さ",
    metrics: ALL_RECENT_METRICS.filter((m) => MetricKey[m].detail.group === "cold"),
  },
  {
    key: "rain",
    label: "降水",
    metrics: ALL_RECENT_METRICS.filter((m) => MetricKey[m].detail.group === "rain"),
  },
];

interface RecentSelectorProps {
  currentMetric: MetricValue;
}

export const RecentSelector: React.FC<RecentSelectorProps> = ({ currentMetric }) => {
  const router = useRouter();

  const [activeGroup, setActiveGroup] = useState<MetricGroup>(() => {
    const found = GROUPS.find((g) => g.metrics.includes(currentMetric));
    return found ? found.key : "heat";
  });

  const handleSelectMetric = (nextMetric: MetricValue) => {
    if (nextMetric === currentMetric) return;
    router.push(`/ranking/recent/${nextMetric}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const currentGroupMetrics = useMemo(() => {
    const group = GROUPS.find((g) => g.key === activeGroup);
    return group ? group.metrics : [];
  }, [activeGroup]);

  return (
    <div className="space-y-4 pb-5 border-b border-slate-100">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
          分類:
        </span>
        {GROUPS.map((g) => {
          const isSelected = activeGroup === g.key;
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => setActiveGroup(g.key)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
          指標:
        </span>
        {currentGroupMetrics.map((m) => {
          const isSelected = currentMetric === m;
          const mConfig = MetricKey[m];
          return (
            <button
              key={m}
              type="button"
              onClick={() => handleSelectMetric(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSelected
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
    </div>
  );
};

export default RecentSelector;
