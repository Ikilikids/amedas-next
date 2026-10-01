import React from "react";
import Link from "next/link";
import {
  FaAward,
  FaExternalLinkAlt,
  FaTemperatureHigh,
  FaCloudRain,
} from "react-icons/fa";
import { MeteoStationItem } from "../../ssg_function";

export interface MeteoStationCardProps {
  station: MeteoStationItem;
}

export const MeteoStationCard: React.FC<MeteoStationCardProps> = ({
  station,
}) => {
  const { id, name, officialName, prefLabel, data } = station;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {prefLabel}
          </span>
          <h4 className="text-base font-black text-slate-800">
            {officialName || name}
          </h4>
        </div>
        <Link
          href={`/station/${id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span>詳細ページ</span>
          <FaExternalLinkAlt className="text-[10px]" />
        </Link>
      </div>

      <div className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold">
        <FaAward className="text-amber-500 text-sm shrink-0" />
        <span className="truncate">{data.record}</span>
      </div>

      <div className="space-y-2 text-xs text-slate-600">
        {data.prime && (
          <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
            {data.prime}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {data.temp && (
            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-rose-50/50 border border-rose-100">
              <FaTemperatureHigh className="text-rose-400 mt-0.5 shrink-0" />
              <div className="leading-snug">
                <span className="font-bold text-slate-700 block mb-0.5">
                  気温の特色
                </span>
                <span>{data.temp}</span>
              </div>
            </div>
          )}
          {data.rain && (
            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-sky-50/50 border border-sky-100">
              <FaCloudRain className="text-sky-400 mt-0.5 shrink-0" />
              <div className="leading-snug">
                <span className="font-bold text-slate-700 block mb-0.5">
                  雨・雪の特色
                </span>
                <span>{data.rain}</span>
              </div>
            </div>
          )}
        </div>
        {data.other && (
          <div className="p-2 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 leading-snug">
            <span className="font-bold text-slate-700 block mb-0.5">
              その他のトピック
            </span>
            <span>{data.other}</span>
          </div>
        )}
      </div>
    </div>
  );
};
