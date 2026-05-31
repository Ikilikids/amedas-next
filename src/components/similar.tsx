import Link from "next/link";
import React from "react";
import { StationData } from "../types/all";

// ==============================
// Types
// ==============================
type StationListProps = {
  title: string;
  items: StationData[];
};

type SimilarPageProps = {
  similarDataAll: StationData[];
  similarDataMeteo: StationData[];
};

// ==============================
// Component
// ==============================
const StationList: React.FC<StationListProps> = ({ title, items }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>

    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={item.id} className="group">
          <Link
            href={`/station/${item.id}`}
            className="border rounded-lg p-2 shadow hover:shadow-lg transition flex items-center justify-between"
          >
            <span className="font-semibold w-8 text-left pl-3">
              {index + 1}
            </span>

            <div className="flex-1 flex flex-col ml-2 truncate">
              <span className="font-semibold truncate">
                {item.official_name}
              </span>

              <div className="flex gap-1 items-end text-sm">
                {item.pref && (
                  <span
                    className="font-semibold"
                    style={{ color: item.pref.region.colorStrong }}
                  >
                    {item.pref.label}
                  </span>
                )}

                {item.city && (
                  <span className="font-normal text-gray-700 text-xs">
                    {item.city}
                  </span>
                )}
              </div>
            </div>

            <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
              類似度 {(item.similar * 100).toFixed(1)}%
            </span>
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
    <div className="w-full p-2">
      {similarDataAll?.length > 0 && (
        <StationList title="類似する地点" items={similarDataAll} />
      )}

      {similarDataMeteo?.length > 0 && (
        <StationList title="類似する気象台" items={similarDataMeteo} />
      )}
    </div>
  );
};

export default SimilarPage;
