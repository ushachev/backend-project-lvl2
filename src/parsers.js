import yaml from 'js-yaml';

const parsersMap = {
  '.json': (content) => JSON.parse(content),
  '.yml': (content) => yaml.load(content),
};

export default (format) => parsersMap[format];
