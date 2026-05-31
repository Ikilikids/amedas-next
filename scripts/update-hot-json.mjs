import fs from 'fs';
import path from 'path';

const stations = JSON.parse(fs.readFileSync('public/stations.json', 'utf8'));
const hotFeature = JSON.parse(fs.readFileSync('data/feature/hot.json', 'utf8'));

const nameToId = {};
Object.values(stations).forEach(s => {
    nameToId[s.station_name] = s.id;
});

const entries = Object.entries(hotFeature);
let output = '{\n';

entries.forEach(([name, data], i) => {
    const id = nameToId[name] || name;
    // インデントを揃えて整形
    const jsonStr = JSON.stringify(data, null, 4);
    const indented = jsonStr.split('\n').map((line, j) => j === 0 ? line : '    ' + line).join('\n');
    
    output += `    "${id}": ${indented}${i === entries.length - 1 ? '' : ','}\n`;
});

output += '}';

fs.writeFileSync('data/feature/hot.json', output);
console.log('Successfully updated hot.json with original order preserved.');
