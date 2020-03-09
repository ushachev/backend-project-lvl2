import fs from 'fs';
import path from 'path';
import { union, has } from 'lodash';
import getParser from './parsers';

const getConfig = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const content = fs.readFileSync(fullPath, 'utf8');
  const format = path.extname(pathToFile);
  const parse = getParser(format);

  return parse(content);
};

const getEntryByKey = (key, config1, config2) => {
  const formEntry = (flag, config) => [flag, `${key}: ${config[key]}`];

  if (has(config1, key) && has(config2, key)) {
    return config1[key] === config2[key]
      ? [formEntry(' ', config1)]
      : [formEntry('-', config1), formEntry('+', config2)];
  }
  if (has(config1, key)) return [formEntry('-', config1)];

  return [formEntry('+', config2)];
};

const compare = (config1, config2) => union(Object.keys(config1), Object.keys(config2))
  .flatMap((key) => getEntryByKey(key, config1, config2));

const formatDiff = (diff) => `{\n  ${
  diff.map((a) => a.join(' ')).join(',\n  ')
}\n}`;

const genDiff = (pathToFile1, pathToFile2) => {
  const config1 = getConfig(pathToFile1);
  const config2 = getConfig(pathToFile2);
  const diff = compare(config1, config2);

  return formatDiff(diff);
};

export default genDiff;
