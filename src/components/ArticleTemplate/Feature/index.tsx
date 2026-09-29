import React from "react";
import Link from "next/link";
import {
  FaAward,
  FaExternalLinkAlt,
  FaTemperatureHigh,
  FaCloudRain,
} from "react-icons/fa";
import stationsRaw from "../../../../public/stations.json";
import { resolvePref } from "../../../utils/masterUtils";
import { RegionKey } from "../../../setting/region";

interface RawStation {
  id: string;
  station_name: string;
  official_name?: string;
  pref: string;
}

const STATIONS = stationsRaw as Record<string, RawStation>;

export interface FeatureStationCardProps {
  id: string;
  recordBadgeText?: string;
  // Meteo形式の項目（任意）
  prime?: string;
  tempDescription?: string;
  rainDescription?: string;
  otherTopic?: string;
  // Hot形式の箇条書き（任意）
  bullets?: string[];
}

export const FeatureStationCard: React.FC<FeatureStationCardProps> = ({
  id,
  recordBadgeText,
  prime,
  tempDescription,
  rainDescription,
  otherTopic,
  bullets,
}) => {
  // すべて id から自動解決
  const station = STATIONS[id];
  const prefMeta = station ? resolvePref(station.pref) : null;
  const regionMeta = prefMeta?.region || RegionKey.kanto;

  const displayName = station?.station_name || id;
  const displayPref = prefMeta?.label || "";
  const themeColor = regionMeta.colorStrong || "#2563eb";

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 space-y-4">
      {/* ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {displayPref && (
            <span
              className="px-2.5 py-1 text-xs font-black rounded-lg text-white"
              style={{ backgroundColor: themeColor }}
            >
              {displayPref}
            </span>
          )}
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <span>{displayName}</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              (#{id})
            </span>
          </h3>
        </div>

        <Link
          href={`/station/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline px-3 py-1.5 rounded-xl transition-colors"
          style={{
            color: themeColor,
            backgroundColor: `color-mix(in srgb, ${themeColor} 10%, white)`,
          }}
        >
          <span>雨温図・詳細データ</span>
          <FaExternalLinkAlt className="text-[10px]" />
        </Link>
      </div>

      {/* 記録バッジ */}
      {recordBadgeText && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
            <FaAward className="text-amber-500 text-sm" />
            <span>{recordBadgeText}</span>
          </span>
        </div>
      )}

      {/* Meteo形式の解説コンテンツ */}
      {(prime || tempDescription || rainDescription || otherTopic) && (
        <div className="space-y-2 text-xs leading-relaxed text-slate-700">
          {prime && <p className="text-slate-600 font-medium">{prime}</p>}

          {(tempDescription || rainDescription) && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pt-2">
              {tempDescription && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 mb-1">
                    <FaTemperatureHigh />
                    <span>気温の特徴</span>
                  </div>
                  <p className="text-slate-600">{tempDescription}</p>
                </div>
              )}

              {rainDescription && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-blue-700 mb-1">
                    <FaCloudRain />
                    <span>降水・雪・日照の特徴</span>
                  </div>
                  <p className="text-slate-600">{rainDescription}</p>
                </div>
              )}
            </div>
          )}

          {otherTopic && (
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100/80 mt-2">
              💡 <strong>気候トピック:</strong> {otherTopic}
            </p>
          )}
        </div>
      )}

      {/* Hot形式の箇条書きコンテンツ */}
      {bullets && bullets.length > 0 && (
        <div className="space-y-2 pt-1 text-xs leading-relaxed text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          {bullets.map((point, bIdx) => (
            <p key={bIdx} className="flex items-start gap-2">
              <span className="text-rose-500 font-bold shrink-0">・</span>
              <span>{point.replace(/^・\s*/, "")}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureStationCard;
