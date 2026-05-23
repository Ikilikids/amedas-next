import fs from 'fs';
import path from 'path';

// 設定
const JSON_PATH = path.join(process.cwd(), `data/ranking/daily_max.json`);
const CSV_URL = "https://www.data.jma.go.jp/stats/data/mdrr/tem_rct/alltable/mxtemsadext00_rct.csv";

async function aggregate() {
  try {
    console.log(`Starting aggregation using JMA CSV data...`);

    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error("JMA CSV data not found.");
    
    const buffer = await res.arrayBuffer();
    const decoder = new TextDecoder('shift-jis');
    const csvText = decoder.decode(buffer);

    const lines = csvText.split('\n');
    const rankings = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('観測')) continue;
      
      const cols = line.split(',');
      if (cols.length < 10) continue;

      const stationID = cols[0];
      const rawName = cols[2];
      const maxTemp = parseFloat(cols[9]);

      if (!isNaN(maxTemp) && stationID.match(/^\d+$/)) {
        rankings.push({
          id: stationID,
          value: maxTemp,
        });
      }
    }

    rankings.sort((a, b) => b.value - a.value);

    const dir = path.dirname(JSON_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(JSON_PATH, JSON.stringify({
      lastUpdate: new Date().toLocaleString("ja-JP"),
      data: rankings
    }, null, 2));

    console.log(`Successfully updated ${rankings.length} stations.`);

  } catch (error) {
    console.error("Aggregation failed:", error);
    process.exit(1);
  }
}

aggregate();
