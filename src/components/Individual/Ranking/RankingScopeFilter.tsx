import React, { useMemo } from "react";
import { RankKey, RankMeta } from "../../../setting/rank";
import { RegionKey, RegionMeta } from "../../../setting/region";
import { PrefKey, PrefMeta } from "../../../setting/pref";
import { colorWithAlpha } from "../Station/widgets/Ratio/function";
import CustomSelect from "../../common/CustomSelect";

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
  const rankOptions = useMemo(
    () =>
      Object.values(RankKey).map((rk) => ({
        value: rk.key,
        label: rk.rankingLabel,
      })),
    []
  );

  const regionOptions = useMemo(
    () =>
      Object.values(RegionKey).map((r) => ({
        value: r.key,
        label: r.label,
      })),
    []
  );

  const prefOptions = useMemo(
    () =>
      Object.values(PrefKey).map((p) => ({
        value: p.key,
        label: p.label,
      })),
    []
  );

  return (
    <div className="flex flex-col gap-3">
      {/* 範囲ドロップダウンセレクト方式（全画面共通） */}
      <div className="flex items-center gap-3 w-full">
        <span className="shrink-0 whitespace-nowrap text-[11px] font-black text-slate-400 uppercase tracking-wider">
          範囲:
        </span>
        <div className="flex-1 xl:max-w-md min-w-0">
          <CustomSelect
            value={rankMeta.key}
            onChange={(val) => {
              const found = Object.values(RankKey).find((rk) => rk.key === val);
              if (found) setRankMeta(found);
            }}
            options={rankOptions}
            activeColor={accentColor}
          />
        </div>
      </div>

      {/* 地方選択（全画面サイズ共通でCustomSelect） */}
      {rankMeta.key === "region" && (
        <div className="flex items-center gap-3 w-full">
          <span className="shrink-0 whitespace-nowrap text-[11px] font-black text-slate-400 uppercase tracking-wider">
            地方:
          </span>
          <div className="flex-1 xl:max-w-md min-w-0">
            <CustomSelect
              value={selectedRegion.key}
              onChange={(val) => {
                const found = Object.values(RegionKey).find((r) => r.key === val);
                if (found) setSelectedRegion(found);
              }}
              options={regionOptions}
              activeColor={selectedRegion.colorStrong}
            />
          </div>
        </div>
      )}

      {/* 都道府県選択（全画面サイズ共通でCustomSelect） */}
      {rankMeta.key === "pre" && (
        <div className="flex items-center gap-3 w-full">
          <span className="shrink-0 whitespace-nowrap text-[11px] font-black text-slate-400 uppercase tracking-wider">
            都道府県:
          </span>
          <div className="flex-1 xl:max-w-md min-w-0">
            <CustomSelect
              value={selectedPref.key}
              onChange={(val) => {
                const found = Object.values(PrefKey).find((p) => p.key === val);
                if (found) setSelectedPref(found);
              }}
              options={prefOptions}
              activeColor={accentColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingScopeFilter;
