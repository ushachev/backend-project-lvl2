import { isObject, isString } from 'lodash';

const format = (value) => {
  if (isObject(value)) return '[complex value]';
  return isString(value) ? `'${value}'` : value;
};

const propertyActions = [
  {
    check: (type, children) => children,
    process: (parent, { property, children }, f) => {
      const { rows } = children.reduce(f, { parent: [...parent, property], rows: [] });
      return rows;
    },
  },
  {
    check: (type) => type === 'unchanged',
    process: () => [],
  },
  {
    check: (type) => type === 'changed',
    process: (parent, { property, value, newValue }) => {
      const nestedProperty = [...parent, property].join('.');
      return [
        `Property '${nestedProperty}' was changed from ${format(value)} to ${format(newValue)}`,
      ];
    },
  },
  {
    check: (type) => type === 'deleted',
    process: (parent, { property }) => [
      `Property '${[...parent, property].join('.')}' was deleted`,
    ],
  },
  {
    check: (type) => type === 'added',
    process: (parent, { property, value }) => [
      `Property '${[...parent, property].join('.')}' was added with value: ${format(value)}`,
    ],
  },
];

const getPropertyAction = (type, children) => propertyActions
  .find(({ check }) => check(type, children));

const getFormattedRows = ({ parent, rows }, property) => {
  const { type, children = null } = property;
  const { process } = getPropertyAction(type, children);

  return { parent, rows: [...rows, ...process(parent, property, getFormattedRows)] };
};

export default (diff) => {
  const { rows } = diff.reduce(getFormattedRows, { parent: [], rows: [] });
  return rows.join('\n');
};
