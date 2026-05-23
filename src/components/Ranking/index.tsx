import React, { useState } from "react";
import { MetricKey } from "../../utils/colorUtils";
import { RankType, Station } from "./types";
import { useRankingData } from "./useRankingData";
import RankingTabs from "./RankingTabs";
import RankingList from "./RankingList";
import MetricPopup from "./MetricPopup";

interface RankingProps {
  onStationClick: (station: Station) => void;
}

const Ranking: React.FC<RankingProps> = ({ onStationClick }) => {
  const [sortKey, setSortKey] = useState<MetricKey>(MetricKey.Av_AvTemp);
  const [rankType, setRankType] = useState<RankType>(RankType.Top);

  const [selectedRegion, setSelectedRegion] = useState("kanto");
  const [selectedPref, setSelectedPref] = useState("44");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedMetricKey, setSelectedMetricKey] = useState<MetricKey | null>(
    null
  );

  const { stations } = useRankingData(
    sortKey,
    rankType,
    selectedRegion,
    selectedPref,
    selectedMonth
  );

  return (
    <div className="overflow-auto h-full p-2 flex flex-col gap-2">
      <RankingTabs
        sortKey={sortKey}
        setSortKey={setSortKey}
        rankType={rankType}
        setRankType={setRankType}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedMetricKey={selectedMetricKey}
        setSelectedMetricKey={setSelectedMetricKey}
        setShowPopup={setShowPopup}
        setSelectedRegion={setSelectedRegion}
        setSelectedPref={setSelectedPref}
      />

      <MetricPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onApply={(key) => {
          setSortKey(key);
          setSelectedMetricKey(key);
        }}
        rankType={rankType}
        initialMetricKey={selectedMetricKey}
      />

      <RankingList
        stations={stations}
        sortKey={sortKey}
        onStationClick={onStationClick}
      />
    </div>
  );
};

export default Ranking;
