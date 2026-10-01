import React from "react";
import Link from "next/link";
import { FaAward, FaExternalLinkAlt, FaTemperatureHigh } from "react-icons/fa";
import { HotStationItem } from "../../ssg_function";

export interface HotStationCardProps {
  station: HotStationItem;
}

export const HotStationCard: React.FC<HotStationCardProps> = ({ station }) => {
  const { id, name, prefName, record, bullets } = station;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {prefName}
          </span>
          <h4 className="text-base font-black text-slate-800">{name}</h4>
        </div>
        <Link
          href={`/station/${id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span>詳細ページ</span>
          <FaExternalLinkAlt className="text-[10px]" />
        </Link>
      </div>

      <div className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/70 text-rose-800 text-xs font-bold">
        <FaAward className="text-rose-500 text-sm shrink-0" />
        <span className="truncate">{record}</span>
      </div>

      {bullets.length > 0 && (
        <ul className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          {bullets.map((b, idx) => (
            <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-rose-400 font-bold mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
