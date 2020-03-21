import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const getDiff = (extension, format) => {
  const pathToFile1 = getFixturePath(`before.${extension}`);
  const pathToFile2 = getFixturePath(`after.${extension}`);

  return genDiff(pathToFile1, pathToFile2, format);
};

let expected;

describe.each([
  ['pretty', 'pretty.txt'],
  ['plain', 'plain.txt'],
  ['json', 'output.json'],
])('%s genDiff', (format, fixture) => {
  beforeAll(() => {
    expected = fs.readFileSync(getFixturePath(fixture), 'utf8');
  });

  test.each(['json', 'yml', 'ini'])('from %s', (extension) => {
    expect(getDiff(extension, format)).toEqual(expected);
  });
});
