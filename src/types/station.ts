
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

export interface MonthlyDataSource {
  all?: MonthlyData;
  [month: string]: MonthlyData | undefined;
}

export interface StationData {
  pref: string;
  official_name: string;
  station_name: string;
  city: string;
  height: number | null;
  lon: number | null;
  lat: number | null;
  uonzu: {
    av_avtemp: number[];
    av_hitemp: number[];
    av_lwtemp: number[];
    sm_rain: number[];
    sm_sun: number[];
    sm_snowing: number[];
  };
  data: {
    av_avtemp?: MonthlyDataSource;
    av_hitemp?: MonthlyDataSource;
    sm_sun?: MonthlyDataSource;
    sm_rain?: MonthlyDataSource;
    sm_snowing?: MonthlyDataSource;
  };
}
