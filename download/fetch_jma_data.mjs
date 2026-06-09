import fs from 'fs';
import https from 'https';
import path from 'path';

const mappingPath = 'station_mapping.csv';
const outputDir = 'rawdata';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const mappingData = fs.readFileSync(mappingPath, 'utf-8');
const lines = mappingData.split(/\r?\n/).filter(line => line.trim() !== '' && !line.startsWith('id,'));

const stations = lines.map(line => {
  const [id, prec_no, block_no, type] = line.split(',');
  return { id, prec_no, block_no, type };
});

const CONCURRENCY = 5;
const year = 2026;
const month = 6;

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(data));
          res.on('error', reject);
        }).on('error', reject);
      });
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

function parseHtml(html, type) {
  const results = {};
  // Find table rows containing daily data
  // The rows look like <tr class="mtx" style="text-align:right;">...</tr>
  const rowRegex = /<tr class="mtx" style="text-align:right;">([\s\S]*?)<\/tr>/g;
  let match;
  
  const rainIdx = (type === 'A' || type === 'B') ? 4 : 2;
  const hiIdx = (type === 'A' || type === 'B') ? 8 : 6;
  const lowIdx = (type === 'A' || type === 'B') ? 9 : 7;

  while ((match = rowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    const cells = rowContent.split(/<\/td>/).map(cell => cell.replace(/<[^>]*>/g, '').trim());
    
    if (cells.length > 1) {
      const day = parseInt(cells[0]);
      if (!isNaN(day)) {
        results[day] = {
          sm_rain: cells[rainIdx - 1] || null,
          av_hitemp: cells[hiIdx - 1] || null,
          av_lwtemp: cells[lowIdx - 1] || null
        };
      }
    }
  }
  return results;
}

async function processStation(station) {
  const { id, prec_no, block_no, type } = station;
  const phpFile = (type === 'A' || type === 'B') ? 'daily_s1.php' : 'daily_a1.php';
  const url = `https://www.data.jma.go.jp/stats/etrn/view/${phpFile}?prec_no=${prec_no}&block_no=${block_no}&year=${year}&month=${month}&day=1&view=h0`;

  try {
    const html = await fetchWithRetry(url);
    const data = parseHtml(html, type);
    
    if (Object.keys(data).length === 0) {
      console.warn(`[${id}] No data found for ${station.id}`);
    } else {
      fs.writeFileSync(path.join(outputDir, `${id}.json`), JSON.stringify(data, null, 2));
      console.log(`[${id}] Saved ${Object.keys(data).length} days`);
    }
  } catch (e) {
    console.error(`[${id}] Error fetching ${url}: ${e.message}`);
  }
}

async function run() {
  const queue = [...stations];
  const active = [];

  while (queue.length > 0 || active.length > 0) {
    while (active.length < CONCURRENCY && queue.length > 0) {
      const station = queue.shift();
      const promise = processStation(station).then(() => {
        active.splice(active.indexOf(promise), 1);
      });
      active.push(promise);
    }
    if (active.length > 0) {
      await Promise.race(active);
    }
  }
  console.log('All stations processed.');
}

run();
