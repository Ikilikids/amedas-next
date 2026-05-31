import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

// ==============================
// Types
// ==============================
interface Station {
  id: string;
  lat: number;
  lon: number;
  name: string;
}

interface MapViewProps {
  onStationClick: (station: any) => void;
}

// ==============================
// Component
// ==============================
const MapView: React.FC<MapViewProps> = ({ onStationClick }) => {
  const [stationList, setStationList] = useState<Station[]>([]);

  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => {
        const list: Station[] = Object.values(data);
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
          position={{ lat: s.lat, lng: s.lon }}
          onClick={() => onStationClick(s)}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;
