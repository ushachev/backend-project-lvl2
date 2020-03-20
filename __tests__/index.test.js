import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const getDiff = (extension, format = 'pretty') => {
  const pathToFile1 = getFixturePath(`before.${extension}`);
  const pathToFile2 = getFixturePath(`after.${extension}`);

  return genDiff(pathToFile1, pathToFile2, format);
};

let expectedPretty;
let expectedPlain;

beforeAll(() => {
  expectedPretty = fs.readFileSync(getFixturePath('pretty.txt'), 'utf8');
  expectedPlain = fs.readFileSync(getFixturePath('plain.txt'), 'utf8');
});

describe('pretty genDiff', () => {
  test.each([
    ['json'],
    ['yml'],
    ['ini'],
  ])('from %s', (extension) => {
    expect(getDiff(extension)).toEqual(expectedPretty);
  });
});

describe('plain genDiff', () => {
  test.each([
    ['json'],
    ['yml'],
    ['ini'],
  ])('from %s', (extension) => {
    expect(getDiff(extension, 'plain')).toEqual(expectedPlain);
  });
});
