// src/components/Gacha/StationCardMini.tsx
import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import {
  StationRaw,
  Rarity,
  RARITY_META,
  getPrefLabel,
  getCategoryLabel,
} from "./gachaUtils";

interface MiniCardProps {
  station: StationRaw;
  rarity: Rarity;
  isNew: boolean;
}

export const StationCardMini: React.FC<MiniCardProps> = ({ station, rarity, isNew }) => {
  const meta = RARITY_META[rarity];

  return (
    <div className={`w-full p-4 rounded-2xl relative border ${meta.cardBg} flex flex-col justify-between min-h-[11rem] shadow-md`}>
      {isNew && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full animate-bounce shadow">
          NEW!
        </span>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${meta.bgClass}`}>
            {rarity}
          </span>
          <span className="text-[9px] text-slate-500 font-bold">
            {getPrefLabel(station.pref)}
          </span>
        </div>

        <h4 className="text-xs sm:text-sm font-black line-clamp-2 text-white">
          {station.station_name}
        </h4>
        
        <p className="text-[9px] text-slate-500 font-bold mt-1">
          {getCategoryLabel(station.category)}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-900/60 mt-2">
        <Link
          href={`/station/${station.id}`}
          className={`w-full py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 font-black text-[9px] ${
            rarity === "C" ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-white text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>詳細</span>
          <FaChevronRight />
        </Link>
      </div>
    </div>
  );
};
