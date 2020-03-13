import { isObject } from 'lodash';

const statusMap = {
  deleted: '-',
  added: '+',
  unchanged: ' ',
};

const convertChanged = (row) => {
  const {
    status, key, value, children = null, newValue,
  } = row;
  if (children) return { status, key, children: children.flatMap(convertChanged) };

  return status === 'changed'
    ? [
      { status: 'deleted', key, value },
      { status: 'added', key, value: newValue },
    ]
    : row;
};

const convertNested = (row) => {
  const {
    status, key, value, children = null,
  } = row;
  if (children) return { status, key, children: children.map(convertNested) };

  return isObject(value)
    ? {
      status,
      key,
      children: Object.entries(value)
        .map(([nestedKey, nestedValue]) => ({
          status: 'unchanged',
          key: nestedKey,
          value: nestedValue,
        }))
        .map(convertNested),
    }
    : row;
};

const stringifyPretty = (row, nestingLevel) => {
  const {
    status, key, value, children = null,
  } = row;
  const indent = ' '.repeat(2 * nestingLevel);

  return (children)
    ? [
      `${indent}${statusMap[status]} ${key}: {`,
      children.map((nestedRow) => stringifyPretty(nestedRow, nestingLevel + 2)),
      `${indent}  }`,
    ]
    : `${indent}${statusMap[status]} ${key}: ${value}`;
};

const renderPretty = (diff) => `{\n${
  diff
    .flatMap(convertChanged)
    .map(convertNested)
    .map((row) => stringifyPretty(row, 1))
    .flat(Infinity)
    .join('\n')
}\n}`;

const renderersMap = {
  pretty: renderPretty,
};

export default (format) => renderersMap[format];
