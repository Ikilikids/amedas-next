import { db } from '../src/utils/firebaseAdmin';

async function main() {
  const targetId = "40336";
  console.log(`Updating rankings for target station: ${targetId} (Surgical update to save reads)`);

  const rankingMetrics = [
    { key: "max_hitemp", hasDate: true },
    { key: "min_lwtemp", hasDate: true },
    { key: "hitemp_40", hasDate: false },
    { key: "hitemp_35", hasDate: false },
    { key: "hitemp_30", hasDate: false },
    { key: "hitemp_25", hasDate: false },
    { key: "hitemp_0", hasDate: false },
    { key: "lwtemp_25", hasDate: false },
    { key: "lwtemp_0", hasDate: false },
    { key: "rain_7d", hasDate: false },
    { key: "rain_15d", hasDate: false },
    { key: "sm_rain", hasDate: false },
  ];

  console.log(`Fetching stats for station ${targetId}...`);
  const stationDoc = await db.collection("stations").doc(targetId).get();
  if (!stationDoc.exists) {
    console.error("Station not found.");
    process.exit(1);
  }

  const stats = stationDoc.data()?.stats || {};
  const updatedAt = new Date().toISOString();

  for (const metric of rankingMetrics) {
    const val = stats[metric.key];
    if (val === undefined || val === null) continue;

    const entry = {
      id: targetId,
      val: val,
      ...(metric.hasDate && stats[metric.key + "_date"] ? { d: stats[metric.key + "_date"] } : {}),
    };

    // 既存のランキングドキュメントを取得してマージ
    const rankingRef = db.collection("rankings").doc(metric.key);
    const rankingDoc = await rankingRef.get();
    
    let newList = [];
    if (rankingDoc.exists) {
      const currentData = rankingDoc.data() as { list: any[] };
      // 既存リストから自分を除去して新しいデータを追加
      newList = (currentData.list || []).filter(item => item.id !== targetId);
    }
    newList.push(entry);

    await rankingRef.set({
      updatedAt,
      list: newList,
    });
    console.log(`Updated ranking: ${metric.key} (Added/Updated ${targetId})`);
  }

  console.log("\nSurgical ranking update completed.");
  process.exit(0);
}

main().catch(console.error);