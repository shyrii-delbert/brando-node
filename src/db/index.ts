import { dbLogger } from '$logger';
import { sequelize } from './connection';

export * from './models';

export const init = async () => {
  await sequelize.authenticate();
  dbLogger.info('Connection has been established successfully.');
  process.env.NODE_ENV !== 'production' && await sequelize.sync({ alter: true });
};
