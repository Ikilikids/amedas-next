import Link from "next/link";
import React from "react";
import { FaBuilding, FaLayerGroup } from "react-icons/fa";
import { StationData } from "../types/all";
import { SectionWithDescription } from "../utils/colorUtils";
import { sanitizeCityName, sanitizePrefLabel } from "../utils/masterUtils";

// ==============================
// Types
// ==============================
type StationListProps = {
  title: string;
  items: StationData[];
  icon: React.ReactNode;
};

type SimilarPageProps = {
  similarDataAll: StationData[];
  similarDataMeteo: StationData[];
};

// ==============================
// Component
// ==============================
const StationList: React.FC<StationListProps> = ({
  title,
  items,
  icon: Icon,
}) => (
  <div className="mb-10">
    <SectionWithDescription
      icon={Icon}
      title={title}
      bgColor="rgb(30, 41, 59)"
    />

    <ul className="flex flex-col gap-2.5 mt-4">
      {items.map((item, index) => (
        <li key={item.id}>
          <Link
            href={`/station/${item.id}`}
            className="group block bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 relative overflow-hidden"
          >
            {/* Rank badge */}
            <div className="absolute top-0 right-0 bg-slate-50 border-bl border-slate-100 px-3 py-1 rounded-bl-xl text-[10px] font-black text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-colors">
              RANK {index + 1}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate pr-12 leading-tight">
                {item.official_name}
              </span>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  {item.pref && (
                    <span
                      className="px-1.5 py-0.5 rounded-md text-white shadow-sm"
                      style={{ backgroundColor: item.pref.region.colorStrong }}
                    >
                      {sanitizePrefLabel(item.pref.label)}
                    </span>
                  )}
                  {item.city && (
                    <span className="text-slate-400">
                      {sanitizeCityName(item.city)}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    類似度
                  </span>
                  <span className="text-sm font-black text-slate-700">
                    {(item.similar * 100).toFixed(1)}
                    <span className="text-[10px] ml-0.5">%</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// ==============================
// Page
// ==============================
const SimilarPage: React.FC<SimilarPageProps> = ({
  similarDataAll,
  similarDataMeteo,
}) => {
  return (
    <div className="w-full">
      {similarDataAll?.length > 0 && (
        <StationList
          title="類似する地点"
          items={similarDataAll}
          icon={<FaLayerGroup />}
        />
      )}

      {similarDataMeteo?.length > 0 && (
        <StationList
          title="類似する気象台"
          items={similarDataMeteo}
          icon={<FaBuilding />}
        />
      )}
    </div>
  );
};

export default SimilarPage;
