import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'src/data/area');
const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

let fileCount = 0;

for (const folder of folders) {
  const folderPath = path.join(baseDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.ts') && f !== 'index.ts');

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const code = file.replace('.ts', '');
    const varName = `area_${code}`;

    const content = `import { ClimateArticleData } from "../../types";

export const ${varName}: ClimateArticleData = {
  catchphrase: "",
  climateType: "",
  heroDescription: "",
  description: [
    {
      isSummary: true,
      content: [],
    },
  ],
  highlights: [],
};
`;
    fs.writeFileSync(filePath, content, 'utf8');
    fileCount++;
  }
}

console.log(`Updated ${fileCount} area article files to pure ClimateArticleData!`);
