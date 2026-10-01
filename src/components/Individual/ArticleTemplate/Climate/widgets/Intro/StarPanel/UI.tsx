import React, { useState, useMemo } from "react";
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RawData, RawStationData } from "../../../../../../../types/raw";
import { StationId } from "../../../../../../../types/union";
import { extractStarPanelData } from "./function";

interface ArticleClimateStarPanelProps {
  stationsMap: Record<StationId, RawData>;
  matcher: (station: RawStationData) => boolean;
  representativeStationId?: string;
  defaultOpen?: boolean;
}

export const ArticleClimateStarPanel: React.FC<ArticleClimateStarPanelProps> = ({
  stationsMap,
  matcher,
  representativeStationId,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const { repStationName, items } = useMemo(() => {
    return extractStarPanelData(stationsMap, matcher, representativeStationId);
  }, [stationsMap, matcher, representativeStationId]);

  return (
    <div className="my-4 rounded-lg border border-slate-200/80 bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between cursor-pointer text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FaStar className="text-amber-500 text-xs shrink-0" />
          <span className="text-xs font-black text-slate-800 truncate">
            気候特性スター評価（{repStationName ? `代表地点：${repStationName}` : "代表地点"}）
          </span>
          <span className="hidden sm:inline text-[10px] font-bold text-slate-400">
            ※全国アメダス分布に基づく10段階
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0 ml-2">
          <span>{isOpen ? "閉じる" : "開く"}</span>
          {isOpen ? (
            <FaChevronUp className="text-[10px]" />
          ) : (
            <FaChevronDown className="text-[10px]" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 xl:p-4 border-t border-slate-200/60 bg-slate-50/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {items.map(({ meta, repStar, maxStars, rangeText, label }) => {
              return (
                <div
                  key={meta.key}
                  className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between"
                >
                  {/* 指標名 ＋ ラベル */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <span
                        className="text-xs shrink-0 p-0.5 rounded bg-slate-50 border border-slate-200/60"
                        style={{ color: meta.color }}
                      >
                        {meta.icon || meta.high?.icon}
                      </span>
                      <span className="text-[11px] font-black text-slate-700 truncate">
                        {meta.label}
                      </span>
                    </div>
                    <span
                      className="text-[9.5px] font-black px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 shrink-0 truncate max-w-[55%]"
                      style={{ color: meta.color }}
                      title={label}
                    >
                      {label}
                    </span>
                  </div>

                  {/* 星 ＋ 数値（中央寄せ） */}
                  <div className="flex items-center justify-center pt-2 pb-0.5 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-xs shrink-0" style={{ color: meta.color }} />
                      <span className="text-xs font-black font-mono text-slate-800">
                        {repStar}
                      </span>
                      <span className="text-[10px] font-bold font-mono text-slate-400">
                        /{maxStars}
                      </span>
                      <span className="text-[10px] font-medium font-mono text-slate-500 ml-1">
                        {rangeText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleClimateStarPanel;
