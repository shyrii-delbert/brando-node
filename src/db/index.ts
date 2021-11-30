import { sequelize } from './connection';

export * from './models';

export const init = async () => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
  process.env.NODE_ENVs !== 'production' && await sequelize.sync({ alter: true });
};
