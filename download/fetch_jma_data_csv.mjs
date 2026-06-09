import fs from "fs";
import https from "https";
import path from "path";

const mappingPath = "station_mapping.csv";
const outputDir = "rawdata_csv";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const mappingData = fs.readFileSync(mappingPath, "utf-8");
const lines = mappingData
  .split(/\r?\n/)
  .filter((line) => line.trim() !== "" && !line.startsWith("id,"));

const stations = lines
  .map((line) => {
    const [id, prec_no, block_no, type] = line.split(",");
    return { id, prec_no, block_no, type };
  })
  .filter((station) => station.id === "40336");

const CONCURRENCY = 10; // Increased slightly for multiple months
const year = 2026;
// Months to fetch: Jan to June
const months = [1, 2, 3, 4, 5, 6];

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        https
          .get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(data));
            res.on("error", reject);
          })
          .on("error", reject);
      });
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

function cleanValue(val) {
  if (!val) return "";
  // Remove brackets, parentheses, and whitespace
  return val.replace(/[\[\]\(\)\s]/g, "");
}

function parseHtml(html, type, month, lastDay) {
  const rows = [];
  const rowRegex =
    /<tr class="mtx" style="text-align:right;">([\s\S]*?)<\/tr>/g;
  let match;

  const rainIdx = type === "A" || type === "B" ? 4 : 2;
  const hiIdx = type === "A" || type === "B" ? 8 : 6;
  const lowIdx = type === "A" || type === "B" ? 9 : 7;

  while ((match = rowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    const cells = rowContent
      .split(/<\/td>/)
      .map((cell) => cell.replace(/<[^>]*>/g, "").trim());

    if (cells.length > 1) {
      const day = parseInt(cells[0]);
      if (!isNaN(day)) {
        // Only include up to June 8th
        if (month === 6 && day > lastDay) continue;

        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        rows.push(
          `${dateStr},${cleanValue(cells[rainIdx - 1])},${cleanValue(
            cells[hiIdx - 1]
          )},${cleanValue(cells[lowIdx - 1])}`
        );
      }
    }
  }
  return rows;
}

async function processStation(station) {
  const { id, prec_no, block_no, type } = station;
  const phpFile =
    type === "A" || type === "B" ? "daily_s1.php" : "daily_a1.php";

  let allRows = ["date,sm_rain,av_hitemp,av_lwtemp"];

  for (const month of months) {
    const lastDay = month === 6 ? 8 : 31; // We only need up to June 8
    const url = `https://www.data.jma.go.jp/stats/etrn/view/${phpFile}?prec_no=${prec_no}&block_no=${block_no}&year=${year}&month=${month}&day=1&view=h0`;

    try {
      const html = await fetchWithRetry(url);
      const monthRows = parseHtml(html, type, month, lastDay);
      allRows = allRows.concat(monthRows);
    } catch (e) {
      console.error(`[${id}] Error month ${month}: ${e.message}`);
    }
  }

  if (allRows.length > 1) {
    fs.writeFileSync(path.join(outputDir, `${id}.csv`), allRows.join("\n"));
    console.log(`[${id}] Saved ${allRows.length - 1} days`);
  } else {
    console.warn(`[${id}] No data found`);
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
  console.log("All stations processed.");
}

run();
