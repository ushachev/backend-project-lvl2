import { isObject, isString } from 'lodash';

const stringifyValue = (value) => {
  if (isObject(value)) return '[complex value]';
  return isString(value) ? `'${value}'` : value;
};

const nodeMapping = {
  complex: (parents, { property, children }, f) => f(children, [...parents, property]),
  unchanged: () => [],
  changed: (parents, { property, oldValue, newValue }) => {
    const propertyName = [...parents, property].join('.');
    const stringifiedOldValue = stringifyValue(oldValue);
    const stringifiedNewValue = stringifyValue(newValue);

    return `Property '${propertyName}' was changed from ${stringifiedOldValue} to ${
      stringifiedNewValue
    }`;
  },
  deleted: (parents, { property }) => {
    const propertyName = [...parents, property].join('.');
    return `Property '${propertyName}' was deleted`;
  },
  added: (parents, { property, newValue }) => {
    const propertyName = [...parents, property].join('.');
    const stringifiedValue = stringifyValue(newValue);

    return `Property '${propertyName}' was added with value: ${stringifiedValue}`;
  },
};

const stringifyDiff = (diff, parents = []) => {
  const rows = diff.flatMap((node) => {
    const { type } = node;
    return nodeMapping[type](parents, node, stringifyDiff);
  });

  return rows.join('\n');
};

export default (diff) => stringifyDiff(diff);
