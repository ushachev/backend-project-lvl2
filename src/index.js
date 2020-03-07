import fs from 'fs';
import path from 'path';
import { union, has } from 'lodash';

const getConfig = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const content = fs.readFileSync(fullPath, 'utf8');
  const config = JSON.parse(content);

  return config;
};

const compare = (config1, config2) => {
  const mapCallback = (key) => {
    const entry1 = has(config1, key) ? `${key}: ${config1[key]}` : null;
    const entry2 = has(config2, key) ? `${key}: ${config2[key]}` : null;

    if (entry1 && entry2) {
      return entry1 === entry2
        ? [[' ', entry1]]
        : [['-', entry1], ['+', entry2]];
    }
    if (entry1) return [['-', entry1]];

    return [['+', entry2]];
  };

  return union(Object.keys(config1), Object.keys(config2))
    .flatMap(mapCallback);
};

export const formatDiff = (diff) => `{\n  ${
  diff.map((a) => a.join(' ')).join(',\n  ')
}\n}`;

const genDiff = (pathToFile1, pathToFile2) => {
  const config1 = getConfig(pathToFile1);
  const config2 = getConfig(pathToFile2);
  const diff = compare(config1, config2);

  return formatDiff(diff);
};

export default genDiff;
