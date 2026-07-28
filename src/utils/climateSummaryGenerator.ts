import { MonthlyEntry } from "../types/union";
import { RawOverviewData, RawTableData } from "../types/raw";

export interface ClimateBadge {
  label: string;
  colorClass: string;
}

export interface ClimateSummaryResult {
  badges: ClimateBadge[];
  tempSummary: string;
  rainSummary: string;
  rankingSummary: string | null;
  overviewSummary: string;
}

/**
 * 観測所の統合気候データ (table, overview) から気候的特徴・AIダイジェストを自動生成
 */
export function generateClimateSummary(
  stationName: string,
  table: RawTableData,
  overview: RawOverviewData
): ClimateSummaryResult {
  const badges: ClimateBadge[] = [];

  // 指標データの安全な取得関数 (index 12 が通年/年間値)
  const getAnnual = (key: string): MonthlyEntry | null => {
    return table[key] && table[key][12] ? table[key][12] : null;
  };

  const getMonthlyValues = (key: string): number[] => {
    return table[key] ? table[key].slice(0, 12).map((e) => e.value) : [];
  };

  const avTemp = getAnnual("av_avtemp")?.value ?? null;
  const hiTemp = getAnnual("av_hitemp")?.value ?? null;
  const lwTemp = getAnnual("av_lwtemp")?.value ?? null;
  const totalRain = getAnnual("sm_rain")?.value ?? null;
  const totalSun = getAnnual("sm_sun")?.value ?? null;
  const totalSnow = getAnnual("sm_snowing")?.value ?? null;
  const avWind = getAnnual("av_wind")?.value ?? null;
  const daysHot35 = getAnnual("hitemp_35")?.value ?? null;
  const daysIce0 = getAnnual("lwtemp_0")?.value ?? null;

  const tempMonthly = getMonthlyValues("av_avtemp");
  const rainMonthly = getMonthlyValues("sm_rain");

  // 年較差（最暖月 - 最寒月）
  let tempRange = 0;
  if (tempMonthly.length === 12) {
    const maxM = Math.max(...tempMonthly);
    const minM = Math.min(...tempMonthly);
    tempRange = maxM - minM;
  }

  // --- 1. バッジの判定 ---
  if (avTemp !== null && avTemp >= 20.0) {
    badges.push({ label: "🏝️ 南国・常夏気候", colorClass: "bg-amber-100 text-amber-800 border-amber-200" });
  } else if (avTemp !== null && avTemp < 8.0) {
    badges.push({ label: "❄️ 寒冷地域", colorClass: "bg-cyan-100 text-cyan-800 border-cyan-200" });
  }

  // 猛暑日・冬日の判定
  if (daysHot35 !== null && daysHot35 >= 10) {
    badges.push({ label: "🔥 猛暑多発地域", colorClass: "bg-red-100 text-red-800 border-red-200" });
  }
  if (daysIce0 !== null && daysIce0 >= 100) {
    badges.push({ label: "🧊 冬日多発", colorClass: "bg-blue-100 text-blue-900 border-blue-200" });
  }

  if (totalRain !== null && totalRain >= 2400) {
    badges.push({ label: "☔ 日本有数の多雨エリア", colorClass: "bg-blue-100 text-blue-800 border-blue-200" });
  } else if (totalRain !== null && totalRain <= 1200) {
    badges.push({ label: "☀️ 少雨・乾燥傾向", colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200" });
  }

  if (tempRange >= 23.0) {
    badges.push({ label: "🏔️ 寒暖差の激しい内陸性", colorClass: "bg-purple-100 text-purple-800 border-purple-200" });
  } else if (tempRange > 0 && tempRange <= 14.0) {
    badges.push({ label: "🌊 寒暖差の少ない海洋性", colorClass: "bg-teal-100 text-teal-800 border-teal-200" });
  }

  if (totalSnow !== null && totalSnow >= 200) {
    badges.push({ label: "☃️ 豪雪地帯", colorClass: "bg-sky-100 text-sky-800 border-sky-200" });
  }

  if (totalSun !== null && totalSun >= 2100) {
    badges.push({ label: "🌞 日照時間豊富", colorClass: "bg-orange-100 text-orange-800 border-orange-200" });
  }

  if (avWind !== null && avWind >= 4.5) {
    badges.push({ label: "🌬️ 風が強いエリア", colorClass: "bg-emerald-100 text-emerald-800 border-emerald-200" });
  }

  // 全国ランキング上位の探索
  const topRanks: { metricName: string; rank: number; value: number }[] = [];
  if (overview) {
    Object.entries(overview).forEach(([m, item]) => {
      if (item && item.rank && item.rank <= 30) {
        topRanks.push({ metricName: m, rank: item.rank, value: item.value });
      }
    });
  }

  if (topRanks.some((r) => r.rank <= 10)) {
    badges.push({ label: "🏆 全国トップクラス記録", colorClass: "bg-rose-100 text-rose-800 border-rose-200" });
  }

  // デフォルトバッジ
  if (badges.length === 0) {
    badges.push({ label: "🌤️ 穏やかな気候", colorClass: "bg-slate-100 text-slate-800 border-slate-200" });
  }

  // --- 2. 気温の解説文作成 ---
  let tempSummary = "";
  if (avTemp !== null) {
    tempSummary = `年間平均気温は ${avTemp.toFixed(1)}℃。`;
    if (hiTemp !== null && lwTemp !== null) {
      tempSummary += ` 平均最高気温は ${hiTemp.toFixed(1)}℃、平均最低気温は ${lwTemp.toFixed(1)}℃ となります。`;
    }
    if (daysHot35 !== null && daysHot35 > 0) {
      tempSummary += ` 猛暑日（最高35℃以上）は年間平均 ${daysHot35.toFixed(1)} 日観測されます。`;
    }
    if (daysIce0 !== null && daysIce0 > 0) {
      tempSummary += ` 最低気温が0℃未満となる「冬日」は年間平均 ${daysIce0.toFixed(1)} 日あります。`;
    }
    if (tempRange >= 23) {
      tempSummary += ` 夏と冬の気温差（年較差: 約${tempRange.toFixed(1)}℃）が非常に大きく、典型的な内陸・盆地型の気候特性を示しています。`;
    } else if (tempRange <= 14) {
      tempSummary += ` 年間を通じた気温の変動幅（年較差: 約${tempRange.toFixed(1)}℃）が小さく、周囲の海洋の影響を受けた安定した気候です。`;
    }
  } else {
    tempSummary = "気温データは集計中です。";
  }

  // --- 3. 降水・雨温・風の特徴文作成 ---
  let rainSummary = "";
  if (totalRain !== null) {
    rainSummary = `年間総降水量は約 ${Math.round(totalRain).toLocaleString()} mm。`;
    if (rainMonthly.length === 12) {
      const maxRainVal = Math.max(...rainMonthly);
      const maxRainMonth = rainMonthly.indexOf(maxRainVal) + 1;
      rainSummary += ` 一年の中で最も雨が多いのは ${maxRainMonth} 月（約 ${Math.round(maxRainVal)} mm）です。`;
    }
    if (totalSnow !== null && totalSnow > 50) {
      rainSummary += ` また、冬季の累計降雪量は約 ${Math.round(totalSnow)} cm に達します。`;
    }
    if (totalSun !== null) {
      rainSummary += ` 年間日照時間は約 ${Math.round(totalSun).toLocaleString()} 時間です。`;
    }
    if (avWind !== null) {
      rainSummary += ` 年間平均風速は ${avWind.toFixed(1)} m/s です。`;
    }
  } else {
    rainSummary = "降水データは集計中です。";
  }

  // --- 4. ランキング特徴文 ---
  let rankingSummary: string | null = null;
  if (topRanks.length > 0) {
    topRanks.sort((a, b) => a.rank - b.rank);
    rankingSummary = `全国ランキングでは年間データで上位にランクインしており、全国的に見ても気候上の明確な個性が目立つ観測所です。`;
  }

  // --- 5. 総合AIダイジェストの構成 ---
  let overviewSummary = `${stationName}の平年値データによると、`;
  if (avTemp !== null && avTemp >= 18) {
    overviewSummary += `年間を通じて温和〜温暖な気候が広がっています。`;
  } else if (avTemp !== null && avTemp <= 10) {
    overviewSummary += `年間を通じて清涼かつ寒冷な気候が特徴です。`;
  } else {
    overviewSummary += `四季の変化がはっきりと感じられる気候バランスを持っています。`;
  }

  if (totalRain !== null && totalRain >= 2200) {
    overviewSummary += ` 湿潤な気流の影響を受けやすく、年間を通して恵みの雨が多く降る地域です。`;
  } else if (totalRain !== null && totalRain <= 1300) {
    overviewSummary += ` 比較的降水量が落ち着いており、晴天率に恵まれたエリアです。`;
  }

  return {
    badges,
    tempSummary,
    rainSummary,
    rankingSummary,
    overviewSummary,
  };
}
