import { Router } from 'express';
import { imagesRouter } from './images';
import { albumsRouter } from './albums';

const v1Router = Router({ mergeParams: true });

v1Router.use('/images', imagesRouter);
v1Router.use('/albums', albumsRouter);

export const registerRoutes = (app: Router) => {
  app.use('/v1', v1Router);
};
