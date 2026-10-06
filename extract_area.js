const fs = require('fs');
const content = fs.readFileSync('src/setting/area.ts', 'utf8');

// 1. extract imports
const importRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*"(\.\.\/data\/area\/[^"]+)";/g;
let match;
const imports = [];
while ((match = importRegex.exec(content)) !== null) {
  imports.push(match[0]);
}

// 2. extract AreaKey pairs
const pairRegex = /"(\d+)":\s*\{[^}]*detail:\s*(area_\d+)[^}]*\}/g;
const pairs = [];
while ((match = pairRegex.exec(content)) !== null) {
  pairs.push(`  "${match[1]}": ${match[2]},`);
}

const fileContent = `import { AreaValue } from "../../setting/area";
import { ClimateArticleData } from "../types";

${imports.join('\n')}

export const AreaClimateArticles: Record<AreaValue, ClimateArticleData> = {
${pairs.join('\n')}
};
`;

fs.writeFileSync('src/data/area/index.ts', fileContent, 'utf8');
console.log('Created src/data/area/index.ts with', pairs.length, 'entries');
