// src/components/MapView.jsx
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

export default function MapView({ onStationClick }) {
  const [stationList, setStationList] = useState([]);

  useEffect(() => {
    fetch("/station_latlon.json")
      .then((res) => res.json())
      .then((data) => {
        const list = Object.entries(data).map(([id, value]) => ({
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
}
