---
name: responsive-breakpoints
description: Tailwind CSSのブレークポイント利用ルール。lg/mdは共通パーツ（ヘッダー・フッター・目次・サイドバー制御・HeroSection）のみ許可。sm/mdはgrid列折り返しのみ許可。他はxl。
---

# レスポンシブ・ブレークポイント規定

今後コンポーネントやページを追加・編集する際は、以下のTailwindブレークポイント規定を厳格に遵守すること。

## ブレークポイント使用ルール
- **共通パーツの許可範囲**
  - **`lg:`**: 「ヘッダー」「フッター」「目次（TOC）」「サイドバー制御（PageLayout等の配置）」のみ許可。
  - **`md:`**: 「HeroSection（共通看板コンポーネント）」および「gridの折り返し（列数変更）」のみ許可。
- **`sm:` の許可範囲**
  - 「gridの折り返し（列数変更）」のみ例外として許可（例: `sm:grid-cols-2`, `md:grid-cols-3`）。
  - それ以外の用途（flexの方向切り替え、文字サイズ、パディング、余白、display制御など）では `sm:`, `md:` は禁止。
- **上記以外の一般的なレスポンシブ切り替えは `xl:` を使用すること**
  - 例: `xl:flex-row`, `xl:items-center`, `xl:items-end` など
