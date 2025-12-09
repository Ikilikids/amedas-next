// src/components/InfoPanelWithMap.jsx
import InfoPanel from "./InfoPanel2";
import MiniMap from "./MiniMap";

export default function InfoPanelWithMap({ station, regionColor }) {
  console.log(regionColor);
  const lat = station?.緯度 ? parseFloat(station.緯度) : null;
  const lng = station?.経度 ? parseFloat(station.経度) : null;

  return (
    <div className="w-full h-full flex flex-col items-left">
      <div className="w-full h-full flex flex-col sm:flex-row gap-2">
        {/* 左：情報パネル */}
        <div className="flex-[6] w-full">
          <InfoPanel station={station} />
        </div>

        {/* 右：その地点だけの地図 */}
        <div className="flex-[5] w-full min-h-[250px] sm:h-full">
          <MiniMap lat={lat} lng={lng} />
        </div>
      </div>
    </div>
  );
}
