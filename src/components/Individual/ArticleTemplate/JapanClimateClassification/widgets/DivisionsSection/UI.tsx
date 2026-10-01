import React from "react";
import { CLIMATE_DIVISIONS } from "../../../../../../data/classification";
import { ClimateUonzuAccordion } from "../../../Climate/widgets/UonzuAccordion";
import { ArticleUonzuItem } from "../../../../../../utils/ssgLoader";

export interface DivisionsSectionProps {
  uonzuMap: Map<string, ArticleUonzuItem>;
}

export const DivisionsSection: React.FC<DivisionsSectionProps> = ({ uonzuMap }) => {
  return (
    <div className="space-y-6">
      <p>
        日本の気候は、中学地理や気象学において主に次の<strong>6つの気候区分</strong>に分類されます。それぞれの雨温図にははっきりとした特徴が現れます。
      </p>

      {CLIMATE_DIVISIONS.map((div) => {
        return (
          <div
            key={div.name}
            className="p-5 border border-slate-200/80 rounded-2xl bg-white shadow-sm space-y-3"
          >
            <div className="flex items-center gap-2">
              <span style={{ color: div.accentColor }}>{div.icon}</span>
              <h3 className="font-black text-slate-800 text-base">
                {div.number} {div.name}（{div.subtitle}）
              </h3>
            </div>
            <p className="text-xs text-slate-600">{div.description}</p>
            <ClimateUonzuAccordion
              title={`${div.name}の雨温図`}
              items={div.stationIds
                .map((id) => uonzuMap.get(id))
                .filter((item): item is ArticleUonzuItem => Boolean(item))}
              accentColor={div.accentColor}
            />
          </div>
        );
      })}
    </div>
  );
};
