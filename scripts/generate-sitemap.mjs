import fs from "fs";
import path from "path";

// 設定
const BASE_URL = "https://amedas-next--amedas-ppp.asia-east1.hosted.app/"; // あなたのサイトのドメインに合わせて変更してください
const PUBLIC_DIR = path.join(process.cwd(), "public");
const STATIONS_JSON = path.join(PUBLIC_DIR, "stations.json");

// 静的なパスのリスト
const STATIC_PAGES = [
  "",
  "/clim_ranking",
  "/live/realtime",
  "/live/daily_ranking",
  "/map",
  "/search",
  "/about",
  "/privacy",
];

// 最近のランキングのタイプ
const RECENT_TYPES = ["heat", "cold", "rain"];

async function generateSitemap() {
  console.log("Generating sitemap...");

  const urls = [];

  // 1. 静的ページを追加
  STATIC_PAGES.forEach((page) => {
    urls.push({
      loc: `${BASE_URL}${page}`,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "daily",
      priority: page === "" ? "1.0" : "0.8",
    });
  });

  // 2. 最近のランキングページを追加
  RECENT_TYPES.forEach((type) => {
    urls.push({
      loc: `${BASE_URL}/live/recent_ranking/${type}`,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "hourly",
      priority: "0.7",
    });
  });

  // 3. 地点詳細ページを追加 (stations.json から取得)
  if (fs.existsSync(STATIONS_JSON)) {
    try {
      const stations = JSON.parse(fs.readFileSync(STATIONS_JSON, "utf8"));
      Object.keys(stations).forEach((id) => {
        urls.push({
          loc: `${BASE_URL}/station/${id}`,
          lastmod: new Date().toISOString().split("T")[0],
          changefreq: "weekly",
          priority: "0.5",
        });
      });
      console.log(`Added ${Object.keys(stations).length} station pages.`);
    } catch (e) {
      console.error("Error parsing stations.json:", e);
    }
  } else {
    console.warn("stations.json not found, skipping station pages.");
  }

  // 4. XMLを構築
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => {
    return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  // 5. 保存
  const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemapXml);

  console.log(`Sitemap generated successfully at ${sitemapPath}`);
}

generateSitemap();
