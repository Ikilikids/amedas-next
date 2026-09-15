import React from "react";
import Link from "next/link";
import { RegionKey, RegionValue } from "../../setting/region";

export interface StationLinkProps {
  id: string;
  name: string;
  region: RegionValue;
}

export const StationLink: React.FC<StationLinkProps> = ({ id, name, region }) => {
  const meta = RegionKey[region];
  return (
    <Link
      href={`/station/${id}`}
      style={{
        backgroundColor: `${meta.colorStrong}18`,
        color: meta.colorStrong,
        borderColor: `${meta.colorStrong}40`,
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-xs border shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
    >
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: meta.colorStrong }}
      />
      <span>{name}</span>
      <span className="text-[10px] opacity-75 font-normal">({id})</span>
    </Link>
  );
};
