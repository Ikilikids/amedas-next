// src/components/MiniMap.jsx
import { GoogleMap, Marker } from "@react-google-maps/api";

export default function MiniMap({ lat, lng, height = "350px" }) {
  if (!lat || !lng) return null;

  const _lat = parseFloat(lat);
  const _lng = parseFloat(lng);

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height, // ← ここを props に変更
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
}
