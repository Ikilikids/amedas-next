import React from "react";
import { FaStar } from "react-icons/fa";
import { MetricMeta } from "../../setting/metric";
import metricDistributionsRaw from "../../data/metricDistributions.json";

interface DistributionItem {
  min: number;
  max: number;
  binWidth: number;
  bins: number[];
  totalCount: number;
}

const metricDistributions: Record<string, DistributionItem> = metricDistributionsRaw;

interface ClimateStarPanelProps {
  metrics: {
    meta: MetricMeta;
    value: number | null | undefined;
  }[];
  accentColor?: string;
}

/**
 * 閾値セットから星の数(1〜maxStars)と該当文言を計算する
 */
function evaluateStar(
  value: number | null | undefined,
  starMeta?: MetricMeta["star"]
): { starCount: number; maxStars: number; label: string } {
  if (!starMeta) {
    return { starCount: 0, maxStars: 10, label: "--" };
  }

  const { baseLabel, levels } = starMeta;
  const maxStars = levels.length + 1;

  if (value == null || isNaN(value)) {
    return { starCount: 0, maxStars, label: "--" };
  }

  // 最初の閾値未満なら baseLabel (★1)
  if (levels.length === 0 || value < levels[0].threshold) {
    return { starCount: 1, maxStars, label: baseLabel };
  }

  // 後ろから順にチェック（超えている最大の閾値を探す）
  for (let i = levels.length - 1; i >= 0; i--) {
    if (value >= levels[i].threshold) {
      return {
        starCount: i + 2, // levels[0]以上なら★2、levels[8]以上なら★10
        maxStars,
        label: levels[i].label,
      };
    }
  }

  return { starCount: 1, maxStars, label: baseLabel };
}

/**
 * 分布ヒストグラムバー + 現在地ポインター
 */
const DistributionHistogram: React.FC<{
  dist?: DistributionItem;
  value: number | null | undefined;
  color: string;
}> = ({ dist, value, color }) => {
  if (!dist || dist.bins.length === 0) {
    return <div className="h-6 bg-slate-100 rounded" />;
  }

  // 現在地の位置（0〜100%）
  let positionPct = 50;
  if (value != null && !isNaN(value)) {
    const range = dist.max - dist.min;
    if (range > 0) {
      positionPct = Math.max(0, Math.min(100, ((value - dist.min) / range) * 100));
    }
  }

  return (
    <div className="relative w-full flex flex-col justify-end pt-1 pb-0.5">
      {/* ヒストグラム（山型チャート） */}
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

      {/* ベースライン */}
      <div className="w-full h-1 bg-slate-200/90 rounded-full relative">
        {/* 現在地点マーカー */}
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

      {/* 最小・最大ラベル */}
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
              {/* 上部: アイコン、項目名、閾値文言 */}
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
                {/* 閾値を超えたときの文言を表示（数値の代わりに表示） */}
                <div className="text-right shrink-0">
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs"
                    style={{ color: meta.color }}
                  >
                    {starLabel}
                  </span>
                </div>
              </div>

              {/* 中部: 星レーティング */}
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

              {/* 下部: 全国度数分布と現在地 */}
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
