// src/components/InfoPanel.jsx
import { IoIosTrophy } from "react-icons/io";
export default function Description({ station }) {
  return (
    <div className="">
      <div className="flex gap-1">
        <span className="flex-shrink-0">
          <IoIosTrophy className="mt-1" />
        </span>
        <span className="break-words mb-1 font-bold">
          主な記録：{station.記録}
        </span>
      </div>
      <div className="whitespace-pre-line text-base font-bold">
        -----概要-----
      </div>
      <div className="whitespace-pre-line text-sm mb-1.5">{station.概要}</div>
      <div className="whitespace-pre-line text-base font-bold">
        -----気温-----
      </div>
      <div className="whitespace-pre-line text-sm mb-1.5">{station.気温}</div>
      <div className="whitespace-pre-line text-base font-bold">
        -----降水、日照など-----
      </div>
      <div className="whitespace-pre-line text-sm mb-1.5">{station.降水}</div>
      <div className="whitespace-pre-line text-base font-bold">
        -----その他-----
      </div>
      <div className="whitespace-pre-line text-sm">{station.その他}</div>
    </div>
  );
}
