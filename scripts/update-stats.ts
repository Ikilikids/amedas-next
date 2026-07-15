import fs from "fs";
import path from "path";
import { db } from "../src/utils/firebaseAdmin";

async function main() {
  console.log("Starting enhanced stats update (adding 4 new keys)...");

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

  const targetId = process.argv[2];
  let stationIds = Object.keys(csvMap);
  if (targetId) {
    console.log(`Targeting single station ID: ${targetId}`);
    stationIds = stationIds.filter((id) => id === targetId);
    if (stationIds.length === 0) {
      console.error(`Station ID ${targetId} not found in CSV.`);
      process.exit(1);
    }
  } else {
    console.log(`Targeting ALL ${stationIds.length} stations. (Run with 'npx tsx scripts/update-stats.ts <station_id>' to target a single station)`);
  }
  const newAllowedKeys = [
    "max_hitemp_date",
    "min_lwtemp_date",
    "rain_7d",
    "rain_15d",
  ];

  const batchSize = 100;
  let updateCount = 0;

  for (let i = 0; i < stationIds.length; i += batchSize) {
    const chunkIds = stationIds.slice(i, i + batchSize);
    const batch = db.batch();
    const refs = chunkIds.map((id) => db.collection("stations").doc(id));
    const snapshots = await db.getAll(...refs);

    chunkIds.forEach((id, index) => {
      const doc = snapshots[index];
      if (!doc.exists) return;

      const currentData = doc.data() as any;
      const currentStats = currentData.stats || {};
      const csvStats = csvMap[id];
      const updateData: Record<string, any> = {};

      Object.entries(csvStats).forEach(([key, value]) => {
        if (value === "--") return;

        // 条件:
        // A. 既存のキーである
        // B. 今回特別に許可された4つの新規キーのいずれかである
        const isExistingKey = key in currentStats;
        const isNewAllowedKey = newAllowedKeys.includes(key);

        if (isExistingKey || isNewAllowedKey) {
          // 日付系は文字列、それ以外は数値として処理
          if (key.endsWith("_date")) {
            updateData[`stats.${key}`] = value;
          } else {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              updateData[`stats.${key}`] = numValue;
            }
          }
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

  console.log(
    `\n\nSuccess! Updated ${updateCount} stations with enhanced metrics.`
  );
  process.exit(0);
}

main().catch(console.error);
