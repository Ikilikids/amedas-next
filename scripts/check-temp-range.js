const fs = require('fs');

const stationsMap = JSON.parse(fs.readFileSync('public/stations.json', 'utf8'));
const avtemp = JSON.parse(fs.readFileSync('public/ranking_not_null/av_avtemp.json', 'utf8'));
const areaTs = fs.readFileSync('src/setting/area.ts', 'utf8');

const areaNameMap = {};
const lines = areaTs.split('\n');
for (const line of lines) {
  const m = line.match(/"(\d{6})":\s*\{\s*key:\s*"\d{6}",\s*label:\s*"([^"]+)"/);
  if (m) {
    areaNameMap[m[1]] = m[2];
  }
}

const areaStats = {};
for (const s of Object.values(stationsMap)) {
  if (!s.area || !avtemp[s.id]) continue;
  const annual = avtemp[s.id][12];
  if (annual === undefined || annual === null) continue;

  if (!areaStats[s.area]) {
    areaStats[s.area] = {
      areaCode: s.area,
      areaName: areaNameMap[s.area] || s.area,
      pref: s.pref,
      temps: [],
      stations: []
    };
  }
  areaStats[s.area].temps.push(annual);
  areaStats[s.area].stations.push({
    name: s.station_name,
    temp: annual,
    id: s.id,
    city: s.city,
    height: s.height
  });
}

const list = Object.values(areaStats).map(a => {
  const min = Math.min(...a.temps);
  const max = Math.max(...a.temps);
  const diff = max - min;
  const minSt = a.stations.find(s => s.temp === min);
  const maxSt = a.stations.find(s => s.temp === max);
  return {
    ...a,
    min,
    max,
    diff: Math.round(diff * 10) / 10,
    count: a.temps.length,
    minSt: minSt ? `${minSt.name} (${minSt.temp}℃ / 標高${minSt.height}m / ${minSt.city})` : '',
    maxSt: maxSt ? `${maxSt.name} (${maxSt.temp}℃ / 標高${maxSt.height}m / ${maxSt.city})` : ''
  };
}).filter(a => a.count >= 2);

list.sort((a, b) => b.diff - a.diff);

console.log('=== TOP 15 AREAS BY ANNUAL MEAN TEMP RANGE ===\n');
list.slice(0, 15).forEach((item, idx) => {
  console.log(`${idx + 1}. 【${item.areaName}】(コード: ${item.areaCode} / 地点数: ${item.count})`);
  console.log(`   気温差: ${item.diff}℃`);
  console.log(`   最低: ${item.minSt}`);
  console.log(`   最高: ${item.maxSt}\n`);
});
