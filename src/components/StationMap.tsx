import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useEffect, useMemo, useState } from "react";

import { StationId } from "../types/union";

// ==============================
// Types
// ==============================
interface Station {
  id: StationId;
  lat: number;
  lon: number;
  name: string;
}

interface StationMapProps {
  isMini?: boolean;
  lat?: number | string;
  lng?: number | string;
  height?: string;
  onStationClick?: (station: any) => void;
}

// ==============================
// Component
// ==============================
const StationMap: React.FC<StationMapProps> = ({
  isMini = false,
  lat,
  lng,
  onStationClick,
}) => {
  const [stationList, setStationList] = useState<Station[]>([]);

  useEffect(() => {
    // 通常モード（メインマップ）の場合のみ、全地点のデータを読み込む
    if (!isMini) {
      fetch("/stations.json")
        .then((res) => res.json())
        .then((data) => {
          const list: Station[] = Object.values(data);
          setStationList(list);
        })
        .catch((err) => console.error(err));
    }
  }, [isMini]);

  const center = useMemo(() => {
    // Miniモードで座標が指定されている場合は、その地点を中心に
    if (isMini && lat && lng) {
      return { lat: parseFloat(lat as string), lng: parseFloat(lng as string) };
    }
    // デフォルト（日本全体を俯瞰する位置）
    return { lat: 35.6812, lng: 139.7671 };
  }, [isMini, lat, lng]);

  const zoom = isMini ? 9 : 6;

  const mapContainerStyle = {
    width: "95%",
    height: "95%",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const options = {
    gestureHandling: isMini ? "cooperative" : "greedy",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={options}
    >
      {isMini && lat && lng ? (
        // Miniモード: 特定の1地点のみにマーカーを表示
        <Marker
          position={{
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string),
          }}
        />
      ) : (
        // 通常モード: 全地点にマーカーを表示
        stationList.map((s) => (
          <Marker
            key={s.id}
            position={{ lat: s.lat, lng: s.lon }}
            onClick={() => onStationClick?.(s)}
          />
        ))
      )}
    </GoogleMap>
  );
};

export default StationMap;
