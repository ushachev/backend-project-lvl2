import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const getDiffByFormat = (format) => {
  const pathToFile1 = getFixturePath(`before.${format}`);
  const pathToFile2 = getFixturePath(`after.${format}`);

  return genDiff(pathToFile1, pathToFile2);
};

let expected;

beforeAll(() => {
  expected = fs.readFileSync(getFixturePath('diff.txt'), 'utf8');
});

describe('genDiff', () => {
  test.each([
    ['json'],
    ['yml'],
    ['ini'],
  ])('from plain %s', (format) => {
    expect(getDiffByFormat(format)).toEqual(expected);
  });
});
