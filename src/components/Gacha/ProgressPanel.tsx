// src/components/Gacha/ProgressPanel.tsx
import React, { useMemo } from "react";
import { FaTrophy } from "react-icons/fa";
import { StationRaw, Rarity, RARITY_META, CollectionItem, determineRarity } from "./gachaUtils";
import { RawOverviewData } from "../../types/raw";

interface ProgressProps {
  collection: Record<string, CollectionItem>;
  stations: StationRaw[];
  loading: boolean;
  stationsOverview?: Record<string, RawOverviewData>;
}

export const ProgressPanel: React.FC<ProgressProps> = ({
  collection,
  stations,
  loading,
  stationsOverview,
}) => {
  // Calculate statistics
  const statsSummary = useMemo(() => {
    const totalCount = stations.length;
    const collectedIds = Object.keys(collection);
    const collectedCount = collectedIds.length;
    const completionRate =
      totalCount > 0 ? ((collectedCount / totalCount) * 100).toFixed(1) : "0.0";

    // Rarity breakdowns
    const rarityCounts = { UR: 0, SSR: 0, SR: 0, R: 0, UC: 0, C: 0 };
    const rarityCollected = { UR: 0, SSR: 0, SR: 0, R: 0, UC: 0, C: 0 };

    stations.forEach((s) => {
      const r = determineRarity(s, stationsOverview?.[s.id]);
      
      rarityCounts[r]++;
      if (collection[s.id]) {
        rarityCollected[r]++;
      }
    });

    return {
      totalCount,
      collectedCount,
      completionRate,
      rarityCounts,
      rarityCollected,
    };
  }, [stations, collection]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md w-full text-slate-700">
      <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <FaTrophy className="text-yellow-500" />
        <span>コレクション進捗状況</span>
      </h3>

      {loading ? (
        <div className="h-24 flex items-center justify-center text-slate-400 text-xs">
          読み込み中...
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-bold text-slate-500">収集率</span>
              <span className="text-lg font-black text-slate-800">
                {statsSummary.collectedCount} / {statsSummary.totalCount} 地点
                <span className="text-purple-600 text-sm ml-2">({statsSummary.completionRate}%)</span>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${statsSummary.completionRate}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
            {(["UR", "SSR", "SR", "R", "UC", "C"] as Rarity[]).map((r) => {
              const coll = statsSummary.rarityCollected[r];
              const total = statsSummary.rarityCounts[r];
              const percent = total > 0 ? Math.round((coll / total) * 100) : 0;
              const meta = RARITY_META[r];

              return (
                <div key={r} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col items-center shadow-sm">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black mb-1 ${meta.bgClass}`}>
                    {r}
                  </span>
                  <span className="text-[11px] font-black text-slate-700 mt-1">
                    {coll}/{total}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
