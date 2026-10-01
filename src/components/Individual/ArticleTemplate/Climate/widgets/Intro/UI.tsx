import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { ClimateUonzuAccordion } from "../UonzuAccordion";
import { ClimateArticleData } from "../../../../../../data/types";
import { ArticleClimateStarPanel } from "./StarPanel/UI";
import { CategoryKey, CategoryValue } from "../../../../../../setting/category";
import { RawData, RawStationData } from "../../../../../../types/raw";
import { StationId } from "../../../../../../types/union";
import { computeIntroData } from "./function";

export interface ClimateIntroSectionProps {
  areaLabel: string;
  data: ClimateArticleData;
  stationsMap: Record<StationId, RawData>;
  stationMatcher?: (s: RawStationData) => boolean;
  targetPrefCodes?: readonly string[];
  representativeStationId?: string;
  uonzuTitle?: string;
  accentColor?: string;
  linkHref?: string;
  linkLabel?: string;
  stationLinks?: { id: string; name: string; category?: string }[];
}

export const ClimateIntroSection: React.FC<ClimateIntroSectionProps> = ({
  areaLabel,
  data,
  stationsMap,
  stationMatcher,
  targetPrefCodes,
  representativeStationId,
  uonzuTitle,
  accentColor = "#2563eb",
  linkHref,
  linkLabel,
  stationLinks,
}) => {
  const matcher = useCallback(
    (s: RawStationData) => {
      if (stationMatcher) return stationMatcher(s);
      if (targetPrefCodes) {
        const codeSet = new Set(targetPrefCodes);
        return !!s.pref && codeSet.has(s.pref);
      }
      return true;
    },
    [stationMatcher, targetPrefCodes]
  );

  const { uonzuItems } = useMemo(() => {
    return computeIntroData(stationsMap, data.uonzuList);
  }, [stationsMap, data.uonzuList]);

  return (
    <div className="space-y-4">
      {/* 特徴と解説文 */}
      <p className="font-bold text-slate-800">
        【特徴】{data.catchphrase}（{data.climateType}）
      </p>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        {data.description.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {sec.title && (
              <h3 className="font-bold text-slate-800">【{sec.title}】</h3>
            )}
            <p>{sec.content.join("")}</p>
          </div>
        ))}
      </div>

      {/* 主な気候ポイント（ハイライト） */}
      {data.highlights && data.highlights.length > 0 && (
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-xs font-black text-slate-700 block">
            {areaLabel}の主な気候ポイント:
          </span>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
            {data.highlights.map((hl, hIdx) => (
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

      {/* 気候特性スター評価（ArticleClimateStarPanel 自身が stationsMap から計算して描画） */}
      <ArticleClimateStarPanel
        stationsMap={stationsMap}
        matcher={matcher}
        representativeStationId={representativeStationId}
        defaultOpen={false}
      />

      {/* 代表地点の雨温図（開閉式アコーディオン） */}
      {uonzuItems && uonzuItems.length > 0 && (
        <ClimateUonzuAccordion
          title={uonzuTitle || `${areaLabel}の代表雨温図`}
          items={uonzuItems}
          accentColor={accentColor}
          defaultOpen={false}
        />
      )}

      {/* 下位階層へのリンクボタン（地方→都道府県など単一リンク） */}
      {linkHref && (
        <div className="pt-2">
          <Link
            href={linkHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-sm hover:opacity-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, color-mix(in srgb, ${accentColor} 75%, black) 100%)`,
            }}
          >
            <span>{linkLabel || `${areaLabel}の詳しい気候解説へ`}</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      )}

      {/* エリア所属のアメダス観測所一覧リンク（都道府県→各観測所詳細） */}
      {stationLinks && stationLinks.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block mb-2">
            📍 {areaLabel}のアメダス観測所詳細データ:
          </span>
          <div className="flex flex-wrap gap-2">
            {stationLinks.map((st) => {
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
