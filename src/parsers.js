import yaml from 'js-yaml';
import ini from 'ini';

const parsersMap = {
  '.json': JSON.parse,
  '.yml': yaml.load,
  '.ini': ini.parse,
};

export default (extName) => parsersMap[extName];
