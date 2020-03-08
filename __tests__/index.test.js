import path from 'path';
import genDiff, { formatDiff } from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const pathToFile1 = getFixturePath('before.json');
const pathToFile2 = getFixturePath('after.json');

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
