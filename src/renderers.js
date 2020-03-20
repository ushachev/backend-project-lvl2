import { isObject } from 'lodash';

const statusMap = {
  deleted: '-',
  added: '+',
  unchanged: ' ',
};

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

const stringifyRowPretty = (row, nestingLevel) => {
  const {
    status, name, value, children = null,
  } = row;
  const indent = ' '.repeat(4 * nestingLevel - 2);

  return (children)
    ? [
      `${indent}${statusMap[status]} ${name}: {`,
      children.map((nestedRow) => stringifyRowPretty(nestedRow, nestingLevel + 1)),
      `${indent}  }`,
    ]
    : `${indent}${statusMap[status]} ${name}: ${value}`;
};

const renderPretty = (diff) => `{\n${
  diff
    .flatMap(convertChanged)
    .map(convertNested)
    .map((row) => stringifyRowPretty(row, 1))
    .flat(Infinity)
    .join('\n')
}\n}`;

const renderersMap = {
  pretty: renderPretty,
};

export default (format) => renderersMap[format];
