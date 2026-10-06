import React from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { RawData } from "../../../types/raw";
import { resolvePref } from "../../../utils/masterUtils";
import InfoHeader from "./widgets/Header/UI";
import MetricGrid from "./widgets/MetricGrid/UI";

export interface InfoPanelProps {
  rawData?: RawData | null;
  loading?: boolean;
  isTitle?: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  rawData,
  loading = false,
  isTitle = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-3xl p-3 xl:p-6 shadow-sm border border-slate-100 flex items-center justify-center animate-pulse h-full bg-slate-50 min-h-[300px]">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
          <p className="text-xs">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!rawData?.station) {
    return (
      <div className="rounded-3xl p-3 xl:p-6 shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 text-sm h-full bg-slate-50 min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <BsFillQuestionCircleFill className="text-3xl" />
          <p>地点を選択してください</p>
        </div>
      </div>
    );
  }

  const pref = rawData.station.pref ? resolvePref(rawData.station.pref) : undefined;
  const region = pref?.region;

  return (
    <div className="rounded-3xl px-3 xl:px-5 py-5 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden transition-all h-full bg-white">
      {/* Background Accent */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: region?.colorStrong || "#3b82f6" }}
      />

      <InfoHeader
        rawData={rawData}
        isTitle={isTitle}
      />

      <MetricGrid rawData={rawData} />
    </div>
  );
};

export default InfoPanel;
