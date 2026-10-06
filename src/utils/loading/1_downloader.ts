import {
    RawData,
    RawStationData,
} from "../../types/raw";
import { MonthlyEntry, StationId } from "../../types/union";
import { AssembleKey, AssembleTarget, RankDepth } from "../../setting/assemble";
import { MetricValue } from "../../setting/metric";
import { loadJsonSingleMetric } from "./2_loadSingleMetric";
import { calculateRankingEntries } from "./3_calculateRanking";


/**
 * 地点別オプション設定を受け取り、表示用データを返す
 *
 * @param targetConfig - 地点IDごとの表示ターゲット設定
 * ```ts
 * {
 *   '44132': ["uonzu", "overview"],
 *   '14163': ["table"],
 *   '91197': [] // 空配列の場合はマスタ情報のみ
 * }
 * ```
 *
 * @returns 地点IDごとの画面用データ (`RawData`)
 * ```ts
 * {
 *   '44132': {
 *     station: { id: "44132", station_name: "東京", pref: "44", ... },
 *     climateData: {
 *       temp_ave: [{ value: 5.4, top: 480, bot: 320, ... }, ...], // 13ヶ月または通年
 *       precip_sum: [...]
 *     }
 *   },
 *   '14163': {
 *     station: { id: "14163", station_name: "札幌", ... },
 *     climateData: { ... }
 *   }
 * }
 * ```
 */
export async function climateDownload(
    targetConfig: Record<StationId, AssembleTarget[]>,
    master: Record<StationId, RawStationData>,
    fields?: (keyof RawStationData)[]
): Promise<Record<StationId, RawData>> {
    const result: Record<StationId, RawData> = {};

    for (const [id, options] of Object.entries(targetConfig)) {
        const station = master[id];
        if (!station) continue;

        // options が空配列の場合はマスタ（基本情報）のみ即返却（気象計算・JSON読み込みを全スキップ）
        if (!options || options.length === 0) {
            result[id] = { station };
            continue;
        }

        // 1. 各メトリックについて、要求されている target から必要な要件（rankDepth, isAnnualOnly）を集約
        const metricReqs = getMetricRequirements(options);

        // 2. メトリックごとにロードして順位計算（計算済みキャッシュを活用）
        const rawMonthlyData: Record<string, MonthlyEntry[]> = {};
        for (const m of metricReqs.keys()) {
            const rawData = await loadJsonSingleMetric(m);
            const integrated = rawData ? calculateRankingEntries(rawData, master, `climate_${m}`) : null;
            const entries = integrated?.[id as StationId];
            if (entries) {
                rawMonthlyData[m] = entries;
            }
        }

        // 3. 要件に基づいてデータをカット
        const climateData = cutMonthlyData(rawMonthlyData, metricReqs);

        result[id] = {
            station,
            ...(Object.keys(climateData).length > 0 ? { climateData } : {}),
        };
    }

    // 最後に fields が指定されている場合のみ、各地点の station データを削る
    if (fields) {
        for (const id of Object.keys(result)) {
            const currentStation = result[id].station;
            result[id].station = Object.fromEntries(
                (Object.keys(currentStation) as (keyof RawStationData)[])
                    .filter((key) => fields.includes(key))
                    .map((key) => [key, currentStation[key]])
            ) as RawStationData;
        }
    }

    return result;
}

type MetricRequirement = {
    rankDepth: RankDepth;
    isAnnualOnly: boolean;
};

const DEPTH_PRIORITY: Record<RankDepth, number> = {
    full: 3,
    topBot: 2,
    none: 1,
};

/**
 * 要求されている AssembleTarget 一覧から、必要なメトリックとその要件（rankDepth, isAnnualOnly）を集約する
 *
 * @param targets - 表示したいターゲット配列 `["uonzu", "overview"]`
 *
 * @returns メトリックごとの要件 Map
 * ```ts
 * Map(2) {
 *   'temp_ave' => { rankDepth: 'full', isAnnualOnly: false },
 *   'precip_sum' => { rankDepth: 'topBot', isAnnualOnly: true }
 * }
 * ```
 */
function getMetricRequirements(
    targets: AssembleTarget[]
): Map<MetricValue, MetricRequirement> {
    const metricReqs = new Map<MetricValue, MetricRequirement>();

    for (const target of targets) {
        const meta = AssembleKey[target];
        if (!meta) continue;

        for (const m of meta.getMetrics()) {
            const current = metricReqs.get(m);
            if (!current) {
                metricReqs.set(m, {
                    rankDepth: meta.rankDepth,
                    isAnnualOnly: meta.isAnnualOnly,
                });
            } else {
                // 優先度マージ: full > topBot > none
                const mergedDepth =
                    DEPTH_PRIORITY[meta.rankDepth] > DEPTH_PRIORITY[current.rankDepth]
                        ? meta.rankDepth
                        : current.rankDepth;
                // 月範囲マージ: 1つでも全月要求(false)があれば false (12か月+通年)
                const mergedAnnualOnly = current.isAnnualOnly && meta.isAnnualOnly;

                metricReqs.set(m, {
                    rankDepth: mergedDepth,
                    isAnnualOnly: mergedAnnualOnly,
                });
            }
        }
    }

    return metricReqs;
}

/**
 * 月範囲（通年のみ or 12か月+通年）および rankDepth に応じてプロパティを精選・カットする
 *
 * @param rawMonthlyData - メトリックごとの13ヶ月フルデータ
 * ```ts
 * {
 *   temp_ave: [{ value: 5.4, top: 480, bot: 320, pre: 12, ... }, ...13ヶ月分]
 * }
 * ```
 * @param metricReqs - 各メトリックの要件（`getMetricRequirements` の戻り値）
 * ```ts
 * Map(2) {
 *   'temp_ave' => { rankDepth: 'full', isAnnualOnly: false },
 *   'precip_sum' => { rankDepth: 'topBot', isAnnualOnly: true }
 * }
 * ```
 *
 * @returns カット後のメトリック別データ
 * ```ts
 * {
 *   // isAnnualOnly: true, rankDepth: 'topBot' の場合（1件かつtop/botのみ）
 *   temp_ave: [{ value: 15.8, top: 210, bot: 590, island: 190 }]
 * }
 * ```
 */
function cutMonthlyData(
    rawMonthlyData: Record<string, MonthlyEntry[]>,
    metricReqs: Map<MetricValue, MetricRequirement>
): Record<string, MonthlyEntry[]> {
    const trimmedData: Record<string, MonthlyEntry[]> = {};

    for (const [m, req] of metricReqs.entries()) {
        const entries = rawMonthlyData[m];
        if (!entries) continue;

        // 月範囲のカット (通年のみの場合は entries[12] を保持)
        const targetEntries = req.isAnnualOnly
            ? entries.length > 12 ? [entries[12]] : [entries[0]]
            : entries;

        // フィールドのカット (rankDepth に応じてプロパティを精選)
        trimmedData[m] = targetEntries.map((e) => {
            if (req.rankDepth === "none") {
                return { value: e.value };
            }
            if (req.rankDepth === "topBot") {
                return {
                    value: e.value,
                    top: e.top,
                    bot: e.bot,
                    island: e.island,
                };
            }
            // full: 全フィールド保持
            return { ...e };
        });
    }

    return trimmedData;
}

