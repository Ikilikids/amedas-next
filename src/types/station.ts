
export interface SelectedStation {
  id: string;
}

export interface MonthlyRank {
  top?: number;
  bot?: number;
  island?: number;
  region?: number;
  pre?: number;
  meteo?: number;
}

export interface MonthlyData {
  value: number | null;
  rank?: MonthlyRank;
}



export interface RankedValue {
  value: number;
  rank?: number;
}

export interface StationData {
  pref: string;
  official_name: string;
  station_name: string;
  city: string;
  height: number;
  lon: number;
  lat: number;

  // 月別平年値
  uonzu: {
    av_avtemp: number[];
    av_hitemp: number[];
    av_lwtemp: number[];
    sm_rain: number[];
    sm_sun: number[];
    sm_snowing: number[];
  };

  // 年平均・合計＋順位
  data: {
    av_avtemp?: RankedValue;
    av_hitemp?: RankedValue;
    av_lwtemp?: RankedValue;
    av_wind?: RankedValue;
    sm_rain?: RankedValue;
    sm_sun?: RankedValue;
    sm_snowing?: RankedValue;
  };
}
