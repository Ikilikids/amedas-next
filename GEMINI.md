# Project Instructions & Architecture

## Data Integration Pipeline
Climate data (stations + ranking JSONs) must be processed through the unified pipeline in `src/utils/rankingUtils.ts` to ensure consistency between SSG and Client-side rendering.

### 3-Step Process:
1. **Ranker (`calculateStationMonthlyEntries`)**: Calculates Top/Bot/Region/Pref ranks for a single metric.
2. **Integrator (`integrateStationClimateData`)**: Aggregates all metrics for a specific station ID.
3. **Assembler (`assembleDisplayData`)**: Formats integrated data into `overview`, `table`, `ratio`, and `uonzu` structures.

### Key Files:
- Logic: `src/utils/rankingUtils.ts`
- SSG Entry: `src/features/station/ssg.ts`
- Client Hook: `src/components/Ranking/useRankingData.ts`

## Responsive Breakpoint Rules
Tailwind CSSのブレークポイント利用ルール:
- `lg:` は「ヘッダー」「フッター」「目次（TOC）」「サイドバー制御（PageLayout等の配置）」のみ許可。
- `md:` は「HeroSection（共通ヘッダー看板）」および「gridの折り返し（列数変更）」のみ例外として許可。
- `sm:` は「gridの折り返し（列数変更）」のみ例外として許可（例: `sm:grid-cols-2`, `md:grid-cols-3`）。
- それ以外の用途（flexの方向、文字サイズ、余白など）では `sm:`, `md:` は使用禁止。
- 一般的なレスポンシブ切り替えは `xl:` を使用すること。
