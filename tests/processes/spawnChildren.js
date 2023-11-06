const { fork } = require('child_process');

if (!process.send) {
  throw new Error('process.send is undefined');
}

const childPath = 'tests/processes/child.js';
const pids = [];

for (let i = 0; i < 3; ++i) {
  const child = fork(childPath, { detached: true });
  child.unref();
  if (!child.pid) {
    throw new Error(`Failed to fork child '${childPath}'`);
  }
  pids.push(child.pid);
}

process.send(pids);

// setTimeout(() => {
//   // Staying alive!
// }, 10000);
