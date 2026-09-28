import React from "react";
import { ClimateArticleData } from "../../data/types";
import { ArticleUonzuItem } from "../../utils/ssgLoader";
import { ClimateStarEntry } from "./ArticleClimateStarPanel";
import { ClimateStarsResult } from "../../utils/climateStarCalculator";
import { ClimateIntroSection } from "./ClimateIntroSection";

export interface ClimateChildSectionItem extends ClimateArticleData {
  key: string;
  name: string;
  climateStars?: Partial<Record<string, ClimateStarEntry>> | ClimateStarsResult | null;
  repStationName?: string;
  uonzuItems?: ArticleUonzuItem[];
  linkHref?: string;
  linkLabel?: string;
  stationLinks?: { id: string; name: string; category?: string }[];
}

interface ClimateChildSectionsProps {
  startNumber?: number;
  accentColor: string;
  items: ClimateChildSectionItem[];
}

export const ClimateChildSections: React.FC<ClimateChildSectionsProps> = ({
  startNumber = 4,
  accentColor,
  items,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map((item, idx) => {
        const sectionLabel = `${startNumber}-${idx + 1}`;

        return (
          <ClimateIntroSection
            key={item.key}
            id={item.key}
            title={`${sectionLabel}. ${item.name}の気候`}
            accentColor={accentColor}
            areaLabel={item.name}
            data={item}
            climateStars={item.climateStars}
            repStationName={item.repStationName}
            uonzuTitle={`${item.name}の代表雨温図`}
            uonzuItems={item.uonzuItems}
            linkHref={item.linkHref}
            linkLabel={item.linkLabel}
            stationLinks={item.stationLinks}
          />
        );
      })}
    </>
  );
};

export default ClimateChildSections;
