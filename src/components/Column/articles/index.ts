import React from "react";
import { TocItem } from "../../Sidebar";
import {
  JapanClimateClassificationArticle,
  japanClimateTocItems,
} from "./JapanClimateClassificationArticle";

export interface ColumnArticleContent {
  component: React.ComponentType;
  tocItems: TocItem[];
}

export const COLUMN_COMPONENTS: Record<string, ColumnArticleContent> = {
  "japan-climate-classification": {
    component: JapanClimateClassificationArticle,
    tocItems: japanClimateTocItems,
  },
};
