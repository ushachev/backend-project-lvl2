import { isObject, entries } from 'lodash';

const convertChanged = (row) => {
  const {
    type, property, value, children = null, newValue,
  } = row;
  if (children) return { type, property, children: children.flatMap(convertChanged) };

  return type === 'changed'
    ? [
      { type: 'deleted', property, value },
      { type: 'added', property, value: newValue },
    ]
    : row;
};

const convertNested = (row) => {
  const {
    type, property, value, children = null,
  } = row;
  if (children) return { type, property, children: children.map(convertNested) };

  return isObject(value)
    ? {
      type,
      property,
      children: entries(value)
        .map(([nestedKey, nestedValue]) => ({
          type: 'unchanged',
          property: nestedKey,
          value: nestedValue,
        }))
        .map(convertNested),
    }
    : row;
};

const typeMapping = {
  deleted: '-',
  added: '+',
  unchanged: ' ',
};

const stringifyRow = (row, nestingLevel) => {
  const {
    type, property, value, children = null,
  } = row;
  const indent = ' '.repeat(4 * nestingLevel - 2);

  return (children)
    ? [
      `${indent}${typeMapping[type]} ${property}: {`,
      children.map((nestedRow) => stringifyRow(nestedRow, nestingLevel + 1)),
      `${indent}  }`,
    ]
    : `${indent}${typeMapping[type]} ${property}: ${value}`;
};

export default (diff) => `{\n${
  diff
    .flatMap(convertChanged)
    .map(convertNested)
    .map((row) => stringifyRow(row, 1))
    .flat(Infinity)
    .join('\n')
}\n}`;
