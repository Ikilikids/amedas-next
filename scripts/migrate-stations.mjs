import fs from 'fs';
import path from 'path';

const files = [
  'data/stations.json',
  'public/stations.json'
];

const catMap = {
  1: "meteo",
  2: "special",
  3: "aviation",
  4: "amedas"
};

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`Migrating ${file}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const updatedData = {};
    
    for (const [id, s] of Object.entries(data)) {
      updatedData[id] = {
        ...s,
        pref: s.prefCode,
        category: catMap[s.categoryCode] || s.categoryCode
      };
      delete updatedData[id].prefCode;
      delete updatedData[id].categoryCode;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    console.log(`Successfully migrated ${file}`);
  }
});
