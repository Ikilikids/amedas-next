import fs from "fs";
import path from "path";

// 対象メトリック
const METRICS = [
  "av_avtemp",
  "sm_rain",
  "sm_sun",
  "sm_snowing",
  "av_wind",
  "hitemp_35",
];

// 外れ値の個別調整（指定がなければ最小値/最大値を使用）
// 例: 平均気温は富士山(-5.9℃)などの特異値を除くため min: 4.0 に切り上げ
const METRIC_OVERRIDES: Record<string, { min?: number; max?: number }> = {
  av_avtemp: { min: 4.0, max: 25 },
  sm_sun: { min: 1100, max: 2400 },
  sm_rain: { min: 700, max: 4000 },
  sm_snowing: { min: 0, max: 1400 },
  av_wind: { min: 0, max: 7 },
  hitemp_35: { min: 0, max: 20 },
};

const BINS_COUNT = 24;

interface DistributionResult {
  min: number;
  max: number;
  binWidth: number;
  bins: number[];
  totalCount: number;
}

const rankingDir = path.resolve(process.cwd(), "public/ranking_not_null");
const outputPath = path.resolve(process.cwd(), "src/data/metricDistributions.json");

const results: Record<string, DistributionResult> = {};

for (const metric of METRICS) {
  const filePath = path.join(rankingDir, `${metric}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const values: number[] = [];

  for (const stationId of Object.keys(raw)) {
    const item = raw[stationId];
    let val: number | null = null;
    if (Array.isArray(item)) {
      // 0〜11月 + 12が年間値
      val = item[12] ?? item[item.length - 1];
    } else if (item && typeof item === "object") {
      val = item?.[12]?.value ?? item?.["12"]?.value ?? item?.value;
    } else if (typeof item === "number") {
      val = item;
    }

    if (val != null && typeof val === "number" && !isNaN(val)) {
      values.push(val);
    }
  }

  if (values.length === 0) {
    console.warn(`No valid values for ${metric}`);
    continue;
  }

  values.sort((a, b) => a - b);

  const rawMin = values[0];
  const rawMax = values[values.length - 1];

  // オーバーライド設定があれば適用
  const override = METRIC_OVERRIDES[metric];
  const min = override?.min != null ? override.min : rawMin;
  const max = override?.max != null ? override.max : rawMax;

  const binWidth = Number(((max - min) / BINS_COUNT).toFixed(2));

  // 24ビンのカウント配列
  const binCounts = new Array(BINS_COUNT).fill(0);

  for (const v of values) {
    if (v < min) {
      // 下限未満（例: 富士山）は最初のビンにカウント、または除外
      binCounts[0]++;
      continue;
    }
    if (v >= max) {
      binCounts[BINS_COUNT - 1]++;
      continue;
    }
    const idx = Math.floor((v - min) / binWidth);
    const safeIdx = Math.max(0, Math.min(BINS_COUNT - 1, idx));
    binCounts[safeIdx]++;
  }

  // 最大度数を 100 に正規化（平方根スケール: sqrt(count) / sqrt(maxCount) * 100）
  // 線形だと少数が0に潰れ、logだと平坦になりすぎるため、中間のsqrtで自然な山と裾野を両立
  const maxCount = Math.max(...binCounts);
  const sqrtMax = Math.sqrt(maxCount);
  const normalizedBins = binCounts.map((c) => {
    if (c === 0) return 0;
    const ratio = Math.sqrt(c) / sqrtMax;
    // 1地点でも存在する場合は最低でも4%以上のバーを確保
    return Math.max(4, Math.round(ratio * 100));
  });

  results[metric] = {
    min: Number(min.toFixed(1)),
    max: Number(max.toFixed(1)),
    binWidth,
    bins: normalizedBins,
    totalCount: values.length,
  };
}

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
console.log("Successfully generated metric distributions!");
