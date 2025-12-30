import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

// ==============================
// Types
// ==============================
interface MiniMapProps {
  lat: number | string;
  lng: number | string;
  height?: string;
}

// ==============================
// Component
// ==============================
const MiniMap: React.FC<MiniMapProps> = ({ lat, lng, height = "350px" }) => {
  if (!lat || !lng) return null;

  const _lat = parseFloat(lat as string);
  const _lng = parseFloat(lng as string);

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height,
        borderRadius: "12px",
        overflow: "hidden",
      }}
      center={{ lat: _lat, lng: _lng }}
      zoom={9}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker position={{ lat: _lat, lng: _lng }} />
    </GoogleMap>
  );
};

export default MiniMap;
