import { useEffect, useState } from "react";
import { RawMonthlyData, RawStationData } from "../types/raw";
import { StationId } from "../types/union";
import { climateDownload } from "../utils/downloader";

// ==========================================
// Hook: useStationDetail
// ==========================================

export const useStationDetail = (
  stationId: StationId | null,
  initialMaster?: Record<StationId, RawStationData>
) => {
  const [stationData, setStationData] = useState<RawStationData | null>(null);
  const [climateData, setClimateData] = useState<RawMonthlyData | null>(null);
  const [uonzuData, setUonzuData] = useState<RawMonthlyData | null>(null);
  const [tableData, setTableData] = useState<RawMonthlyData | null>(null);
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
        if (raw) setStationData(raw);

        const metricsMap = await climateDownload({
          [stationId]: ["overview", "uonzu", "table"],
        }, master);
        const item = metricsMap[stationId];
        if (!item) return;

        const { climateData: rawClimate } = item;

        setClimateData(rawClimate || null);
        setUonzuData(rawClimate || null);
        setTableData(rawClimate || null);
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
