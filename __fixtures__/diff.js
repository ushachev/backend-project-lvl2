const diff = [
  {
    status: 'unchanged',
    key: 'common',
    children: [
      { status: 'unchanged', key: 'setting1', value: 'Value 1' },
      { status: 'deleted', key: 'setting2', value: 200 },
      {
        status: 'changed',
        key: 'setting3',
        value: true,
        newValue: { key: 'value' },
      },
      {
        status: 'unchanged',
        key: 'setting6',
        children: [
          { status: 'unchanged', key: 'key', value: 'value' },
          { status: 'added', key: 'ops', value: 'vops' },
        ],
      },
      { status: 'added', key: 'follow', value: false },
      { status: 'added', key: 'setting4', value: 'blah blah' },
      { status: 'added', key: 'setting5', value: { key5: 'value5' } },
    ],
  },
  {
    status: 'unchanged',
    key: 'group1',
    children: [
      {
        status: 'changed', key: 'baz', value: 'bas', newValue: 'bars',
      },
      { status: 'unchanged', key: 'foo', value: 'bar' },
      {
        status: 'changed',
        key: 'nest',
        value: { key: 'value' },
        newValue: 'str',
      },
    ],
  },
  { status: 'deleted', key: 'group2', value: { abc: 12345 } },
  { status: 'added', key: 'group3', value: { fee: 100500 } },
];

export default diff;
