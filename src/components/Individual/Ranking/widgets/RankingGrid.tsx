import React from "react";
import { RankingData } from "../types";
import RankingCard from "./RankingCard";

interface RankingGridProps {
  items: RankingData[];
  unit: string;
  minBound: number;
  maxBound: number;
  subTextPrefix?: string; // 例: "記録: " または "観測日: "
  fractionDigits?: number;
  isLoading?: boolean;
}

export const RankingGrid: React.FC<RankingGridProps> = ({
  items,
  unit,
  minBound,
  maxBound,
  subTextPrefix,
  fractionDigits,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-500 rounded-full mb-4"></div>
        <p className="text-slate-500 font-bold">データを読み込み中...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <p className="text-slate-400 font-medium">
          該当するデータが見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
      {items.map((s) => (
        <RankingCard
          key={s.id}
          station={s}
          unit={unit}
          minBound={minBound}
          maxBound={maxBound}
          subText={s.time && subTextPrefix ? `${subTextPrefix}${s.time}` : s.time || null}
          fractionDigits={fractionDigits}
        />
      ))}
    </div>
  );
};

export default RankingGrid;
