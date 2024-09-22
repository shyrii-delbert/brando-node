import { Router } from 'express';
import { imagesRouter } from './images';
import { albumsRouter } from './albums';
import { userRouter } from './user';

const v1Router = Router({ mergeParams: true });

v1Router.use('/images', imagesRouter);
v1Router.use('/albums', albumsRouter);
v1Router.use('/user', userRouter);

export const registerRoutes = (app: Router) => {
  app.use('/v1', v1Router);
};
