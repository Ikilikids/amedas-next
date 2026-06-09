import fs from "fs";
import path from "path";
import { db } from "../src/utils/firebaseAdmin";

async function main() {
  console.log("Starting stats update from CSV...");

  // 1. CSVデータの読み込み
  const csvPath = path.join(process.cwd(), "download", "all_station_stats.csv");
  const csvContent = fs.readFileSync(csvPath, "utf8").trim().split("\n");
  const headers = csvContent[0].split(",").map((h) => h.trim());

  const csvMap: Record<string, Record<string, string>> = {};
  for (let i = 1; i < csvContent.length; i++) {
    if (!csvContent[i].trim()) continue;
    const values = csvContent[i].split(",").map((v) => v.trim());
    const id = values[0];
    const stats: Record<string, string> = {};
    for (let j = 1; j < headers.length; j++) {
      stats[headers[j]] = values[j];
    }
    csvMap[id] = stats;
  }

  const stationIds = Object.keys(csvMap).filter((id) => id === "40336");
  console.log(`Found ${stationIds.length} stations in CSV.`);

  const batchSize = 100;
  let updateCount = 0;

  for (let i = 0; i < stationIds.length; i += batchSize) {
    const chunkIds = stationIds.slice(i, i + batchSize);
    const batch = db.batch();

    // Firestoreから現在のドキュメントを取得
    const refs = chunkIds.map((id) => db.collection("stations").doc(id));
    const snapshots = await db.getAll(...refs);

    chunkIds.forEach((id, index) => {
      const doc = snapshots[index];
      if (!doc.exists) return;

      const currentData = doc.data() as any;
      const currentStats = currentData.stats || {};
      const csvStats = csvMap[id];
      const updateData: Record<string, any> = {};

      // CSVの各項目について
      Object.entries(csvStats).forEach(([key, value]) => {
        // 1. -- は何もしない
        if (value === "--") return;

        // 2. Firebaseに元々存在しないキーは追加しない
        if (!(key in currentStats)) return;

        // 数値に変換してセット（気温などは小数、日数は整数だが一律数値化）
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          updateData[`stats.${key}`] = numValue;
        }
      });

      if (Object.keys(updateData).length > 0) {
        batch.update(refs[index], updateData);
        updateCount++;
      }
    });

    await batch.commit();
    process.stdout.write(
      `\rUpdated ${Math.min(i + batchSize, stationIds.length)} / ${
        stationIds.length
      } stations`
    );
  }

  console.log(`\n\nSuccess! Updated ${updateCount} stations.`);
  process.exit(0);
}

main().catch(console.error);
