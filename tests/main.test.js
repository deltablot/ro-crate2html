/*!
 * This file is part of the "ro-crate2html" library
 * Copyright 2023 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/ro-crate2html
 */

const lib = require('../src/main.ts');
const builder = new lib.Builder();

test('test parse empty object', () => {
  expect(builder).toBeInstanceOf(lib.Builder);
  expect(() => {
    builder.parse('{}');
  }).toThrowError(Error)
});
