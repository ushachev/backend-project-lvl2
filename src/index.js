import fs from 'fs';
import path from 'path';
import { union, has, isObject } from 'lodash';
import getParser from './parsers';
import getRenderer from './renderers';

const getConfig = (pathToFile) => {
  const fullPath = path.resolve(process.cwd(), pathToFile);
  const content = fs.readFileSync(fullPath, 'utf8');
  const extName = path.extname(pathToFile);
  const parse = getParser(extName);

  return parse(content);
};

const compareConfigs = (config1, config2) => union(Object.keys(config1), Object.keys(config2))
  .map((key) => {
    const value1 = config1[key];
    const value2 = config2[key];

    if (isObject(value1) && isObject(value2)) {
      return { status: 'unchanged', key, children: compareConfigs(value1, value2) };
    }

    const presence = has(config2, key) - has(config1, key);
    const comparingMap = {
      '-1': { status: 'deleted', key, value: value1 },
      1: { status: 'added', key, value: value2 },
      0: value1 === value2
        ? { status: 'unchanged', key, value: value1 }
        : {
          status: 'changed', key, value: value1, newValue: value2,
        },
    };

    return comparingMap[presence];
  });

const genDiff = (pathToFile1, pathToFile2, format = 'pretty') => {
  const config1 = getConfig(pathToFile1);
  const config2 = getConfig(pathToFile2);
  const diff = compareConfigs(config1, config2);
  const render = getRenderer(format);

  return render(diff);
};

export default genDiff;
