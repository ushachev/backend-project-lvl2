import { isObject, isString } from 'lodash';

const stringifyValue = (value) => {
  if (isObject(value)) return '[complex value]';
  return isString(value) ? `'${value}'` : value;
};

const nodeMapping = {
  complex: (parents, { property, children }, f) => children
    .flatMap((node) => f([...parents, property], node)),
  unchanged: () => [],
  changed: (parents, { property, value, newValue }) => [
    [
      'Property',
      `'${[...parents, property].join('.')}'`,
      'was changed from',
      stringifyValue(value),
      'to',
      stringifyValue(newValue),
    ].join(' '),
  ],
  deleted: (parents, { property }) => [
    `Property '${[...parents, property].join('.')}' was deleted`,
  ],
  added: (parents, { property, value }) => [
    [
      'Property',
      `'${[...parents, property].join('.')}'`,
      'was added with value:',
      stringifyValue(value),
    ].join(' '),
  ],
};

const stringifyNode = (parents, node) => {
  const { type } = node;
  return nodeMapping[type](parents, node, stringifyNode);
};

export default (diff) => diff
  .flatMap((node) => stringifyNode([], node))
  .join('\n');
