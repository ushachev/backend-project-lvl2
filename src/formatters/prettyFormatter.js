import { isObject } from 'lodash';

const convertChanged = (row) => {
  const {
    status, property, value, children = null, newValue,
  } = row;
  if (children) return { status, property, children: children.flatMap(convertChanged) };

  return status === 'changed'
    ? [
      { status: 'deleted', property, value },
      { status: 'added', property, value: newValue },
    ]
    : row;
};

const convertNested = (row) => {
  const {
    status, property, value, children = null,
  } = row;
  if (children) return { status, property, children: children.map(convertNested) };

  return isObject(value)
    ? {
      status,
      property,
      children: Object.entries(value)
        .map(([nestedKey, nestedValue]) => ({
          status: 'unchanged',
          property: nestedKey,
          value: nestedValue,
        }))
        .map(convertNested),
    }
    : row;
};

const statusMapping = {
  deleted: '-',
  added: '+',
  unchanged: ' ',
};

const stringifyRow = (row, nestingLevel) => {
  const {
    status, property, value, children = null,
  } = row;
  const indent = ' '.repeat(4 * nestingLevel - 2);

  return (children)
    ? [
      `${indent}${statusMapping[status]} ${property}: {`,
      children.map((nestedRow) => stringifyRow(nestedRow, nestingLevel + 1)),
      `${indent}  }`,
    ]
    : `${indent}${statusMapping[status]} ${property}: ${value}`;
};

export default (diff) => `{\n${
  diff
    .flatMap(convertChanged)
    .map(convertNested)
    .map((row) => stringifyRow(row, 1))
    .flat(Infinity)
    .join('\n')
}\n}`;
