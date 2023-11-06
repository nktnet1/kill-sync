import express, { Request, Response } from 'express';
import { protocol, host, port } from './config.json';

const SERVER_URL = `${protocol}://${host}:${port}`;

const app = express();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'Welcome to our server!' });
});

const server = app.listen(port, host, () => {
  console.log(`Local: '${SERVER_URL}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('\nShutting down server gracefully.');
  });
});
