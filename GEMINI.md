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

## Git Command Rules
- `git` コマンドの実行は禁止（コマンドラインツール等での git 実行は一切行わないこと）。

## File Reading Rules
- **ファイルの読み過ぎ禁止（厳禁）**: 関連ファイルを片っ端から読み漁る行為は絶対に禁止。必要な最小限のファイル・行数のみをピンポイントで確認し、手短かつ迅速に修正を行うこと。

## Communication & User Question Rules
- **ユーザーの質問への最優先回答（厳守）**: ユーザーから質問や問いかけがあった場合、作業を勝手に進めて質問を無視することは絶対に禁止。まず必ずユーザーの問いかけ・質問に対して正面から真っ先に明確に答えること。
