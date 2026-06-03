import fs from 'fs';
import path from 'path';

const files = [
  'public/stations.json'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`Updating ${file}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const updatedData = {};
    for (const [id, station] of Object.entries(data)) {
      updatedData[id] = {
        id,
        prefCode: id.substring(0, 2),
        ...station
      };
    }
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    console.log(`Successfully updated ${file}`);
  } else {
    console.log(`${file} not found, skipping.`);
  }
});
