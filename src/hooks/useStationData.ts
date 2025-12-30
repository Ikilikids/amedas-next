// src/hooks/useStationData.ts
import { useEffect, useRef, useState } from "react";
import { StationData } from "../types/station";

export const useStationData = (stationId: string | null | undefined) => {
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const stationCacheRef = useRef<{ [key: string]: StationData }>({});

  useEffect(() => {
    if (!stationId) {
      setStationData(null);
      return;
    }

    if (stationCacheRef.current[stationId]) {
      setStationData(stationCacheRef.current[stationId]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/infotable/${stationId}.json`);
        const data: StationData = await res.json();
        stationCacheRef.current[stationId] = data;
        setStationData(data);
      } catch (e) {
        console.error("fetch error:", e);
        setStationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationId]);

  return { stationData, loading };
};
