import { spawn } from 'child_process';
import request, { CurlError } from 'sync-request-curl';
import { protocol, host, port } from './app/config.json';
import slync from 'slync';
import killSync from '../src';

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
  const server = spawn('npm', ['start']);
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
