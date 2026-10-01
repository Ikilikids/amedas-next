import React from "react";
import { RankKey, RankMeta } from "../../../setting/rank";
import { RegionKey, RegionMeta } from "../../../setting/region";
import { PrefKey, PrefMeta } from "../../../setting/pref";
import { colorWithAlpha } from "../Station/widgets/Ratio/function";

interface RankingScopeFilterProps {
  rankMeta: RankMeta;
  setRankMeta: (rk: RankMeta) => void;
  selectedRegion: RegionMeta;
  setSelectedRegion: (r: RegionMeta) => void;
  selectedPref: PrefMeta;
  setSelectedPref: (p: PrefMeta) => void;
  accentColor: string;
}

export const RankingScopeFilter: React.FC<RankingScopeFilterProps> = ({
  rankMeta,
  setRankMeta,
  selectedRegion,
  setSelectedRegion,
  selectedPref,
  setSelectedPref,
  accentColor,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* 範囲切り替えボタン（全国・地方・都道府県・島嶼除くなど） */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
          範囲:
        </span>
        {Object.values(RankKey).map((rk) => (
          <button
            key={rk.key}
            onClick={() => setRankMeta(rk)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${rankMeta.key === rk.key
              ? "text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            style={rankMeta.key === rk.key ? { backgroundColor: accentColor } : {}}
          >
            {rk.rankingLabel}
          </button>
        ))}
      </div>

      {/* 地方選択ボタン群 */}
      {rankMeta.key === "region" && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {Object.values(RegionKey).map((r) => (
            <button
              key={r.label}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedRegion.label === r.label
                ? "text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              style={
                selectedRegion.label === r.label
                  ? { backgroundColor: r.colorStrong }
                  : { backgroundColor: colorWithAlpha(r.colorBase, 0.15) }
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* 都道府県（道央・道南・道東・道北含む）プルダウン */}
      {rankMeta.key === "pre" && (
        <div className="pt-2">
          <select
            value={selectedPref.label}
            onChange={(e) => {
              const found = Object.values(PrefKey).find(
                (p) => p.label === e.target.value
              );
              if (found) setSelectedPref(found);
            }}
            className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2"
            style={{ outlineColor: accentColor } as any}
          >
            {Object.values(PrefKey).map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default RankingScopeFilter;
