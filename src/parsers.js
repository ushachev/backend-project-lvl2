import yaml from 'js-yaml';
import ini from 'ini';
import { isObject, entries } from 'lodash';

const getConvertedContent = (acc, [key, value]) => (
  isObject(value)
    ? { ...acc, [key]: entries(value).reduce(getConvertedContent, {}) }
    : { ...acc, [key]: parseInt(value, 10) || value }
);

const parseIni = (content) => entries(ini.parse(content)).reduce(getConvertedContent, {});

const parserMapping = {
  '.json': JSON.parse,
  '.yml': yaml.load,
  '.ini': parseIni,
};

export default (extName) => parserMapping[extName];
