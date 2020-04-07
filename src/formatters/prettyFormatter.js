import { isObject, entries } from 'lodash';

const stringifyValue = (nestingLevel, property, marker, value) => {
  const indent = ' '.repeat(4 * nestingLevel + 2);

  if (!isObject(value)) return [`${indent}${marker} ${property}: ${value}`];

  const nestedIndent = ' '.repeat(4 * (nestingLevel + 2));
  const closingIndent = ' '.repeat(4 * (nestingLevel + 1));

  const stringifyNestedValue = ([key, nestedValue]) => {
    if (!isObject(nestedValue)) return `${nestedIndent}${key}: ${nestedValue}`;
    return stringifyValue(nestingLevel + 1, key, ' ', nestedValue);
  };

  return [
    `${indent}${marker} ${property}: {`,
    ...entries(value).map(stringifyNestedValue),
    `${closingIndent}}`,
  ];
};

const nodeMapping = {
  complex: (nestingLevel, { property, children }, f) => {
    const indent = ' '.repeat(4 * (nestingLevel + 1));
    return `${indent}${property}: ${f(children, nestingLevel + 1)}`;
  },
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
    return nodeMapping[type](nestingLevel, node, stringifyDiff);
  });
  const closingIndent = ' '.repeat(4 * nestingLevel);

  return `{\n${rows.join('\n')}\n${closingIndent}}`;
};

export default (diff) => stringifyDiff(diff);
