import path from 'path';
import genDiff, { formatDiff } from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const expected = [
  [' ', 'host: hexlet.io'],
  ['-', 'timeout: 50'],
  ['+', 'timeout: 20'],
  ['-', 'proxy: 123.234.53.22'],
  ['-', 'follow: false'],
  ['+', 'verbose: true'],
];

const getDiffByFormat = (format) => {
  const pathToFile1 = getFixturePath(`before.${format}`);
  const pathToFile2 = getFixturePath(`after.${format}`);

  return genDiff(pathToFile1, pathToFile2);
};

describe('genDiff', () => {
  test('from plain JSON', () => {
    expect(getDiffByFormat('json')).toEqual(formatDiff(expected));
  });
  test('from plain YAML', () => {
    expect(getDiffByFormat('yml')).toEqual(formatDiff(expected));
  });
});
