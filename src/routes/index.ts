import { Express } from 'express';
import { defaultHandler } from './default';

export const registerRoutes = (app: Express) => {
  app.get('/', defaultHandler);
};
