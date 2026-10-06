import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { ClimateArticleData } from "../../../../../../data/types";
import { ArticleClimateStarPanel } from "./StarPanel/UI";
import { CategoryKey, CategoryValue } from "../../../../../../setting/category";
import { RawData, RawStationData } from "../../../../../../types/raw";
import { StationId } from "../../../../../../types/union";
import ClimateUonzuAccordion from "../../../widgets/UonzuAccordion";

import { ChildSectionItem } from "./function";

export const ClimateIntroSection: React.FC<{
  item: ChildSectionItem;
  stationsMap: Record<StationId, RawData>;
  hideWidgets?: boolean;
  summaryOnly?: boolean;
}> = ({
  item,
  stationsMap,
  hideWidgets = false,
  summaryOnly = false,
}) => {
  const areaLabel = item.name;
  const accentColor = item.color || "#2563eb";

  const matcher = useCallback(
    (s: RawStationData) => {
      if (item.targetPrefCodes && item.targetPrefCodes.length > 0) {
        const codeSet = new Set(item.targetPrefCodes);
        return !!s.pref && codeSet.has(s.pref);
      }
      if (item.key) {
        return s.area === item.key;
      }
      return true;
    },
    [item.targetPrefCodes, item.key]
  );

  const displaySections = useMemo(() => {
    if (!item.description) return [];
    if (summaryOnly) {
      const summaries = item.description.filter((sec) => sec.isSummary);
      return summaries.length > 0 ? summaries : [item.description[0]].filter(Boolean);
    }
    return item.description;
  }, [item.description, summaryOnly]);

  // 雨温図対象地点のみを抽出（uonzuListまたは代表地点）
  const uonzuStationsMap = useMemo(() => {
    if (!stationsMap) return {};
    const targetIds =
      item.uonzuList && item.uonzuList.length > 0
        ? item.uonzuList
        : item.representativeStationId
        ? [item.representativeStationId]
        : [];

    if (targetIds.length === 0) return {};

    const filtered: Record<StationId, RawData> = {};
    for (const id of targetIds) {
      if (stationsMap[id]) {
        filtered[id] = stationsMap[id];
      }
    }
    return filtered;
  }, [stationsMap, item.uonzuList, item.representativeStationId]);


  return (
    <div className="space-y-4">
      {/* 特徴と解説文 */}
      {item.catchphrase && (
        <p className="font-bold text-slate-800">
          【特徴】{item.catchphrase}（{item.climateType}）
        </p>
      )}

      <div className="space-y-4 text-slate-600 leading-relaxed">
        {displaySections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {sec.title && sec.title !== "全体の特徴" && (
              <h3 className="font-bold text-slate-800">【{sec.title}】</h3>
            )}
            <p>{sec.content.join("")}</p>
          </div>
        ))}
      </div>

      {/* 主な気候ポイント（ハイライト） */}
      {!hideWidgets && item.highlights && item.highlights.length > 0 && (
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-xs font-black text-slate-700 block">
            {areaLabel}の主な気候ポイント:
          </span>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
            {item.highlights.map((hl, hIdx) => (
              <div
                key={hIdx}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm min-w-0"
              >
                <FaCheckCircle
                  className="text-xs shrink-0"
                  style={{ color: accentColor }}
                />
                <span className="truncate" title={hl}>
                  {hl}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 気候特性スター評価（ArticleClimateStarPanel 自身が stationsMap から計算して描画、全国サマリー表示時は非表示） */}
      {!hideWidgets && !summaryOnly && (
        <ArticleClimateStarPanel
          stationsMap={stationsMap}
          matcher={matcher}
          representativeStationId={item.representativeStationId}
          defaultOpen={false}
        />
      )}

      {/* 代表地点の雨温図（開閉式アコーディオン：uonzuListまたは代表地点のみに絞り込み） */}
      {!hideWidgets && Object.keys(uonzuStationsMap).length > 0 && (
        <ClimateUonzuAccordion
          title={`${areaLabel}の代表雨温図`}
          stationsMap={uonzuStationsMap}
          accentColor={accentColor}
          defaultOpen={false}
        />
      )}


      {/* 所属都道府県リンク（地方一覧表示時用） */}
      {item.prefLinks && item.prefLinks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          <span className="text-xs font-bold text-slate-500 self-center mr-1">
            所属都道府県:
          </span>
          {item.prefLinks.map((p) => (
            <Link
              key={p.key}
              href={p.href}
              className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200/60 transition-colors"
            >
              {p.label}
            </Link>
          ))}
        </div>
      )}

      {/* 下位階層へのリンクボタン（地方→都道府県など単一リンク） */}
      {item.linkHref && (
        <div className="pt-2">
          <Link
            href={item.linkHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-sm hover:opacity-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, color-mix(in srgb, ${accentColor} 75%, black) 100%)`,
            }}
          >
            <span>{item.linkLabel || `${areaLabel}の詳しい気候解説へ`}</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      )}

      {/* エリア所属のアメダス観測所一覧リンク（都道府県→各観測所詳細） */}
      {item.stationLinks && item.stationLinks.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block mb-2">
            📍 {areaLabel}のアメダス観測所詳細データ:
          </span>
          <div className="flex flex-wrap gap-2">
            {item.stationLinks.map((st) => {
              const catMeta = st.category
                ? CategoryKey[st.category as CategoryValue]
                : CategoryKey.amedas;
              const icon = catMeta?.icon ?? CategoryKey.amedas.icon;
              const color = catMeta?.colorFull ?? CategoryKey.amedas.colorFull;

              return (
                <Link
                  key={st.id}
                  href={`/station/${st.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-white hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs"
                >
                  <span className="text-sm shrink-0" style={{ color }}>
                    {icon}
                  </span>
                  <span>{st.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateIntroSection;
