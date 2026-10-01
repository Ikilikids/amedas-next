import { useEffect, useState } from "react";
import { MonthlyData, StationData } from "../types/all";
import { RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { toMetricMap, toStation } from "../utils/masterUtils";
import { climateDownload } from "../utils/downloader";

// ==========================================
// Hook: useStationDetail
// ==========================================

export const useStationDetail = (
  stationId: StationId | null,
  initialMaster?: Record<StationId, RawStationData>
) => {
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [climateData, setClimateData] = useState<MonthlyData | null>(null);
  const [uonzuData, setUonzuData] = useState<MonthlyData | null>(null);
  const [tableData, setTableData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stationId) {
      setStationData(null);
      setClimateData(null);
      setUonzuData(null);
      setTableData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const master = initialMaster;
        if (!master) {
          throw new Error("useStationDetail: initialMaster (from SSG) is required.");
        }

        const raw = master[stationId];
        if (raw) setStationData(toStation(raw));

        const metricsMap = await climateDownload({
          [stationId]: ["overview", "uonzu", "table"],
        }, master);
        const item = metricsMap[stationId];
        if (!item) return;

        const { climateData: rawClimate } = item;
        const climateMap = toMetricMap(rawClimate, (v) => v);

        setClimateData(climateMap);
        setUonzuData(climateMap);
        setTableData(climateMap);
      } catch (e) {
        console.error("fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stationId]);

  return {
    stationData,
    climateData,
    uonzuData,
    tableData,
    loading,
  };
};
