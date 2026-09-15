export interface ClimateSection {
  title?: string;
  content: string[];
  isSummary?: boolean;
}

export interface ClimateArticleData {
  catchphrase: string;
  climateType: string;
  heroDescription: string;
  description: ClimateSection[];
  highlights: string[];
  uonzuList?: string[];
}
