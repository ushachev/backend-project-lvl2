import { isObject } from 'lodash';

const formatActions = [
  {
    check: (value) => typeof value === 'string',
    process: (value) => `'${value}'`,
  },
  {
    check: (value) => isObject(value),
    process: () => '[complex value]',
  },
  {
    check: () => true,
    process: (value) => value,
  },
];

const getFormatAction = (value) => formatActions.find(({ check }) => check(value));

const format = (value) => {
  const { process } = getFormatAction(value);
  return process(value);
};

const propertyActions = [
  {
    check: (status, children) => children,
    process: (parent, { name, children }, f) => {
      const { rows } = children.reduce(f, { parent: [...parent, name], rows: [] });
      return rows;
    },
  },
  {
    check: (status) => status === 'unchanged',
    process: () => [],
  },
  {
    check: (status) => status === 'changed',
    process: (parent, { name, value, newValue }) => {
      const nestedName = [...parent, name].join('.');
      return [
        `Property '${nestedName}' was changed from ${format(value)} to ${format(newValue)}`,
      ];
    },
  },
  {
    check: (status) => status === 'deleted',
    process: (parent, { name }) => [`Property '${[...parent, name].join('.')}' was deleted`],
  },
  {
    check: (status) => status === 'added',
    process: (parent, { name, value }) => [
      `Property '${[...parent, name].join('.')}' was added with value: ${format(value)}`,
    ],
  },
];

const getPropertyAction = (status, children) => propertyActions
  .find(({ check }) => check(status, children));

const getFormattedRows = ({ parent, rows }, property) => {
  const { status, children = null } = property;
  const { process } = getPropertyAction(status, children);

  return { parent, rows: [...rows, ...process(parent, property, getFormattedRows)] };
};

export default (diff) => {
  const { rows } = diff.reduce(getFormattedRows, { parent: [], rows: [] });
  return rows.join('\n');
};
