/*!
 * This file is part of the "ro-crate2html" library
 * Copyright 2023 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/ro-crate2html
 */

export class Builder {
  input: object;

  _isResolvableLocally(targetId: string): boolean {
    return (typeof this._findById(targetId)) !== 'undefined';
  }

  _findById(targetId: string): object {
    const graph = this.input['@graph'];
    if (typeof graph === 'undefined') {
      throw new Error('Could not find nodes in @graph!');
    }
    return graph.find((node: object) => node['@id'] === targetId);
  }

  _node2html(id: string): HTMLDetailsElement {
    const node = this._findById(id);
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const content = this._obj2html(node);
    summary.textContent = id;
    details.appendChild(summary);
    details.appendChild(content);
    return details;
  }

  _string2li(key: string, value: string): HTMLElement {
    const li = document.createElement('li');
    const keySpan = document.createElement('span');
    keySpan.classList.add('ro-crate2html', 'ro-crate2htmlKey');
    keySpan.textContent = key;
    const valueSpan = document.createElement('span');
    valueSpan.classList.add('ro-crate2html', 'ro-crate2htmlValue');
    if (value.startsWith('http')) {
      const link = document.createElement('a');
      link.href = value;
      link.textContent = value;
      valueSpan.append(link);
    } else {
      valueSpan.textContent = value;
    }
    li.append(keySpan);
    li.append(valueSpan);
    return li;
  }

  _obj2html(node: object): HTMLUListElement {
    const list = document.createElement('ul');
    if (typeof node === 'undefined') {
      console.error('Could not find node!');
      return list;
    }
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string') {
        list.appendChild(this._string2li(key, value));
        continue;
      }
      if (['author', 'comment', 'mentions', 'hasPart'].includes(key)) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = key;
        details.appendChild(summary);
        list.appendChild(details);

        if (Array.isArray(value)) {
          value.forEach(part => {
            const subdetails = document.createElement('details');
            const subsummary = document.createElement('summary');
            subsummary.textContent = part['@id'];
            subdetails.appendChild(subsummary);
            subdetails.appendChild(this._obj2html(this._findById(part['@id'])));
            details.appendChild(subdetails);
          });
          continue;
        } else {
          details.appendChild(this._obj2html(this._findById(value['@id'])));
        }
        continue;
      }
      if (Array.isArray(value)) {
        value.forEach(part => {
          if (typeof part === 'string') {
            list.appendChild(this._string2li(key, part));
          } else {
            list.appendChild(this._obj2html(part));
          }
        });
        continue;
      }
      if (typeof value === 'object') {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = key;
        details.appendChild(summary);
        details.appendChild(this._obj2html(value));
        const li = document.createElement('li');
        li.appendChild(details);
        list.appendChild(li);
        continue;
      }
    }
    return list;
  }

  parse(input: string): Array<HTMLElement> {
    this.input = JSON.parse(input);
    const result = [];
    result.push(this._node2html('ro-crate-metadata.json'));
    result.push(this._node2html('./'));
    return result;
  }
}
