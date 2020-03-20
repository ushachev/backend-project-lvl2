#!/usr/bin/env node

import commander from 'commander';
import genDiff from '..';

const program = new commander.Command();

program
  .version('0.3.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'pretty')
  .arguments('<path1> <path2>')
  .action((path1, path2) => {
    console.log(genDiff(path1, path2, program.format));
  })
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
