import fs from 'fs';
import path from 'path';

const metrics = [
  "av_avtemp", "av_hitemp", "av_lwtemp", "sm_sun", "sm_rain", "sm_snowing", "av_wind",
  "hitemp_25", "hitemp_30", "hitemp_35", "lwtemp_0", "hitemp_0", "lwtemp_25",
  "rain_1", "rain_10", "rain_30", "rain_50", "rain_70", "rain_100",
  "snowed_5", "snowed_10", "snowed_20", "snowed_50", "snowed_100",
  "snowing_3", "snowing_5", "snowing_10", "snowing_20", "snowing_50",
  "wind_10", "wind_15", "wind_20", "wind_30",
  "max_snowed", "max_hitemp", "min_lwtemp"
];

const srcDir = path.join(process.cwd(), '_ranking_source');
const distDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

console.log(`Aggregating ALL ranking data into ${distDir}...`);

metrics.forEach(metric => {
  const result = {};
  const metricSrcDir = path.join(srcDir, metric);
  
  if (!fs.existsSync(metricSrcDir)) {
    console.warn(`Warning: Directory not found: ${metricSrcDir}`);
    return;
  }

  // Walk through all files in the metric directory (pre, region, top, island, meteo)
  walkDir(metricSrcDir, (filePath) => {
    const fileName = path.basename(filePath);
    let monthIdx = -1;

    if (fileName === 'all.json') {
      monthIdx = 12;
    } else {
      const match = fileName.match(/^(\d+)\.json$/);
      if (match) {
        monthIdx = parseInt(match[1]) - 1;
      }
    }

    if (monthIdx === -1) return;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content || content.trim() === '') return;
      
      const data = JSON.parse(content);
      Object.entries(data).forEach(([id, entry]) => {
        if (!result[id]) {
          result[id] = new Array(13).fill(null);
        }
        const val = typeof entry === 'object' && entry !== null ? entry.value : entry;
        if (typeof val === 'number') {
          // Only update if null or if we want to ensure we have data.
          // In case of multiple files (top and pre), the value should be the same.
          result[id][monthIdx] = val;
        }
      });
    } catch (e) {
      console.error(`Error processing ${filePath}:`, e);
    }
  });

  if (Object.keys(result).length > 0) {
    const distPath = path.join(distDir, `rank2_${metric}.json`);
    fs.writeFileSync(distPath, JSON.stringify(result));
    console.log(`Generated: rank2_${metric}.json (${Object.keys(result).length} stations)`);
  }
});

console.log('Aggregation complete.');
