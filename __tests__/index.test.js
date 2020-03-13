import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const getDiffByExt = (extension) => {
  const pathToFile1 = getFixturePath(`before.${extension}`);
  const pathToFile2 = getFixturePath(`after.${extension}`);

  return genDiff(pathToFile1, pathToFile2);
};

let expected;

beforeAll(() => {
  expected = fs.readFileSync(getFixturePath('pretty.txt'), 'utf8');
});

describe('genDiff', () => {
  test.each([
    ['json'],
    ['yml'],
    ['ini'],
  ])('from plain %s', (extension) => {
    expect(getDiffByExt(extension)).toEqual(expected);
  });
});
