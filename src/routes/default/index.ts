import { RequestHandler } from 'express';

export const defaultHandler: RequestHandler = (req, res) => {
  res.send('Hello brando!');
};
