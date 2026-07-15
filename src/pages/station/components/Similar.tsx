import React from "react";
import { FaBuilding, FaLayerGroup } from "react-icons/fa";
import { StationData } from "../../../types/all";
import { SectionWithDescription } from "../../../utils/colorUtils";
import StationListItem from "../../../components/StationListItem";

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
          <StationListItem
            id={item.id}
            rank={index + 1}
            name={item.station_name}
            prefLabel={item.pref?.label}
            prefColor={item.pref?.region?.colorStrong}
            city={item.city}
            icon={item.category.icon}
            categoryColor={item.category.colorFull}
            value={(item.similar! * 100).toFixed(1)}
            unit="%"
            valueLabel="類似度"
            href={`/station/${item.id}`}
          />
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
