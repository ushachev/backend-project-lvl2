import { isObject, entries } from 'lodash';

const typeMapping = {
  complex: ' ',
  deleted: '-',
  added: '+',
  unchanged: ' ',
};

const getIndent = (nestingLevel) => ' '.repeat(4 * nestingLevel - 2);

const stringifyValue = (nestingLevel, { property, type, value }) => {
  const indent = getIndent(nestingLevel);
  const nestedIndent = getIndent(nestingLevel + 1);

  const stringifyNestedValue = ([key, nestedValue]) => (
    isObject(nestedValue)
      ? stringifyValue(nestingLevel + 1, { property: key, type: 'complex', value: nestedValue })
      : `${nestedIndent}  ${key}: ${nestedValue}`
  );

  return isObject(value)
    ? [
      `${indent}${typeMapping[type]} ${property}: {`,
      ...entries(value).map(stringifyNestedValue),
      `${indent}  }`,
    ]
    : [`${indent}${typeMapping[type]} ${property}: ${value}`];
};

const nodeMapping = {
  complex: (nestingLevel, { property, children }, f) => {
    const indent = getIndent(nestingLevel);
    return [
      `${indent}${typeMapping.complex} ${property}: {`,
      ...children.flatMap((node) => f(nestingLevel + 1, node)),
      `${indent}  }`,
    ];
  },
  changed: (nestingLevel, { property, value, newValue }) => [
    ...stringifyValue(nestingLevel, { property, type: 'deleted', value }),
    ...stringifyValue(nestingLevel, { property, type: 'added', value: newValue }),
  ],
  unchanged: stringifyValue,
  deleted: stringifyValue,
  added: stringifyValue,
};

const stringifyNode = (nestingLevel, node) => {
  const { type } = node;
  return nodeMapping[type](nestingLevel, node, stringifyNode);
};

export default (diff) => {
  const rows = diff.flatMap((node) => stringifyNode(1, node));
  return `{\n${rows.join('\n')}\n}`;
};
