// src/components/MiniMap.jsx
import { GoogleMap, Marker } from "@react-google-maps/api";

export default function MiniMap({ lat, lng }) {
  if (!lat || !lng) return null;

  const _lat = parseFloat(lat);
  const _lng = parseFloat(lng);

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "280px",
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
