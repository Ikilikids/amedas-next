import fs from 'fs/promises';
import path from 'path';

const srcDir = 'data/single';
const distBase = 'public/infotable';
const metricFile = 'src/utils/metric.tsx';

async function getMetricInfo() {
  const content = await fs.readFile(metricFile, 'utf8');
  
  // MetricKeyの定義を抽出
  const keyMatch = content.match(/export const MetricKey = \{([\s\S]*?)\} as const;/);
  const keys = keyMatch[1].split(',').map(s => s.trim().split(':')[0]).filter(Boolean);
  
  // metricsオブジェクトからタブ情報を抽出
  // 簡易的に [MetricKey.XXX]: { ... tab: MetricTab.YYY } を解析
  const tableKeys = [];
  const ratioMap = {
    TempRatioData: [],
    Rain: [],
    Wind: [],
    Snowing: [],
    Snowed: []
  };

  keys.forEach(key => {
    const lowerKey = key.toLowerCase();
    const regex = new RegExp(`\\[MetricKey\\.${key}\\]: \\{[\\s\\S]*?tab: MetricTab\\.(Main|Avg|TempDays|RainDays|WindDays|SnowDays|SnowDepthDays)`);
    const match = content.match(regex);
    if (!match) return;

    const tab = match[1];
    if (tab === 'Main' || tab === 'Avg') {
      tableKeys.push(lowerKey);
    } else {
      // ratioの中身はフラットに書き出すが、判定用に保持
      // 今回は「table以外」というルールで抽出
    }
  });

  return { tableKeys };
}

async function processFile(file, { tableKeys }) {
  const filePath = path.join(srcDir, file);
  const rawData = await fs.readFile(filePath, 'utf8');
  const json = JSON.parse(rawData);
  const stationData = json.data || {};

  const hasNull = (obj) => {
    if (obj === null) return true;
    if (typeof obj !== 'object') return false;
    if (Array.isArray(obj)) return obj.some(hasNull);
    return Object.values(obj).some(hasNull);
  };

  const flattenEntry = (entry) => {
    if (!entry) return null;
    const { rank, ...rest } = entry;
    return { ...rest, ...rank };
  };

  const processCategory = (categoryData) => {
    const result = {};
    for (const [key, monthlyData] of Object.entries(categoryData)) {
      const flattenedList = [];
      const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'all'];
      months.forEach(month => {
        if (monthlyData[month]) {
          const flattened = flattenEntry(monthlyData[month]);
          if (flattened) flattenedList.push(flattened);
        }
      });
      result[key] = flattenedList;
    }
    return result;
  };

  // 1. table
  const tableRaw = {};
  tableKeys.forEach(key => {
    if (stationData[key] && !hasNull(stationData[key])) tableRaw[key] = stationData[key];
  });
  const tableData = processCategory(tableRaw);

  // 2. ratio (Everything else in stationData that isn't in table)
  const ratioRaw = {};
  Object.keys(stationData).forEach(key => {
    if (!tableKeys.includes(key) && stationData[key] && !hasNull(stationData[key])) {
      ratioRaw[key] = stationData[key];
    }
  });
  const ratioData = processCategory(ratioRaw);

  // 3. similar
  const transformSimilar = (obj) => {
    if (!obj) return [];
    return Object.entries(obj)
      .map(([id, val]) => ({ id, similar: val.similar }))
      .sort((a, b) => b.similar - a.similar);
  };

  const similarData = {
    similar_all: transformSimilar(json.similar_all),
    similar_meteo: transformSimilar(json.similar_meteo)
  };

  // 4. uonzu
  const uonzuPath = path.join(distBase, 'uonzu', file);
  let uonzuAction = Promise.resolve();
  try {
    const uonzuRaw = await fs.readFile(uonzuPath, 'utf8');
    const uonzuJson = JSON.parse(uonzuRaw);
    const cleanedUonzu = {};
    Object.keys(uonzuJson).forEach(key => {
      if (!hasNull(uonzuJson[key])) cleanedUonzu[key] = uonzuJson[key];
    });
    uonzuAction = fs.writeFile(uonzuPath, JSON.stringify(cleanedUonzu));
  } catch (e) {}

  await Promise.all([
    fs.writeFile(path.join(distBase, 'table', file), JSON.stringify(tableData)),
    fs.writeFile(path.join(distBase, 'ratio', file), JSON.stringify(ratioData)),
    fs.writeFile(path.join(distBase, 'similar', file), JSON.stringify(similarData)),
    uonzuAction
  ]);
}

async function run() {
  const metricInfo = await getMetricInfo();
  const dirs = ['table', 'ratio', 'similar', 'uonzu'];
  await Promise.all(dirs.map(dir => fs.mkdir(path.join(distBase, dir), { recursive: true })));

  const files = (await fs.readdir(srcDir)).filter(f => f.endsWith('.json'));
  console.time('FastProcess');
  const batchSize = 100;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(batch.map(file => processFile(file, metricInfo)));
  }
  console.timeEnd('FastProcess');
}

run().catch(console.error);
