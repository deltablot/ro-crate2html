/*!
 * This file is part of the "ro-crate2html" library
 * Copyright 2023 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/ro-crate2html
 */
import { Builder } from '../dist/main.js';

const jsonLdFilePath = '../example/ro-crate-metadata.json';
fetch(jsonLdFilePath).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch ${jsonLdFilePath}`);
    }
    return response.text();
  })
  .then(jsonLdData => {
    const builder = new Builder();
    const result = builder.parse(jsonLdData);
    const targetDiv = document.getElementById('ro-crate-div');
    result.forEach(el => {
      targetDiv.appendChild(el);
    });
  })
  .catch(error => {
    console.error(error);
  });
