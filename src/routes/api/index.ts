import { Express, Router } from 'express';
import { registerRoutes as registerV1Routes } from './v1';

const apiRouter = Router({ mergeParams: true });

registerV1Routes(apiRouter);

export const registerRoutes = (app: Express) => {
  app.use('/api', apiRouter);
};
