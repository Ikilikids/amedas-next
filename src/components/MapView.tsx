import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

// ==============================
// Types
// ==============================
interface Station {
  id: string;
  緯度: string;
  経度: string;
  // Add other properties if needed based on the JSON structure
}

interface MapViewProps {
  onStationClick: (station: Station) => void;
}

// ==============================
// Component
// ==============================
const MapView: React.FC<MapViewProps> = ({ onStationClick }) => {
  const [stationList, setStationList] = useState<Station[]>([]);

  useEffect(() => {
    fetch("/station_latlon.json")
      .then((res) => res.json())
      .then((data) => {
        const list: Station[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        setStationList(list);
      })
      .catch((err) => console.error(err));
  }, []);

  const center = useMemo(() => ({ lat: 35.6812, lng: 139.7671 }), []);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={6}
      options={{
        gestureHandling: "greedy",
        mapTypeControl: false,
        streetViewControl: false,
      }}
    >
      {stationList.map((s) => (
        <Marker
          key={s.id}
          position={{ lat: parseFloat(s.緯度), lng: parseFloat(s.経度) }}
          onClick={() => onStationClick(s)}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;
