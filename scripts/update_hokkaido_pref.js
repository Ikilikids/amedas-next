import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stationsPath = path.join(__dirname, "../public/stations.json");
const data = JSON.parse(fs.readFileSync(stationsPath, "utf-8"));

// 振興局・エリア番号 -> 4区分(11, 14, 17, 23)
const areaToPref = {
  // 道北 (11)
  "011000": "11", // 宗谷
  "012010": "11", // 上川
  "012020": "11", // 留萌

  // 道東 (17)
  "013010": "17", // 網走
  "013020": "17", // 北見
  "013030": "17", // 紋別
  "014010": "17", // 根室
  "014020": "17", // 釧路
  "014030": "17", // 十勝

  // 道央 (14)
  "015010": "14", // 胆振
  "015020": "14", // 日高
  "016010": "14", // 石狩
  "016020": "14", // 空知
  "016030": "14", // 後志

  // 道南 (23)
  "017010": "23", // 渡島
  "017020": "23", // 檜山
};

let count = 0;
for (const [id, st] of Object.entries(data)) {
  if (st.area && areaToPref[st.area]) {
    const newPref = areaToPref[st.area];
    if (st.pref !== newPref) {
      st.pref = newPref;
      count++;
    }
  }
}

fs.writeFileSync(stationsPath, JSON.stringify(data, null, 2), "utf-8");
console.log(`Updated ${count} stations in stations.json`);
