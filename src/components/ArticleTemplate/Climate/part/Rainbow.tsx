import React, { useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ArticleSection } from "../..";
import { METRIC_LIST, MetricKey, MetricValue } from "../../../../setting/metric";
import { CategoryKey, CategoryValue } from "../../../../setting/category";
import { RegionRainbowStationItem } from "../../../../utils/ssgLoader";
import RankBadge from "../../../../svg/RankBadge";

interface RainbowStationsSectionProps {
  title: string;
  accentColor: string;
  areaName: string;
  rainbowStations: RegionRainbowStationItem[];
}

export const RainbowStationsSection: React.FC<RainbowStationsSectionProps> = ({
  title,
  accentColor,
  areaName,
  rainbowStations,
}) => {
  // 虹バッジ対象の指標（thresholdsを持つもの）を自動走査して該当地点を展開
  const grouped = METRIC_LIST.flatMap((key) => {
    const meta = MetricKey[key];
    const dirs: { metric: MetricValue; isHigh: boolean }[] = [];
    if (meta.high) dirs.push({ metric: key, isHigh: true });
    if (meta.low) dirs.push({ metric: key, isHigh: false });
    return dirs;
  })
    .map((item) => {
      const stationsWithBadge: {
        station: RegionRainbowStationItem;
        badge: RegionRainbowStationItem["badges"][number];
      }[] = [];

      rainbowStations.forEach((s) => {
        s.badges.forEach((b) => {
          if (b.metric === item.metric && b.isHigh === item.isHigh) {
            stationsWithBadge.push({ station: s, badge: b });
          }
        });
      });

      // 順位順（上位1位〜）にソート
      stationsWithBadge.sort((a, b) => a.badge.place - b.badge.place);

      return {
        ...item,
        list: stationsWithBadge,
      };
    })
    .filter((g) => g.list.length > 0);

  return (
    <ArticleSection id="rainbow-stations" title={title} accentColor={accentColor}>
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed text-sm">
          全国約1,300地点のアメダス観測所のうち、年間統計（平均気温・猛暑日数・降水量・日照時間・最深積雪・平均風速）において
          <strong className="text-slate-800">全国TOP10（またはBOTTOM10）以内の最高ランク（虹バッジ）</strong>
          に該当する、{areaName}の全国屈指の気候特性を持つ観測地点です。
        </p>

        {grouped.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 text-center">
            全国屈指（虹バッジ）に該当する地点はありません。
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {grouped.map((grp) => (
              <RainbowMetricGroup
                key={`${grp.metric}-${grp.isHigh}`}
                grp={grp}
              />
            ))}
          </div>
        )}
      </div>
    </ArticleSection>
  );
};

interface RainbowMetricGroupProps {
  grp: {
    metric: MetricValue;
    isHigh: boolean;
    list: {
      station: RegionRainbowStationItem;
      badge: RegionRainbowStationItem["badges"][number];
    }[];
  };
}

const RainbowMetricGroup: React.FC<RainbowMetricGroupProps> = ({ grp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mMeta = MetricKey[grp.metric];
  const dirMeta = grp.isHigh ? mMeta?.high : mMeta?.low;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-slate-50/90 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-lg bg-white shadow-xs text-slate-700 text-sm flex items-center justify-center shrink-0 border border-slate-200/60">
            {dirMeta?.icon || mMeta?.icon}
          </span>
          <span className="font-black text-slate-800 text-sm xl:text-base truncate">
            {dirMeta?.label || mMeta?.label}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
            {grp.list.length}地点
          </span>
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <span>{isOpen ? "閉じる" : "一覧を見る"}</span>
            {isOpen ? (
              <FaChevronUp className="text-[10px]" />
            ) : (
              <FaChevronDown className="text-[10px]" />
            )}
          </span>
        </div>
      </button>

      {/* 地点カード一覧 */}
      {isOpen && (
        <div className="p-3.5 xl:p-4 bg-slate-50/30 border-t border-slate-100">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {grp.list.map(({ station, badge }) => {
              const catMeta =
                CategoryKey[station.category as CategoryValue] || CategoryKey.amedas;

              return (
                <Link
                  key={`${station.id}-${grp.metric}-${grp.isHigh}`}
                  href={`/station/${station.id}`}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all text-inherit no-underline gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 scale-95 origin-center">
                      <RankBadge
                        metric={mMeta}
                        rank="rainbow"
                        isHigh={badge.isHigh}
                        size={38}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-xs p-1 rounded flex items-center justify-center shrink-0"
                          style={{
                            color: catMeta.colorFull,
                            backgroundColor: catMeta.colorBase,
                          }}
                          title={catMeta.label}
                        >
                          {catMeta.icon}
                        </span>
                        <span className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                          {station.stationName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                          {station.prefName || station.city}
                        </span>
                      </div>
                      <div className="text-xs font-bold mt-1 flex items-center gap-2">
                        <span
                          className={`font-black ${badge.isHigh ? "text-rose-600" : "text-blue-600"
                            }`}
                        >
                          全国{badge.isHigh ? "上位" : "下位"}
                          {badge.place}位
                        </span>
                        <span className="text-slate-500 font-semibold text-[11px]">
                          平年値: {badge.value}
                          {mMeta?.unit}
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
      )}
    </div>
  );
};

export default RainbowStationsSection;
