import express from 'express';
import cors from 'cors';
import routes from './routes';
import { PORT, CORS_ORIGIN } from './constants';
import { log } from './utils';
import { LogLevel, HttpStatus } from './enums';
import { connectDB } from './db';

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use('/expenses', routes);

app.get('/health', (req, res) => {
  res.status(HttpStatus.OK).json({ status: 'ok' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      log(LogLevel.Info, 'Server started', { port: PORT, corsOrigin: CORS_ORIGIN });
    });
  })
  .catch((err: unknown) => {
    log(LogLevel.Error, 'Failed to connect to MongoDB', {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  });
