# Amedas Next Project

全国のアメダス観測地点の気象データ（平年値、ランキング、詳細比較など）を視覚化・提供するNext.jsアプリケーションです。

---

## 🏗️ プロジェクト構成 (Directory Structure)

*   `src/`: アプリケーションのメインソースコード
    *   `pages/`: 画面およびAPIエンドポイント (Next.js Pages Router)
    *   `components/`: UIコンポーネント (大文字から始まる PascalCase で統一)
    *   `features/`: SSGなどのデータ読み込み用機能モジュール
    *   `utils/`: ユーティリティ関数・定数定義 (JSXを含まないものは `.ts` で統一)
*   `data/`: アプリで使用する静的データ
    *   `feature/`: 暑い地域、寒い地域などの気候的特徴ごとに分類された地点 JSON
    *   `similar/`: 各地点ごとの類似アメダス地点データ
*   `download/`: 気象庁 (JMA) データ取得スクリプトおよび取得データ
*   `scripts/`: データベース更新、検証、移行用の運用スクリプト
*   `public/`: 静的アセットおよび各地点のマスターデータ (`stations.json` など)

---

## 🔄 データ統合パイプライン (Data Integration Pipeline)

気候データやランキングデータは、SSG (Static Site Generation) とクライアントサイドの表示で一貫性を保つため、共通の処理フローを経由します（ルール規定: `GEMINI.md`）。

1.  **Ranker (`calculateStationMonthlyEntries`)**: 1つのメトリックに対して、Top/Bot/地域/都道府県ごとの順位を計算します。
2.  **Integrator (`integrateStationClimateData`)**: 指定された地点IDのすべてのメトリックデータを行き先ごとに統合します。
3.  **Assembler (`assembleDisplayData`)**: 統合したデータを `overview`, `table`, `ratio`, `uonzu` 構造にフォーマットして出力します。

---

## 🛠️ 運用手順 (Operation Guide)

気象庁 (JMA) の最新データを取り込んでデータベースを更新する手順は以下の通りです。

### 1. 気象データの取得 (スクレイピング)
気象庁ホームページから、日次の気象データを取得してローカルCSVに保存します。
```bash
# 全地点のデータをダウンロード (数分かかります)
node download/fetch_jma_data_csv.mjs

# 特定のステーションID (例: 40336) のみダウンロードする場合
node download/fetch_jma_data_csv.mjs 40336
```
※ 取得されたデータは `download/rawdata_csv/[station_id].csv` に保存されます。

### 2. 統計データの作成 (CSV集計)
ダウンロードした各地点の日次CSVを集計し、全体の統計CSVを生成します。
```bash
node download/generate_stats.mjs
```
※ `download/all_station_stats.csv` が出力されます。

### 3. データベース (Firestore) の更新
生成した統計CSVデータを読み込み、Firestore 内の `stations` コレクションを更新します。
（あらかじめ Firebase に必要な権限と `.env.local` などの環境変数が設定されている必要があります）
```bash
# 全地点の統計データを Firestore に反映する
npx tsx scripts/update-stats.ts

# 特定のステーションID (例: 40336) のみ反映する場合
npx tsx scripts/update-stats.ts 40336
```

### 4. データの不整合チェック
ローカルCSVと Firestore 側のデータにズレがないかを検証します。
```bash
npx tsx scripts/compare-stats.ts
```

---

## 🚀 開発とビルド

```bash
# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# アプリの起動
npm run start
```
