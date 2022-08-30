import {spawnSync} from 'child_process';
import {join} from 'path';
import test from 'ava';

const runPgFormatter = (...args) => {
  const result = spawnSync('node', ['dist/bin/index.js', ...args], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  return result.stdout.toString();
};

test('a regular .sql file', (t) => {
  const result = runPgFormatter(join(__dirname, '__fixtures__', 'one.sql'));
  t.is(
    result,
    `SELECT
    *
FROM
    movies;

`,
  );
});

test('an ignored .sql file', (t) => {
  const result = runPgFormatter(join(__dirname, '__fixtures__', 'two.sql'));
  t.is(result, '');
});

test('all .sql files', (t) => {
  const result = runPgFormatter(join(__dirname, '__fixtures__', '*.sql'));
  t.is(
    result,
    `SELECT
    *
FROM
    movies;

`,
  );
});
