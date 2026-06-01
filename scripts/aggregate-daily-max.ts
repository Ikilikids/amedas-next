import fs from 'fs';
import path from 'path';
import { fetchJmaDailyMaxRanking } from '../src/utils/jma.js';

const now = new Date();
const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
const JSON_PATH = path.join(process.cwd(), `data/daily_data/${dateStr}.json`);

async function aggregate() {
  try {
    console.log(`Starting aggregation using shared JMA utility...`);

    // 共通ユーティリティを使用してデータを取得
    const rankings = await fetchJmaDailyMaxRanking();

    const dir = path.dirname(JSON_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(JSON_PATH, JSON.stringify({
      lastUpdate: new Date().toLocaleString("ja-JP"),
      data: rankings
    }, null, 2));

    console.log(`Successfully archived ${rankings.length} stations to ${JSON_PATH}.`);

  } catch (error) {
    console.error("Aggregation failed:", error);
    process.exit(1);
  }
}

aggregate();
