export interface ColumnArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  coverEmoji: string;
  summary: string;
}

export const COLUMNS: ColumnArticle[] = [
  {
    slug: "japan-climate-classification",
    title: "雨温図で読み解く日本の6大気候区分〜なぜ日本は地域によってこんなに天気が違うのか？〜",
    description: "太平洋側、日本海側、瀬戸内、中央高地、南西諸島、オホーツク海側の6大気候区分をアメダスの雨温図（平年値データ）とともに徹底解説。季節風と山脈がもたらす気候の違いの謎に迫ります。",
    category: "気候学・気象解説",
    publishedAt: "2026年9月14日",
    readTime: "約6分",
    coverEmoji: "🗾",
    summary: "日本列島は南北に長く、中央に険しい山脈が連なるため、わずか数十km離れるだけで別世界のような気候が広がります。本記事では雨温図の見方と6大気候区分のメカニズムを解説します。",
  },
];
