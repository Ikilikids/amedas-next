import React, { useEffect, useState } from "react";
import { MetricKey, MetricMeta } from "../../utils/metric";
import { PrefKey, PrefMeta } from "../../utils/pref";
import { RankKey, RankMeta } from "../../utils/rank";
import { RegionKey, RegionMeta } from "../../utils/region";
import MetricPopup from "./MetricPopup";
import RankingList from "./RankingList";
import RankingTabs from "./RankingTabs";
import { RawRankingData } from "./types";
import { useRankingData } from "./useRankingData";

interface RankingProps {
  onStationClick: (station: RawRankingData) => void;
  isSimple?: boolean;
  initialSortKey?: MetricMeta;
  initialRankType?: RankMeta;
  initialMonth?: string;
}

const Ranking: React.FC<RankingProps> = ({
  onStationClick,
  isSimple = false,
  initialSortKey = MetricKey.av_avtemp,
  initialRankType = RankKey.top,
  initialMonth = "all",
}) => {
  const [sortKey, setSortKey] = useState<MetricMeta>(initialSortKey);
  const [rankType, setRankType] = useState<RankMeta>(initialRankType);

  const [selectedRegion, setSelectedRegion] = useState<RegionMeta>(
    RegionKey.kanto
  );
  const [selectedPref, setSelectedPref] = useState<PrefMeta>(PrefKey.tokyo);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedMetricKey, setSelectedMetricKey] = useState<MetricMeta | null>(
    null
  );

  // Simpleモード時に外部からの変更を反映
  useEffect(() => {
    if (isSimple) {
      setSortKey(initialSortKey);
      setRankType(initialRankType);
      setSelectedMonth(initialMonth);
    }
  }, [isSimple, initialSortKey, initialRankType, initialMonth]);

  const { stations } = useRankingData(
    sortKey,
    rankType,
    selectedRegion,
    selectedPref,
    selectedMonth
  );

  return (
    <div className="overflow-auto h-full p-2 flex flex-col gap-2">
      {!isSimple && (
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
      )}

      {!isSimple && (
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
      )}

      <RankingList
        stations={stations}
        sortKey={sortKey}
        onStationClick={onStationClick}
        isSimple={isSimple}
      />
    </div>
  );
};

export default Ranking;
