import React from "react";
import { FaBuilding, FaLayerGroup } from "react-icons/fa";
import { RawSimilarStationData } from "../../../../../../types/raw";
import StationListItem from "../StationListItem/UI";
import { getTopSimilarStations } from "./function";

type StationListProps = {
  title: string;
  items: RawSimilarStationData[];
  icon: React.ReactNode;
};

export type SimilarProps = {
  similarDataAll: RawSimilarStationData[];
  similarDataMeteo: RawSimilarStationData[];
};

const StationList: React.FC<StationListProps> = ({
  title,
  items,
  icon: Icon,
}) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
      <span className="text-slate-500 text-sm">{Icon}</span>
      <h3 className="font-black text-xs text-slate-800 tracking-tight">
        {title}
      </h3>
    </div>

    <ul className="flex flex-col gap-2">
      {getTopSimilarStations(items).map((item, index) => (
        <li key={item.id}>
          <StationListItem item={item} rank={index + 1} />
        </li>
      ))}
    </ul>
  </div>
);

export const Similar: React.FC<SimilarProps> = ({
  similarDataAll,
  similarDataMeteo,
}) => {
  return (
    <>
      <StationList
        title="全観測所中の類似気候"
        items={similarDataAll}
        icon={<FaLayerGroup />}
      />
      <StationList
        title="気象台・測候所中の類似気候"
        items={similarDataMeteo}
        icon={<FaBuilding />}
      />
    </>
  );
};

export default Similar;
