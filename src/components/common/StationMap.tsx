import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useMemo } from "react";
import { RawStationData } from "../../types/raw";
import { StationId } from "../../types/union";

export interface StationMapProps {
  lat?: number | string;
  lng?: number | string;
  stationsMap?: Record<StationId, RawStationData>;
  onStationClick?: (station: RawStationData) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  overflow: "hidden",
};

const StationMap: React.FC<StationMapProps> = ({
  lat,
  lng,
  stationsMap,
  onStationClick,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const isSingle = lat != null && lng != null;

  const center = useMemo(() => {
    if (isSingle) {
      return { lat: Number(lat), lng: Number(lng) };
    }
    return { lat: 35.6812, lng: 139.7671 };
  }, [isSingle, lat, lng]);

  const zoom = isSingle ? 9 : 6;

  const options = {
    gestureHandling: isSingle ? "cooperative" : "greedy",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  const stationList = useMemo(() => {
    return stationsMap ? Object.values(stationsMap) : [];
  }, [stationsMap]);

  if (!isLoaded) {
    return (
      <div
        style={mapContainerStyle}
        className="bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-xs"
      >
        Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={options}
    >
      {isSingle ? (
        <Marker position={{ lat: Number(lat), lng: Number(lng) }} />
      ) : (
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

export default React.memo(StationMap);
