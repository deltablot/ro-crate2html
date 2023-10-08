/*!
 * This file is part of the "ro-crate2html" library
 * Copyright 2023 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/ro-crate2html
 */
import { Builder } from '../dist/main.js';

function displayContent(fileName) {
  fetch(`../example/${fileName}`).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}`);
    }
    return response.text();
  })
  .then(jsonLdData => {
    const builder = new Builder();
    const result = builder.parse(jsonLdData);
    const targetDiv = document.getElementById(fileName);
    result.forEach(el => {
      targetDiv.appendChild(el);
    });
  })
  .catch(error => {
    console.error(error);
  });
}

document.querySelectorAll('[data-file]').forEach(el => {
  displayContent(el.dataset.file);
});
