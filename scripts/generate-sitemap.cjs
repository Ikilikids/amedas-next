// scripts/generate-sitemap.js
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://amedas-ppp.web.app";

// --------------------------
// 1. station ページ
// --------------------------
const stationDir = path.join(process.cwd(), "public/single");
const stationFiles = fs.existsSync(stationDir)
  ? fs.readdirSync(stationDir)
  : [];
const stationUrls = stationFiles
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""))
  .map((id) => `${BASE_URL}/station/${id}`);

// --------------------------
// 2. static ページ
// --------------------------
const staticPages = ["", "about", "contact", "map", "prefecture"];
const staticUrls = staticPages.map((p) => `${BASE_URL}/${p}`);

// --------------------------
// 3. ranking ページ（固定組み合わせのみ）
// --------------------------
const types = [
  "av_avtemp",
  "av_hitemp",
  "sm_sun",
  "sm_rain",
  "sm_snow",
  "hitemp_35",
  "hitemp_30",
  "lwtemp_25",
];

const extraPaths = [
  { rank: "top", detail: "default" },
  { rank: "pre", detail: "44" },
  { rank: "pre", detail: "62" },
  { rank: "region", detail: "hokkaido" },
  { rank: "region", detail: "tohoku" },
  { rank: "region", detail: "kanto" },
  { rank: "region", detail: "hokuriku" },
  { rank: "region", detail: "chubu" },
  { rank: "region", detail: "kinki" },
  { rank: "region", detail: "chugoku" },
  { rank: "region", detail: "shikoku" },
  { rank: "region", detail: "kyushu" },
];

const rankingUrls = [];
types.forEach((type) => {
  extraPaths.forEach(({ rank, detail }) => {
    rankingUrls.push(`${BASE_URL}/ranking/${type}/${rank}/${detail}/all`);
  });
});

// --------------------------
// 4. sitemap.xml 作成
// --------------------------
const allUrls = [...staticUrls, ...stationUrls, ...rankingUrls];
const urlsXml = allUrls.map((url) => `<url><loc>${url}</loc></url>`).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), sitemap);

console.log(`sitemap.xml generated! total ${allUrls.length} urls.`);
