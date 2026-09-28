import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { ArticleSection } from "./ArticleTemplate";
import { MetricKey, MetricValue } from "../../setting/metric";
import { CategoryKey, CategoryValue } from "../../setting/category";
import { RegionTop1Item } from "../../utils/ssgLoader";

interface Top1StationsSectionProps {
  title: string;
  accentColor: string;
  areaLabel: string;
  rankScopeText: string; // 例: "地方第1位（極値）" または "県内第1位（極値）"
  top1Stations: RegionTop1Item[];
}

export const Top1StationsSection: React.FC<Top1StationsSectionProps> = ({
  title,
  accentColor,
  areaLabel,
  rankScopeText,
  top1Stations,
}) => {
  return (
    <ArticleSection id="top1-stations" title={title} accentColor={accentColor}>
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed text-sm">
          {areaLabel}に位置するアメダス観測所の中で、各主要気象項目の年間統計において
          <strong className="text-slate-800">{rankScopeText}</strong>
          を記録している地点一覧です。
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pt-1">
          {top1Stations.map((item) => {
            const mMeta = MetricKey[item.metric as MetricValue];
            const catMeta =
              CategoryKey[item.station.category as CategoryValue] || CategoryKey.amedas;
            const dirMeta = item.isHigh ? mMeta?.high : mMeta?.low;
            const badgeColor = dirMeta?.color || mMeta?.color || "#475569";
            const badgeIcon = dirMeta?.icon || mMeta?.icon;

            return (
              <Link
                key={`${item.metric}-${item.isHigh}`}
                href={`/station/${item.station.id}`}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all text-inherit no-underline gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* 指標アイコンバッジ */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 border"
                    style={{
                      color: badgeColor,
                      backgroundColor: `${badgeColor}15`,
                      borderColor: `${badgeColor}30`,
                    }}
                  >
                    {badgeIcon}
                  </div>

                  <div className="flex flex-col min-w-0">
                    {/* 項目名 */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-700">
                        {item.label}
                      </span>
                    </div>

                    {/* 地点名 */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span
                        className="text-[11px] p-1 rounded flex items-center justify-center shrink-0"
                        style={{
                          color: catMeta.colorFull,
                          backgroundColor: catMeta.colorBase,
                        }}
                        title={catMeta.label}
                      >
                        {catMeta.icon}
                      </span>
                      <span className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                        {item.station.stationName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        {item.station.prefName || item.station.city}
                      </span>
                    </div>

                    {/* 平年値と全国順位 */}
                    <div className="text-xs font-bold mt-0.5 flex items-center gap-2">
                      <span className="text-slate-800 font-extrabold text-[12px]">
                        平年値: {item.value}
                        {mMeta?.unit}
                      </span>
                      <span className="text-slate-400 font-normal text-[11px]">
                        （全国{item.isHigh ? "上位" : "下位"}
                        {item.nationalRank}位）
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-blue-600 shrink-0">
                  <span>詳細</span>
                  <FaArrowRight className="text-[9px]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </ArticleSection>
  );
};

export default Top1StationsSection;
