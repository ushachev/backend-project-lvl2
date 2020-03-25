import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let expected;

describe.each([
  ['pretty', 'pretty.txt'],
  ['plain', 'plain.txt'],
  ['json', 'output.json'],
])('%s genDiff', (format, fixture) => {
  beforeAll(() => {
    expected = fs.readFileSync(getFixturePath(fixture), 'utf8');
  });

  test.each([
    'json',
    'yml',
    'ini',
  ])('from %s', (extension) => {
    const pathToFile1 = getFixturePath(`before.${extension}`);
    const pathToFile2 = getFixturePath(`after.${extension}`);
    const actual = genDiff(pathToFile1, pathToFile2, format);

    expect(actual).toEqual(expected);
  });
});
