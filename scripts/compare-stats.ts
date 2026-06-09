import fs from 'fs';
import path from 'path';
import { db } from '../src/utils/firebaseAdmin'; // Firebase初期化済みのdbモジュールをインポート

async function main() {
  console.log("Starting comparison between CSV and Firestore...");

  // 1. CSVデータの読み込みとパース
  const csvPath = path.join(process.cwd(), 'download', 'all_station_stats.csv');
  const csvData = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
  const headers = csvData[0].split(',').map(h => h.trim());
  const stationKeys = headers.slice(1); // 'id' 以外のキー

  const csvMap: Record<string, Record<string, string>> = {};
  for (let i = 1; i < csvData.length; i++) {
    if (!csvData[i].trim()) continue;
    const values = csvData[i].split(',').map(v => v.trim());
    const id = values[0];
    const stats: Record<string, string> = {};
    for (let j = 1; j < headers.length; j++) {
      stats[headers[j]] = values[j];
    }
    csvMap[id] = stats;
  }

  const stationIds = Object.keys(csvMap);
  console.log(`Found ${stationIds.length} stations in CSV.`);

  // 比較結果を格納する配列
  const firebaseHasValueCsvIsHyphen: Array<{ id: string, key: string, fbValue: any }> = [];
  const csvHasValueFirebaseIsMissing: Array<{ id: string, key: string, csvValue: string }> = [];

  // バッチでFirestoreからデータを取得
  const batchSize = 100;
  for (let i = 0; i < stationIds.length; i += batchSize) {
    const chunkIds = stationIds.slice(i, i + batchSize);
    const refs = chunkIds.map(id => db.collection("stations").doc(id));
    const snapshots = await db.getAll(...refs);

    chunkIds.forEach((id, index) => {
      const doc = snapshots[index];
      const csvStats = csvMap[id];

      if (doc.exists) {
        const data = doc.data() as any;
        const fbStats = data.stats || {};

        // 比較ロジック
        stationKeys.forEach(key => {
          const csvVal = csvStats[key];
          const fbVal = fbStats[key];

          // 1. 本来firebaseにあったのに--だった地点とその項目
          if (fbVal !== undefined && fbVal !== null && csvVal === '--') {
            firebaseHasValueCsvIsHyphen.push({ id, key, fbValue: fbVal });
          }

          // 2. csvに値が入ってたけどfirebaseになかった地点と項目
          if (csvVal !== '--' && csvVal !== undefined && csvVal !== '' && (fbVal === undefined || fbVal === null)) {
            csvHasValueFirebaseIsMissing.push({ id, key, csvValue: csvVal });
          }
        });
      } else {
         // Firestoreに地点自体が存在しない場合の警告(今回はスキップするか、全項目を2に分類するか)
         // 指示通り「firebaseになかった地点と項目」として扱う
         stationKeys.forEach(key => {
            const csvVal = csvStats[key];
            if(csvVal !== '--' && csvVal !== undefined && csvVal !== '') {
               csvHasValueFirebaseIsMissing.push({ id, key, csvValue: csvVal });
            }
         });
      }
    });
    
    // 進捗表示
    process.stdout.write(`\rProcessed ${Math.min(i + batchSize, stationIds.length)} / ${stationIds.length} stations`);
  }

  console.log("\n\n--- Comparison Results ---");

  console.log("\n[1] Firebaseに値が存在するが、CSVでは '--' の地点と項目:");
  if (firebaseHasValueCsvIsHyphen.length === 0) {
    console.log("  -> 該当なし");
  } else {
    firebaseHasValueCsvIsHyphen.forEach(item => {
      console.log(`  Station ID: ${item.id}, Key: ${item.key}, Firebase Value: ${item.fbValue}`);
    });
  }

  console.log("\n[2] CSVに値が存在するが、Firebase(stats内)に存在しない地点と項目:");
  if (csvHasValueFirebaseIsMissing.length === 0) {
    console.log("  -> 該当なし");
  } else {
     // 出力が多い可能性があるので、集計して出力するか、生データで出すか。今回は生データ。
     // ただし、多すぎる場合は最初の50件などに制限する。
    const displayLimit = 50;
    csvHasValueFirebaseIsMissing.slice(0, displayLimit).forEach(item => {
      console.log(`  Station ID: ${item.id}, Key: ${item.key}, CSV Value: ${item.csvValue}`);
    });
    if (csvHasValueFirebaseIsMissing.length > displayLimit) {
        console.log(`  ... and ${csvHasValueFirebaseIsMissing.length - displayLimit} more missing items.`);
    }
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch(console.error);