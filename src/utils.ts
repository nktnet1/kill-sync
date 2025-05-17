export const isKillError = (err: unknown) => {
  return typeof err === 'object' && err !== null && 'code' in err;
};
