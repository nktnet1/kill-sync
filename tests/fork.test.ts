import killSync from '../src';
import { ChildProcess, fork } from 'child_process';

export const waitForPidToDie = (pid: number, callback: () => void) => {
  const id = setInterval(() => {
    try {
      process.kill(pid, 0);
    } catch (err: any) {
      if (err.code === 'ESRCH') {
        clearInterval(id);
        callback();
      }
    }
  }, 100);
};

describe('Simple forked child process', () => {
  let child: ChildProcess;
  let pid: number;
  beforeEach(() => {
    child = fork('./tests/processes/child.js');
    pid = child.pid as number;
    expect(pid).toStrictEqual(expect.any(Number));
  });

  afterAll(() => {
    killSync(pid);
  });

  test('Double killing will not throw errors', (done) => {
    child.on('exit', (_, signal) => {
      expect(signal).toBe('SIGTERM');
      waitForPidToDie(pid, () => {
        expect(() => killSync(pid, 'SIGTERM')).not.toThrow(Error);
      });
      done();
    });
    killSync(pid);
    expect(() => killSync(pid)).not.toThrow(Error);
  });

  test.each([
    'SIGINT',
    'SIGTERM',
    'SIGKILL',
  ])('Can kill a forked process with signal: %s', (expectedSignal, done) => {
    child.on('exit', (_, signal) => {
      expect(signal).toBe(expectedSignal);
      done();
    });

    killSync(pid, expectedSignal);
  });

  test('Killing a non-existent process is okay', () => {
    expect(() => killSync(Number.MAX_SAFE_INTEGER - 1)).not.toThrow(Error);
  });
});

describe('Child process that spawns other processes', () => {
  test('killing tree recursively', (done) => {
    const root = fork('./tests/processes/spawnChildren.js');
    const rootPid = root.pid as number;
    expect(rootPid).toStrictEqual(expect.any(Number));

    root.on('message', (pids: number[]) => {
      let childrenKilled = 0;
      [rootPid].concat(pids).forEach((pid) => {
        waitForPidToDie(pid, () => {
          // Root (spawnChildren.js) + 3 children (child.js x3)
          if (++childrenKilled === 4) {
            done();
          }
        });
      });

      // Will fail (timeout) if 'true' is not specified (no recursion)
      killSync(rootPid, 'SIGINT', true);
    });
  }, 10000);
});
