import fs from 'fs';
import path from 'path';
import {
  union, keys, has, isObject,
} from 'lodash';
import parseConfig from './parsers';
import formatDiff from './formatters';

const propertyActions = [
  {
    type: 'complex',
    check: (value1, value2) => isObject(value1) && isObject(value2),
    process: (value1, value2, f) => ({ children: f(value1, value2) }),
  },
  {
    type: 'unchanged',
    check: (value1, value2) => value1 === value2,
    process: (value1) => ({ value: value1 }),
  },
  {
    type: 'changed',
    check: (value1, value2, isKeyInConfig1, isKeyInConfig2) => isKeyInConfig1 && isKeyInConfig2,
    process: (value1, value2) => ({ value: value1, newValue: value2 }),
  },
  {
    type: 'deleted',
    check: (value1, value2, isKeyInConfig1) => isKeyInConfig1,
    process: (value1) => ({ value: value1 }),
  },
  {
    type: 'added',
    check: (value1, value2, isKeyInConfig1, isKeyInConfig2) => isKeyInConfig2,
    process: (value1, value2) => ({ value: value2 }),
  },
];

const getPropertyAction = (value1, value2, isKeyInConfig1, isKeyInConfig2) => propertyActions
  .find(({ check }) => check(value1, value2, isKeyInConfig1, isKeyInConfig2));

const compareConfigs = (config1, config2) => union(keys(config1), keys(config2))
  .map((key) => {
    const isKeyInConfig1 = has(config1, key);
    const isKeyInConfig2 = has(config2, key);
    const value1 = config1[key];
    const value2 = config2[key];
    const { type, process } = getPropertyAction(value1, value2, isKeyInConfig1, isKeyInConfig2);

    return { property: key, type, ...process(value1, value2, compareConfigs) };
  });

const readFile = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  return fs.readFileSync(fullPath, 'utf8');
};

const genDiff = (pathToFile1, pathToFile2, format = 'pretty') => {
  const [, configType1] = path.extname(pathToFile1).split('.');
  const [, configType2] = path.extname(pathToFile2).split('.');
  const config1 = parseConfig(configType1, readFile(pathToFile1));
  const config2 = parseConfig(configType2, readFile(pathToFile2));
  const diff = compareConfigs(config1, config2);

  return formatDiff(format, diff);
};

export default genDiff;
