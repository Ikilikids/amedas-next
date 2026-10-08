import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaChartBar, FaExternalLinkAlt } from "react-icons/fa";
import { RawData } from "../../../../types/raw";
import UonzuChart from "../../../common/UonzuChart";
import { MetricKey } from "../../../../setting/metric";

import { StationId } from "../../../../types/union";

export const ClimateUonzuAccordion: React.FC<{
  title?: string;
  stationsMap: Record<StationId, RawData>;
  stationIds?: string[];
  accentColor?: string;
  defaultOpen?: boolean;
}> = ({
  title = "代表地点の雨温図（平年値）",
  stationsMap,
  stationIds,
  accentColor = "#2563eb",
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const items = useMemo(() => {
    if (stationIds && stationIds.length > 0) {
      return stationIds
        .map((id) => stationsMap[id])
        .filter((item): item is RawData => Boolean(item));
    }
    return Object.values(stationsMap);
  }, [stationsMap, stationIds]);

  if (items.length === 0) return null;

  return (
    <div className="my-4 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between cursor-pointer text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FaChartBar style={{ color: accentColor }} className="text-sm shrink-0" />
          <span className="text-xs font-black text-slate-800 truncate">
            {title} ({items.map((i) => i.station.station_name).join("・")})
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0 ml-2">
          <span>{isOpen ? "閉じる" : "開く"}</span>
          {isOpen ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 xl:p-4 border-t border-slate-200/60 bg-slate-50/40">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {items.map((item) => {

              return (
                <div
                  key={item.station.id}
                  className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex flex-col"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-black text-slate-800">
                      {item.station.station_name}
                    </span>
                    <Link
                      href={`/station/${item.station.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>観測データ詳細</span>
                      <FaExternalLinkAlt className="text-[9px]" />
                    </Link>
                  </div>
                  <div className="w-full">
                    <UonzuChart
                      rawData={item}
                      selectedBar={MetricKey.sm_rain}
                      height="200px"
                      hideLegend={true}
                    />
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

export default ClimateUonzuAccordion;

