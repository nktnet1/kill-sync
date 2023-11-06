import { spawnSync } from 'child_process';
import { killPid, treeKill } from './treekill';

const killSync = (pid: number, signal?: string | number, recursive = false): void => {
  signal = signal ?? 'SIGTERM';
  if (!recursive) {
    return killPid(pid, signal);
  }
  /* istanbul ignore next */
  switch (process.platform) {
    case 'win32':
      spawnSync(`taskkill /pid ${pid} /T /F`, { shell: false });
      break;
    case 'darwin':
    default:
      treeKill(pid, signal);
      break;
  }
};

export default killSync;
