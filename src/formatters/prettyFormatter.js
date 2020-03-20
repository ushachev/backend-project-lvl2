import { isObject } from 'lodash';

const convertChanged = (row) => {
  const {
    status, name, value, children = null, newValue,
  } = row;
  if (children) return { status, name, children: children.flatMap(convertChanged) };

  return status === 'changed'
    ? [
      { status: 'deleted', name, value },
      { status: 'added', name, value: newValue },
    ]
    : row;
};

const convertNested = (row) => {
  const {
    status, name, value, children = null,
  } = row;
  if (children) return { status, name, children: children.map(convertNested) };

  return isObject(value)
    ? {
      status,
      name,
      children: Object.entries(value)
        .map(([nestedKey, nestedValue]) => ({
          status: 'unchanged',
          name: nestedKey,
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
    status, name, value, children = null,
  } = row;
  const indent = ' '.repeat(4 * nestingLevel - 2);

  return (children)
    ? [
      `${indent}${statusMapping[status]} ${name}: {`,
      children.map((nestedRow) => stringifyRow(nestedRow, nestingLevel + 1)),
      `${indent}  }`,
    ]
    : `${indent}${statusMapping[status]} ${name}: ${value}`;
};

export default (diff) => `{\n${
  diff
    .flatMap(convertChanged)
    .map(convertNested)
    .map((row) => stringifyRow(row, 1))
    .flat(Infinity)
    .join('\n')
}\n}`;
