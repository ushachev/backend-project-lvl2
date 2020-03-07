import { formatDiff } from '../src';
import genDiff from '../src';

const pathToFile1 = '__tests__/data/before.json';
const pathToFile2 = '__tests__/data/after.json';

const expected = [
  [' ', 'host: hexlet.io'],
  ['-', 'timeout: 50'],
  ['+', 'timeout: 20'],
  ['-', 'proxy: 123.234.53.22'],
  ['-', 'follow: false'],
  ['+', 'verbose: true'],
];

test('genDiff', () => {
  const diff = genDiff(pathToFile1, pathToFile2);
  console.log('diff', diff);
  expect(diff).toEqual(formatDiff(expected));
});
