// src/components/DescriptionWithMap.jsx
import { getIcon, getRegionColor } from "../utils/colorUtils";
import MiniMap from "./MiniMap";
import Description from "./description";
/**
 * stations: [{正式名称, 都道府県, 緯度, 経度}, ...]
 * regionColor: 背景色
 */
export default function DescriptionWithMap({ station }) {
  if (!station || station.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {station.map((station, idx) => {
        const lat = station?.緯度 ? parseFloat(station.緯度) : null;
        const lng = station?.経度 ? parseFloat(station.経度) : null;
        const regionColor = getRegionColor(station.都道府県);
        return (
          <div key={idx} className="w-full h-full flex flex-col">
            {/* タイトル */}
            <div
              className="flex flex-row items-center justify-between w-full mb-2 sm:mb-2 p-1 rounded"
              style={{ backgroundColor: regionColor }}
            >
              <h2 className="flex items-baseline gap-1 font-bold text-base sm:text-xl">
                {getIcon(station.正式名称)}
                <span>{station.正式名称}</span>
                <span className="text-gray-800 text-sm">
                  ({station.都道府県})
                </span>
              </h2>
            </div>

            {/* 左: Description, 右: MiniMap */}
            <div className="w-full h-full flex flex-col sm:flex-row gap-2">
              <div className="flex-[6] w-full">
                <Description station={station} />
              </div>
              <div className="flex-[5] w-full min-h-[250px] sm:h-full">
                <MiniMap lat={lat} lng={lng} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
