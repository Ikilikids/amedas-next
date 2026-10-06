import { MetricKey, MetricMeta, MetricValue } from "../../../../../../../setting/metric";
import { RawData, RawStationData } from "../../../../../../../types/raw";
import { StationId } from "../../../../../../../types/union";
import { calculateStar } from "../../../../../../../utils/starUtils";

export const TARGET_STAR_METRICS: MetricMeta[] = [
  MetricKey.av_avtemp,
  MetricKey.sm_sun,
  MetricKey.sm_rain,
  MetricKey.sm_snowing,
  MetricKey.av_wind,
  MetricKey.hitemp_35,
];

export interface StarPanelItem {
  meta: MetricMeta;
  repStar: number | null;
  maxStars: number;
  rangeText: string;
  label: string;
  hasData: boolean;
}

export interface StarPanelData {
  repStationName: string | null;
  items: StarPanelItem[];
}

/**
 * stationsMap から対象観測所群の平年値を集計し、
 * 星評価パネルに必要な各項目の repStar, min, max, ラベルを算出する純粋関数
 */
export function extractStarPanelData(
  stationsMap: Record<StationId, RawData>,
  matcher: (station: RawStationData) => boolean,
  representativeStationId?: string
): StarPanelData {
  const matchedStations = Object.values(stationsMap).filter((st) => matcher(st.station));

  const targetRep =
    (representativeStationId ? matchedStations.find((st) => st.station.id === representativeStationId) : undefined) ||
    matchedStations.find((st) => st.station.category === "meteo") ||
    matchedStations[0];

  const items: StarPanelItem[] = TARGET_STAR_METRICS.map((meta) => {
    const metricKey = meta.key as MetricValue;
    const maxStars = meta.star?.levels.length ? meta.star.levels.length + 1 : 10;

    // 対象観測所群の星計算結果を取得して昇順ソート
    const sorted = matchedStations
      .map((st) => {
        const entries = st.climateData?.[metricKey];
        return entries && entries.length > 12 ? entries[12]?.value : entries?.[0]?.value;
      })
      .filter((val): val is number => val != null)
      .map((val) => calculateStar(val, meta.star))
      .sort((a, b) => a.star - b.star);

    // 集計対象地点が1つもない（沖縄の雪など）場合
    if (sorted.length === 0) {
      return {
        meta,
        repStar: null,
        maxStars,
        rangeText: "",
        label: "データなし",
        hasData: false,
      };
    }

    const minRes = sorted[0];
    const maxRes = sorted[sorted.length - 1];

    // 代表地点の星
    const repEntries = targetRep?.climateData?.[metricKey];
    const repVal = repEntries && repEntries.length > 12 ? repEntries[12]?.value : repEntries?.[0]?.value;
    const repStar = repVal != null ? calculateStar(repVal, meta.star).star : minRes.star;

    const rangeText = `(${minRes.star}〜${maxRes.star})`;
    const label = minRes.star === maxRes.star ? minRes.label : `${minRes.label}〜${maxRes.label}`;

    return {
      meta,
      repStar,
      maxStars,
      rangeText,
      label,
      hasData: true,
    };
  });

  const repStationName =
    targetRep?.station?.station_name || targetRep?.station?.official_name || null;

  return {
    repStationName,
    items,
  };
}
