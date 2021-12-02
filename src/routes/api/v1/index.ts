import { Router } from 'express';
import { imagesRouter } from './images';

const v1Router = Router({ mergeParams: true });

v1Router.use('/images', imagesRouter);

export const registerRoutes = (app: Router) => {
  app.use('/v1', v1Router);
};
