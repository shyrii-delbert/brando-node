import { Express } from 'express';
import { defaultHandler } from './default';
import { registerRoutes as registerApiRoutes } from './api';

export const registerRoutes = (app: Express) => {
  app.get('/', defaultHandler);
  registerApiRoutes(app);
};
