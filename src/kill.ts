import { execSync } from 'child_process';
import { killPid, treeKill } from './treekill';

const killSync = (pid: number, signal: string | number, recursive = false): void => {
  if (!recursive) {
    return killPid(pid, signal);
  }
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
