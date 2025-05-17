/**
 * Check if the error contains the 'code' property from usage of
 * process.kill. This code can contain values such as ESRCH.
 *
 * @param err the error object that was caught
 * @returns true if the error contains the 'code' property
 */
export const isKillError = (err: unknown) => {
  return typeof err === 'object' && err !== null && 'code' in err;
};
