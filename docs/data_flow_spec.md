# アメダス図鑑 ページ別データ連携・SSG設計書

本ドキュメントは、アメダス図鑑（Next.js SSG）における各ページのデータ要件、ビルド時（SSG）とブラウザ実行時（Client）の役割分担、および使用する関数を定義した仕様書です。

---

## 1. コア関数の役割一覧

| 関数名 | 実行環境 | 役割・返り値 | 主な用途 |
| :--- | :--- | :--- | :--- |
| **`loadMaster()`** | SSG (サーバー専用) | 全地点マスター（`stations.json`）をfs読込してキャッシュ（返り値: `Record<StationId, RawStationData>`） | 各ページの `getStaticProps` で呼び出し、Propsとしてクライアントに渡す |
| **`loadSingleMetric(metric, master?)`** | SSG / Client | 特定1項目の全地点月別値・順位を読込（返り値: `Record<StationId, MonthlyEntry[]>`） | `clim_ranking`、ブラウザでの個別地点データ取得 |
| **`loadAllMetrics()`** | SSG | 全13項目を一括読込・順位計算してメモリ常駐（返り値: `metricsCache`） | SSG完結型ページの事前バッチ処理 |
| **`getStationMetrics(ids?, options?)`** | SSG / Client | 指定地点（省略時は全地点）の統合表示データを生成（返り値: `Record<StationId, FullStationData>` 辞書） | 地点詳細、コラム、地域解説、比較など |

---

## 2. ページ別要件・データフロー詳細

### パターンA: SSG完結型（ブラウザでの追加fetch不要・静的生成）

ビルド時にデータを埋め込み、ブラウザ側での通信をゼロにして最高速度で表示するページ。

#### ① 地点詳細ページ (`src/pages/station/[id].tsx`)
- **SSGで必要なデータ**:
  - `loadAllMetrics()` で全項目を事前計算。
  - `getStationMetrics([id])` で当該地点の全データ（`overview`, `table`, `ratio`, `uonzu`, `stars`, `badge`）を取得。
  - 類似地点データ（`buildSimilar`）と `stations.json` のマスター情報。
- **ブラウザ実行時**: 追加フェッチなし（Propsのみで完全描画）。

#### ② 地域・都道府県気候解説 (`src/pages/japan/[region]/index.tsx`, `[pref].tsx`)
- **SSGで必要なデータ**:
  - `loadClimateDetailPageData(region, pref)` を実行。
  - 内部で `loadAllMetrics()` ＆ `getStationMetrics()`（または対象雨温図地点リスト）を実行し、代表地点の雨温図（`uonzuItems`）、星取表データ（`climateStars`）、Top1地点リスト（`top1Stations`）をPropsに詰める。
- **ブラウザ実行時**: 追加フェッチなし。

#### ③ コラム詳細ページ (`src/pages/column/[slug].tsx`)
- **SSGで必要なデータ**:
  - `japan-climate-classification`（日本の気候区分）などの場合、対象の全代表地点IDを `getStationMetrics(allStationIds, { uonzu: true })` で取得。
  - `uonzuItems`（各地点の雨温図データ）をPropsに渡す。
- **ブラウザ実行時**: 追加フェッチなし。

---

### パターンB: インタラクティブ型（ユーザー操作で地点を選択）

ユーザーの操作に応じて動的に地点が切り替わるため、SSGでは地点マスターのみを渡し、ブラウザで必要な地点だけオンデマンドで生成するページ。

#### ④ 地点比較ページ (`src/pages/compare.tsx`)
- **SSGで必要なデータ**:
  - `loadMaster()` のみ（セレクトボックス用の地点一覧 `masterData` をPropsで渡す）。
- **ブラウザ実行時**:
  - 選択された地点（初期値: 稚内 & 東京）に対して、`useStationDetail` を通じて必要な気象JSON（`DETAIL_METRICS`）を `loadSingleMetric` でfetch。
  - `getStationMetrics([id1, id2])` で2地点分のアセンブル辞書を取得してグラフ・表に反映。

#### ⑤ マップ探索ページ (`src/pages/map.tsx`)
- **SSGで必要なデータ**:
  - `loadMaster()` のみ（ピン描画用・選択用の `masterData` をPropsで渡す）。
- **ブラウザ実行時**:
  - ユーザーがマップ上のピンをクリックした際、`useStationDetail(selectedId, masterData)` で該当地点のデータのみ `getStationMetrics([selectedId])` で取得してプレビュー表示。

---

### パターンC: 単一気象ランキング型（メトリックを選択）

#### ⑥ 気候ランキングページ (`src/pages/clim_ranking.tsx`)
- **SSGで必要なデータ**:
  - `loadMaster()` のみ（地点詳細情報補完用の `masterData` をPropsで渡す）。
- **ブラウザ実行時**:
  - ユーザーが選択した気象項目（例: 最高気温）について、`loadSingleMetric(metric, masterData)` を呼び出し。
  - 全地点の単一項目データを受け取り、月・地域・都道府県フィルター＆ソートをかけてリスト表示。

---

### パターンE: 実況・速報型（リアルタイムAPI連動）

平年値（過去統計）ではなく、気象庁の最新実況データを表示するページ。

#### ⑦ 実況・速報系ページ (`src/pages/live/realtime.tsx`, `daily_ranking/[metric].tsx`, `recent_ranking/[metric].tsx`)
- **SSGで必要なデータ**:
  - `loadMaster()` のみ（地点名称・地域紐付け用の `masterData` をPropsで渡す）。
  - ※平年値計算（`loadAllMetrics`, `getStationMetrics`）は一切不要。
- **ブラウザ実行時**:
  - `/api/live/...` を fetch して最新の観測速報値を取得。
  - `masterData` と ID 結合してランキングやマップに反映。

---

### パターンF: 静的インデックス型（データ読み込み不要・リンク集）

#### ⑧ トップ・ポータル・検索・一覧
- `src/pages/index.tsx`（トップ）
- `src/pages/japan/index.tsx`（全国地域一覧ポータル）
- `src/pages/column/index.tsx`（コラム一覧）
- `src/pages/search.tsx`（検索ページ）
- `src/pages/about.tsx`, `privacy.tsx`（固定ページ）
- **データ要件**: 気象データ計算は不要。静的コンテンツまたは `stations.json`（検索用）のみ利用。

---

## 3. まとめ：実装・運用時のクイックチェック

```
[ページ作成時の判断フロー]

Q1. 気候データをSSG（ビルド時）で完結させるか？（Client側の追加fetch: ゼロ）
 ├─ YES: SSG完結型ページ (station/[id], japan/..., column/...)
 │    └─ SSG: loadAllMetrics() 実行後に getStationMetrics() を実行してPropsに埋め込む
 │    └─ Client: 追加通信ゼロ。受け取ったPropsを描画するだけ
 │
 └─ NO: クライアント側で動的にデータを取得・切り替えするページ
      Q2. 1つの気象項目に特化したランキングか？
       ├─ YES: 気候ランキング (clim_ranking)
       │    └─ SSG: loadMaster() のみProps渡し
       │    └─ Client: loadSingleMetric(metric) で項目別データを取得・表示
       │
       └─ NO: ユーザーが地点を選択する対話型ページ (compare, map)
            └─ SSG: loadMaster() のみProps渡し
            └─ Client: 選択された地点のみ useStationDetail / getStationMetrics([id]) で取得
```
