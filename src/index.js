import fs from 'fs';
import path from 'path';
import { union, has, isObject } from 'lodash';
import getParser from './parsers';
import { formatInPretty, formatInPlain } from './formatters';

const getConfig = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const content = fs.readFileSync(fullPath, 'utf8');
  const extName = path.extname(pathToFile);
  const parse = getParser(extName);

  return parse(content);
};

const parameterActions = [
  {
    status: 'unchanged',
    check: (presence, value1, value2) => isObject(value1) && isObject(value2),
    process: (value1, value2, f) => ({ children: f(value1, value2) }),
  },
  {
    status: 'unchanged',
    check: (presence, value1, value2) => value1 === value2,
    process: (value1) => ({ value: value1 }),
  },
  {
    status: 'changed',
    check: (presence) => presence === 0,
    process: (value1, value2) => ({ value: value1, newValue: value2 }),
  },
  {
    status: 'added',
    check: (presence) => presence === 1,
    process: (value1, value2) => ({ value: value2 }),
  },
  {
    status: 'deleted',
    check: (presence) => presence === -1,
    process: (value1) => ({ value: value1 }),
  },
];

const getParameterAction = (presence, value1, value2) => parameterActions
  .find(({ check }) => check(presence, value1, value2));

const compareConfigs = (config1, config2) => union(Object.keys(config1), Object.keys(config2))
  .map((key) => {
    const presence = has(config2, key) - has(config1, key);
    const value1 = config1[key];
    const value2 = config2[key];
    const { status, process } = getParameterAction(presence, value1, value2);

    return { name: key, status, ...process(value1, value2, compareConfigs) };
  });

const formatters = {
  pretty: (diff) => formatInPretty(diff),
  plain: (diff) => formatInPlain(diff),
};

const genDiff = (pathToFile1, pathToFile2, format = 'pretty') => {
  const config1 = getConfig(pathToFile1);
  const config2 = getConfig(pathToFile2);
  const diff = compareConfigs(config1, config2);

  return formatters[format](diff);
};

export default genDiff;
