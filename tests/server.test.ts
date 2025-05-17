import { spawn } from 'child_process';
import slync from 'slync';
import request, { CurlError } from 'sync-request-curl';
import { expect, test } from 'vitest';
import killSync from '../src/kill';
import { protocol, host, port } from './app/config.json';

const SERVER_URL = `${protocol}://${host}:${port}`;

const rootRequest = () => request('GET', SERVER_URL);

const serverIsAlive = () => {
  try {
    return rootRequest().statusCode === 200;
  } catch (_) {
    return false;
  }
};

const waitForServer = () => {
  while (!serverIsAlive()) {
    slync(100);
  }
};

test('Shuts down server successfully', () => {
  const server = spawn('pnpm', ['start']);
  const pid = server.pid as number;
  expect(pid).toStrictEqual(expect.any(Number));

  waitForServer();

  expect(rootRequest().statusCode).toStrictEqual(200);
  killSync(pid, 'SIGINT', true);
  expect(() => rootRequest()).toThrow(CurlError);

  try {
    rootRequest();
  } catch (error: any) {
    expect(error).toBeInstanceOf(CurlError);
    expect((error as CurlError).code).toStrictEqual(7);
  }
});
