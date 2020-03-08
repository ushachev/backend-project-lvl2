import fs from 'fs';
import path from 'path';
import { union, has } from 'lodash';

const getConfig = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const content = fs.readFileSync(fullPath, 'utf8');
  const config = JSON.parse(content);

  return config;
};

const compare = (config1, config2) => union(Object.keys(config1), Object.keys(config2))
  .flatMap((key) => {
    const makeEntry = (config) => `${key}: ${config[key]}`;

    if (has(config1, key) && has(config2, key)) {
      return config1[key] === config2[key]
        ? [[' ', makeEntry(config1)]]
        : [['-', makeEntry(config1)], ['+', makeEntry(config2)]];
    }
    if (has(config1, key)) return [['-', makeEntry(config1)]];

    return [['+', makeEntry(config2)]];
  });

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
