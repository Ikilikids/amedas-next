import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.join(process.cwd(), 'public/stations.json');
const LIGHT_MASTER = path.join(process.cwd(), 'public/amedas_light2.json');
const LATLON_MASTER = path.join(process.cwd(), 'public/station_latlon.json');
const SINGLE_DIR = path.join(process.cwd(), 'data/single');

async function generateMaster() {
  try {
    console.log('Generating stations master data...');
    
    // 1. 各ファイルの読み込み
    const lightData = JSON.parse(fs.readFileSync(LIGHT_MASTER, 'utf8'));
    const latLonData = JSON.parse(fs.readFileSync(LATLON_MASTER, 'utf8'));
    
    const stations = {};
    
    // 2. 統合 (amedas_light2 をベースにする)
    for (const id in lightData) {
      const latLon = latLonData[id] || {};
      
      // 基本データ
      stations[id] = {
        id: id,
        prefCode: id.substring(0, 2),
        name: lightData[id]?.観測所名 || "",
        rank: lightData[id]?.rank ?? null,
        lat: latLon.緯度 ?? null,
        lon: latLon.経度 ?? null,
        // 後で詳細データから補完
        official_name: "",
        city: ""
      };

      // data/single があれば詳細情報を補完 (存在しなければスキップ)
      const singlePath = path.join(SINGLE_DIR, `${id}.json`);
      if (fs.existsSync(singlePath)) {
        const singleData = JSON.parse(fs.readFileSync(singlePath, 'utf8'));
        stations[id].official_name = singleData.official_name || "";
        stations[id].city = singleData.city || "";
      }
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stations, null, 2));
    console.log(`Successfully generated master data in ${OUTPUT_PATH}`);

  } catch (error) {
    console.error('Failed to generate master data:', error);
    process.exit(1);
  }
}

generateMaster();
