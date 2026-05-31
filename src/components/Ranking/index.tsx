import React, { useState } from "react";
import { MetricKey, MetricMeta } from "../../utils/metric";
import { PrefKey, PrefMeta } from "../../utils/pref";
import { RegionKey, RegionMeta } from "../../utils/region";
import MetricPopup from "./MetricPopup";
import RankingList from "./RankingList";
import RankingTabs from "./RankingTabs";
import { RankType, RankingData } from "./types";
import { useRankingData } from "./useRankingData";

interface RankingProps {
  onStationClick: (station: RankingData) => void;
}

const Ranking: React.FC<RankingProps> = ({ onStationClick }) => {
  const [sortKey, setSortKey] = useState<MetricMeta>(MetricKey.av_avtemp);
  const [rankType, setRankType] = useState<RankType>(RankType.Top);

  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);
  const [selectedMonth, setSelectedMonth] = useState("all");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedMetricKey, setSelectedMetricKey] = useState<MetricMeta | null>(
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
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedPref={selectedPref}
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
