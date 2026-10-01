---
name: page-architecture-pattern
description: Next.jsページ作成における3層アーキテクチャ標準。SSG関数（ssg_function.ts）、メイン描画（index.tsx）、UI部品（widgets/）の役割分担と設計パターン。
---

# ページ・アーキテクチャ標準パターン（Page Architecture Pattern）

当プロジェクトにおけるページ・画面開発は、`ArticleTemplate/Climate` に代表される**「3層構造（SSG処理・メイン描画・部品群）」**を完成形・標準パターンとして採用する。

気候記事に限らず、各機能ページやテンプレート画面を設計・実装する際は本アーキテクチャを適用すること。

---

## 1. 構成概要

```
[TargetFeature]/
├── ssg_function.ts   # ① SSGフェーズ（getStaticProps等）で呼ぶデータ取得・集計関数
├── index.tsx         # ② メイン描画コンポーネント（渡されたpropsを描画・レイアウト）
└── widgets/          # ③ 各UI部品・可視化パーツ群
    ├── [WidgetA]/
    │   ├── UI.tsx
    │   └── function.ts (必要に応じて補助関数)
    └── [WidgetB]/
        └── UI.tsx
```

---

## 2. 各レイヤーの責務と役割分担

### ① `ssg_function.ts`（データ集約・前処理層）
- **役割**: `pages/` 配下の `getStaticProps`（または SSR 時の処理）から最初に呼び出される純粋なデータ取得・集約関数。
- **責務**:
  - マスターデータ、気象データ（JSON等）、ランキングデータの読み込み。
  - ページ表示に必要な形式へのデータ整形・フィルタリング。
  - レンダリングコンポーネントへ渡す `Props` 型の定義・返却。
- **原則**: JSX/React hooksは含めず、純粋な TypeScript ロジックとして独立させること（テスト容易性・再利用性の担保）。

### ② `index.tsx`（メイン描画・オーケストレーション層）
- **役割**: `ssg_function.ts` が構築した props（`data`）を受け取り、ページ全体の構成・レイアウトを組む React コンポーネント。
- **責務**:
  - ページのメタ情報（`Head`）やセクション構造のオーケストレーション。
  - 状態管理（必要な場合）やレイアウトコンポーネント（`PageLayout` や `ArticleTemplate` 等）への組み込み。
  - 配下の各 `widgets/` に必要なデータを分配して配置。
- **原則**: 個別の複雑なパーツ描画ロジックをここにベタ書きせず、`widgets/` に委譲して見通しを保つこと。

### ③ `widgets/`（UI部品・ウィジェット層）
- **役割**: 画面を構成する独立したUIコンポーネント群。
- **構成**:
  - ウィジェットごとにディレクトリを切り、描画担当（`UI.tsx`）や補助ロジック（`function.ts`）に分割。
  - 汎用カード、ランキングセクション、グラフ描画、導入文パーツなどを自己完結型で管理。
- **原則**: 親（`index.tsx`）から明示的に props を受け取って描画し、疎結合を維持すること。

---

## 3. `pages/` からの呼び出し例

ページのエントリーポイント（`src/pages/...`）は極めて薄く保ち、本アーキテクチャに処理を委譲する。

```tsx
// src/pages/feature/[slug].tsx
import { GetStaticProps, NextPage } from "next";
import { getFeaturePageData, FeaturePageDataProps } from "@/components/.../ssg_function";
import { FeaturePageTemplate } from "@/components/...";

export const getStaticProps: GetStaticProps<{ data: FeaturePageDataProps }> = async ({ params }) => {
  const data = await getFeaturePageData(params?.slug);
  if (!data) return { notFound: true };
  return { props: { data } };
};

const Page: NextPage<{ data: FeaturePageDataProps }> = ({ data }) => {
  return <FeaturePageTemplate data={data} />;
};

export default Page;
```
