import { isObject, entries } from 'lodash';

const stringifyValue = (nestingLevel, property, marker, value) => {
  const indent = ' '.repeat(4 * nestingLevel + 2);
  const closingIndent = ' '.repeat(4 * (nestingLevel + 1));
  const nestedIndent = ' '.repeat(4 * (nestingLevel + 2));

  const stringifyNestedValue = ([key, nestedValue]) => (
    isObject(nestedValue)
      ? stringifyValue(nestingLevel + 1, key, ' ', nestedValue)
      : `${nestedIndent}${key}: ${nestedValue}`
  );

  return isObject(value)
    ? [
      `${indent}${marker} ${property}: {`,
      ...entries(value).map(stringifyNestedValue),
      `${closingIndent}}`,
    ]
    : [`${indent}${marker} ${property}: ${value}`];
};

const nodeMapping = {
  changed: (nestingLevel, { property, oldValue, newValue }) => [
    ...stringifyValue(nestingLevel, property, '-', oldValue),
    ...stringifyValue(nestingLevel, property, '+', newValue),
  ],
  unchanged: (nestingLevel, { property, oldValue }) => (
    stringifyValue(nestingLevel, property, ' ', oldValue)
  ),
  deleted: (nestingLevel, { property, oldValue }) => (
    stringifyValue(nestingLevel, property, '-', oldValue)
  ),
  added: (nestingLevel, { property, newValue }) => (
    stringifyValue(nestingLevel, property, '+', newValue)
  ),
};

const stringifyDiff = (diff, nestingLevel = 0) => {
  const rows = diff.flatMap((node) => {
    const { type } = node;

    if (type === 'complex') {
      const { property, children } = node;
      const indent = ' '.repeat(4 * (nestingLevel + 1));

      return `${indent}${property}: ${stringifyDiff(children, nestingLevel + 1)}`;
    }

    return nodeMapping[type](nestingLevel, node);
  });
  const closingIndent = ' '.repeat(4 * nestingLevel);

  return `{\n${rows.join('\n')}\n${closingIndent}}`;
};

export default (diff) => stringifyDiff(diff);
