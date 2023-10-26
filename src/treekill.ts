/**
 * Code below is inspired by tree-kill-sync and tree-kill:
 * - https://github.com/dvpnt/tree-kill-sync/blob/master/index.js
 * - https://github.com/pkrumins/node-tree-kill/blob/master/index.js
 */

import { execSync } from 'child_process';

type PPID_HASH = Record<number, number[]>;

interface PID_ITEM {
  pid: number;
  ppid: number;
}

/**
 * Retrieves a list of all running process IDs (PIDs) along with their parent
 * process IDs (PPIDs).
 *
 * @returns {PID_ITEM[]} An array of PID_ITEM objects containing PID and PPID.
 */
const getAllPids = (): PID_ITEM[] =>
  execSync('ps -A -o pid=,ppid=')
    .toString()
    .trim()
    .split('\n')
    .map((row: string) => {
      const [, pid, ppid] = row.match(/\s*(\d+)\s*(\d+)/) ?? [];
      console.log([pid, ppid]);
      return {
        pid: Number(pid),
        ppid: Number(ppid)
      };
    });

/**
 * Retrieves all child PIDs of a given parent PID.
 *
 * @param {number} parentPid - The parent PID for which to find child PIDs.
 * @returns {number[]} An array of child PIDs.
 */
const getAllChilds = (parentPid: number): number[] => {
  const all = getAllPids();
  const ppidHash: PPID_HASH = all.reduce((hash: PPID_HASH, item) => {
    hash[item.ppid] = (hash[item.ppid] || []).concat(item.pid);
    return hash;
  }, {});
  const result: number[] = [];
  const recursivelAddChild = (pid: number) => {
    ppidHash[pid] = ppidHash[pid] || [];
    ppidHash[pid].forEach((childPid) => {
      result.push(childPid);
      recursivelAddChild(childPid);
    });
  };
  recursivelAddChild(parentPid);
  return result;
};

/**
 * Kills a process with the specified PID using the given signal.
 * The error ESRCH will be ignored.
 *
 * @param {number} pid - The PID of the process to be killed.
 * @param {number | string} signal - The signal to send for termination.
 */
export const killPid = (pid: number, signal: number | string) => {
  try {
    process.kill(pid, signal);
  } catch (err: any) {
    if (err.code !== 'ESRCH') {
      throw err;
    }
  }
};

/**
 * Recursively kills a process and all its child processes using the specified
 * signal - i.e. terminates the whole process tree.
 *
 * @param {number} pid - process pid to be killed alongside children.
 * @param {number | string} signal - the signal to send for termination.
 */
export const treeKill = (pid: number, signal: string | number) => {
  const childs = getAllChilds(pid);
  childs.forEach((pid: number) => {
    killPid(pid, signal);
  });
  killPid(pid, signal);
};
