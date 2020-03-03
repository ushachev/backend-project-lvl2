#!/usr/bin/env node

import program from '..';

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
