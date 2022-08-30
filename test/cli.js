const test = require("ava");
const { spawnSync } = require("child_process");
const { join } = require("path");

function runPgFormatter(...args: string[]) {
  const result = spawnSync("node", ["dist/bin/index.js", ...args], {
    cwd: process.cwd(),
    stdio: "pipe",
  });
  return result.stdout.toString();
}

test("a regular .sql file", (t) => {
  const result = runPgFormatter(join(__dirname, "__fixtures__", "one.sql"));
  console.debug(result);
  t.is(
    result,
    `SELECT
    *
FROM
    movies;

`
  );
});

test("an ignored .sql file", (t) => {
  const result = runPgFormatter(join(__dirname, "__fixtures__", "two.sql"));
  t.is(result, "");
});

test("all .sql files", (t) => {
  const result = runPgFormatter(join(__dirname, "__fixtures__", "*.sql"));
  t.is(
    result,
    `SELECT
    *
FROM
    movies;

`
  );
});
