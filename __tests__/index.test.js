import path from 'path';
import genDiff, { formatDiff } from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const pathToJSON1 = getFixturePath('before.json');
const pathToJSON2 = getFixturePath('after.json');

const pathToYAML1 = getFixturePath('before.yml');
const pathToYAML2 = getFixturePath('after.yml');

const expected = [
  [' ', 'host: hexlet.io'],
  ['-', 'timeout: 50'],
  ['+', 'timeout: 20'],
  ['-', 'proxy: 123.234.53.22'],
  ['-', 'follow: false'],
  ['+', 'verbose: true'],
];

describe('genDiff', () => {
  test('plain JSON', () => {
    const diff = genDiff(pathToJSON1, pathToJSON2);
    console.log('diff JSON', diff);
    expect(diff).toEqual(formatDiff(expected));
  });

  test('plain YAML', () => {
    const diff = genDiff(pathToYAML1, pathToYAML2);
    console.log('diff YAML', diff);
    expect(diff).toEqual(formatDiff(expected));
  });
});
