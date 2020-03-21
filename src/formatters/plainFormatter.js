import { isObject } from 'lodash';

const format = (value) => {
  if (isObject(value)) return '[complex value]';
  return typeof value === 'string' ? `'${value}'` : value;
};

const propertyActions = [
  {
    check: (status, children) => children,
    process: (parent, { property, children }, f) => {
      const { rows } = children.reduce(f, { parent: [...parent, property], rows: [] });
      return rows;
    },
  },
  {
    check: (status) => status === 'unchanged',
    process: () => [],
  },
  {
    check: (status) => status === 'changed',
    process: (parent, { property, value, newValue }) => {
      const nestedProperty = [...parent, property].join('.');
      return [
        `Property '${nestedProperty}' was changed from ${format(value)} to ${format(newValue)}`,
      ];
    },
  },
  {
    check: (status) => status === 'deleted',
    process: (parent, { property }) => [
      `Property '${[...parent, property].join('.')}' was deleted`,
    ],
  },
  {
    check: (status) => status === 'added',
    process: (parent, { property, value }) => [
      `Property '${[...parent, property].join('.')}' was added with value: ${format(value)}`,
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
