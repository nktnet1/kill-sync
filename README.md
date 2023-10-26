<div align="center">

# [![Kill Sync](logo.svg)](https://github.com/nktnet1/kill-sync)

Synchronousless kill processes based on their pid

Supports treekill, where child processes are recursively terminated


[![Try with Replit](https://replit.com/badge?caption=Try%20with%20Replit)](https://replit.com/@nktnet1/kill-sync-example#index.js)

</div>

---

- [1. Installation](#1-installation)
- [2. Usage](#2-usage)
- [3. License](#3-license)
- [4. Limitations](#4-limitations)
- [5. Caveats](#5-caveats)

## 1. Installation

```
npm install kill-sync
```

## 2. Usage

Try with [Replit](https://replit.com/@nktnet1/kill-sync-example#index.js).

```javascript
killSync(pid, signal)
killSync(pid, signal, recursive)
```
- **`pid`**: a number denoting the [process identifier](https://en.wikipedia.org/wiki/Process_identifier)
- **`signal`**: number or string denoting the [inter-process communication signals](https://en.wikipedia.org/wiki/Signal_(IPC))
- **`recursive`**: optional boolean to enable killing child processes (default: `false``)

Example 1: Kill a process with `SIGINT`
```javascript
const killSync = require('kill-sync');

const pid = 12345;

// Same as killSync(pid, 2);
killSync(pid, 'SIGINT');
```

Example 2: Kill a process with `SIGINT` recursively
```javascript
const killSync = require('kill-sync');

killSync(12345, 'SIGINT', true);
```


## 3. License

<details closed>
<summary>
  Massachusetts Institute of Technology
  (<a href="https://opensource.org/license/mit" target="_blank">MIT</a>)
</summary>

<br/>

```
Copyright (c) 2023 Khiet Tam Nguyen

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the “Software”),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```

</details>

## 4. Limitations

There are currently no known limitations.

## 5. Caveats

**kill-sync** is modelled after [tree-kill](https://github.com/pkrumins/node-tree-kill) and [tree-kill-sync](https://github.com/dvpnt/tree-kill-sync).
