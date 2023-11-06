import { execSync } from 'child_process';
import { killPid, treeKill } from './treekill';

/**
 * Kills a process with the given PID.
 *
 * @param {number} pid - The process ID to kill.
 * @param {string | number} [signal='SIGTERM'] - signal to send to the process
 * @param {boolean} [recursive=false] - pass true for tree kill
 *
 * @returns {void}
 */
const killSync = (
  pid: number,
  signal?: string | number,
  recursive = false
): void => {
  signal = signal ?? 'SIGTERM';
  if (!recursive) {
    return killPid(pid, signal);
  }
  /* istanbul ignore next */
  switch (process.platform) {
    case 'win32':
      execSync(`taskkill /pid ${pid} /T /F`);
      break;
    case 'darwin':
    default:
      treeKill(pid, signal);
      break;
  }
};

export default killSync;
