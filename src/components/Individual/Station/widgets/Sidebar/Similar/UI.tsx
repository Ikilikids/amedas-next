import React from "react";
import { FaBuilding, FaLayerGroup } from "react-icons/fa";
import { RawSimilarStationData } from "../../../../../../types/raw";
import { resolveCategory, resolvePref } from "../../../../../../utils/masterUtils";
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
      {getTopSimilarStations(items).map((item, index) => {
        const pref = item.pref ? resolvePref(item.pref) : undefined;
        const category = item.category ? resolveCategory(item.category) : undefined;

        return (
          <li key={item.id}>
            <StationListItem
              id={item.id!}
              rank={index + 1}
              name={item.station_name || ""}
              prefLabel={pref?.label}
              prefColor={pref?.region?.colorStrong}
              city={item.city}
              icon={category?.icon}
              categoryColor={category?.colorFull}
              value={item.similar != null ? (item.similar * 100).toFixed(1) : "--"}
              unit="%"
              valueLabel="類似度"
              href={`/station/${item.id}`}
              isSimple
            />
          </li>
        );
      })}
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
