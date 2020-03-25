import fs from 'fs';
import path from 'path';
import {
  union, keys, has, isObject,
} from 'lodash';
import parseConfig from './parsers';
import formatDiff from './formatters';

const keyTypeChecks = {
  changed: (isKeyInConfig1, isKeyInConfig2) => isKeyInConfig1 && isKeyInConfig2,
  deleted: (isKeyInConfig1) => isKeyInConfig1,
  added: (isKeyInConfig1, isKeyInConfig2) => isKeyInConfig2,
};
const keyTypes = keys(keyTypeChecks);

const compareConfigs = (config1, config2) => union(keys(config1), keys(config2))
  .map((key) => {
    const isKeyInConfig1 = has(config1, key);
    const isKeyInConfig2 = has(config2, key);
    const type = keyTypes
      .find((keyType) => keyTypeChecks[keyType](isKeyInConfig1, isKeyInConfig2));
    const value1 = config1[key];
    const value2 = config2[key];
    if (isObject(value1) && isObject(value2)) {
      return { property: key, type: 'unchanged', children: compareConfigs(value1, value2) };
    }
    if (value1 === value2) {
      return { property: key, type: 'unchanged', value: value1 };
    }
    if (type === 'changed') {
      return {
        property: key, type, value: value1, newValue: value2,
      };
    }

    return { property: key, type, value: value1 || value2 };
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
