import fs from 'fs';
import path from 'path';
import {
  union, keys, has, isObject,
} from 'lodash';
import parseConfig from './parsers';
import formatDiff from './formatters';

const propertyActions = [
  {
    type: 'unchanged',
    check: (presence, value1, value2) => isObject(value1) && isObject(value2),
    process: (value1, value2, f) => ({ children: f(value1, value2) }),
  },
  {
    type: 'unchanged',
    check: (presence, value1, value2) => value1 === value2,
    process: (value1) => ({ value: value1 }),
  },
  {
    type: 'changed',
    check: (presence) => presence === 0,
    process: (value1, value2) => ({ value: value1, newValue: value2 }),
  },
  {
    type: 'added',
    check: (presence) => presence === 1,
    process: (value1, value2) => ({ value: value2 }),
  },
  {
    type: 'deleted',
    check: (presence) => presence === -1,
    process: (value1) => ({ value: value1 }),
  },
];

const getPropertyAction = (presence, value1, value2) => propertyActions
  .find(({ check }) => check(presence, value1, value2));

const compareConfigs = (config1, config2) => union(keys(config1), keys(config2))
  .map((key) => {
    const presence = has(config2, key) - has(config1, key);
    const value1 = config1[key];
    const value2 = config2[key];
    const { type, process } = getPropertyAction(presence, value1, value2);

    return { property: key, type, ...process(value1, value2, compareConfigs) };
  });

const readFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  return fs.readFileSync(fullPath, 'utf8');
};

const genDiff = (pathToFile1, pathToFile2, format = 'pretty') => {
  const config1 = parseConfig(path.extname(pathToFile1), readFile(pathToFile1));
  const config2 = parseConfig(path.extname(pathToFile2), readFile(pathToFile2));
  const diff = compareConfigs(config1, config2);

  return formatDiff(format, diff);
};

export default genDiff;
