#!/usr/bin/env node

import fs from 'fs';
import glob from 'fast-glob';
import yargs from 'yargs';
import format from '../format';

const argv = yargs
  .usage('Formats SQL files')
  .options({
    anonymize: {
      default: false,
      description:
        'Obscure all literals in queries, useful to hide confidential data before formatting.',
      type: 'boolean',
    },
    'comma-break': {
      default: false,
      description: 'Add a newline after each comma in an insert statement.',
      type: 'boolean',
    },
    'function-case': {
      choices: ['unchanged', 'lowercase', 'uppercase', 'capitalize'],
      default: 'unchanged',
      description: 'Change the case of the function names.',
      type: 'string',
    },
    inplace: {
      alias: 'i',
      default: false,
      description: 'Override input file with formatted content.',
      type: 'boolean',
    },
    'keyword-case': {
      choices: ['unchanged', 'lowercase', 'uppercase', 'capitalize'],
      default: 'unchanged',
      description: 'Change the case of the reserved keyword.',
      type: 'string',
    },
    'no-rc-file': {
      default: false,
      description: 'Do not read ~/.pg_format automatically.',
      type: 'boolean',
    },
    placeholder: {
      description: 'Regex to find code that must not be changed.',
      type: 'string',
    },
    spaces: {
      default: 4,
      description: 'Number of spaces to indent the code.',
      type: 'number',
    },
    'strip-comments': {
      default: false,
      description: 'Remove any comment from SQL code.',
      type: 'boolean',
    },
    tabs: {
      default: false,
      description:
        'Use tabs instead of spaces. When true, the spaces option is ignored.',
      type: 'boolean',
    },
  })
  .check((parameters) => {
    const filePaths = parameters._;
    if (filePaths.length === 0) {
      throw new Error('No files given');
    } else {
      return true;
    }
  })
  .help()
  .wrap(80)
  .parse();

const files = glob.sync(argv._);

if (files.length === 0) {
  throw new Error('No files given');
}

const options = [
  'anonymize',
  'commaBreak',
  'functionCase',
  'keywordCase',
  'noRcFile',
  'placeholder',
  'spaces',
  'stripComments',
  'tabs',
];
const config = {};

for (const option of options) {
  config[option] = argv[option];
}

files.forEach((file) => {
  const data = fs.readFileSync(file);
  if (!data.toString('utf-8', 0, 50).includes('pgFormatter-ignore')) {
    const result = format(data, config);

    if (argv.inplace) {
      fs.writeFileSync(file, result);
    } else {
      process.stdout.write(result);
    }
  }
});
