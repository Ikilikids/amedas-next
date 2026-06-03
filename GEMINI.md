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
