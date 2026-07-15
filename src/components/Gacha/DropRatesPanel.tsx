// src/components/Gacha/DropRatesPanel.tsx
import React, { useMemo } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { RawOverviewData } from "../../types/raw";
import { RARITY_META, Rarity, StationRaw, determineRarity } from "./gachaUtils";

interface DropRatesProps {
  stations: StationRaw[];
  stationsOverview?: Record<string, RawOverviewData>;
}

export const DropRatesPanel: React.FC<DropRatesProps> = ({ stations, stationsOverview }) => {
  // Dynamically calculate counts and rates
  const stats = useMemo(() => {
    const counts = { UR: 0, SSR: 0, SR: 0, R: 0, UC: 0, C: 0 };
    if (!stations.length) return { counts, rates: { UR: "0.0", SSR: "0.0", SR: "0.0", R: "0.0", UC: "0.0", C: "0.0" }, total: 0 };

    stations.forEach((s) => {
      const r = determineRarity(s, stationsOverview?.[s.id]);
      counts[r]++;
    });

    const total = stations.length;
    const rates = {
      UR: ((counts.UR / total) * 100).toFixed(1),
      SSR: ((counts.SSR / total) * 100).toFixed(1),
      SR: ((counts.SR / total) * 100).toFixed(1),
      R: ((counts.R / total) * 100).toFixed(1),
      UC: ((counts.UC / total) * 100).toFixed(1),
      C: ((counts.C / total) * 100).toFixed(1),
    };

    return { counts, rates, total };
  }, [stations, stationsOverview]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md text-slate-700 flex-1 flex flex-col justify-center">
      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        <FaInfoCircle className="text-purple-600" />
        <span>出現割合 ＆ レア判定基準</span>
      </h3>
      
      <div className="flex flex-col gap-3 text-xs leading-relaxed">
        {(["UR", "SSR", "SR", "R", "UC", "C"] as Rarity[]).map((r) => {
          const meta = RARITY_META[r];
          return (
            <div key={r} className="flex items-start gap-3">
              <span className={`text-[9px] w-16 text-center font-black py-0.5 rounded leading-normal ${meta.bgClass}`}>
                {r} {stats.rates[r]}%
              </span>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <p className="font-bold text-slate-800 text-xs">{meta.title}</p>
                  <span className="text-[10px] text-slate-400 font-bold">({stats.counts[r]}地点)</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">{meta.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
