import log4js from 'log4js';

log4js.configure({
  appenders: {
    colorful: {
      type: 'stdout',
    },
    basic: {
      type: 'console',
      layout: { type: 'basic' },
    },
  },
  categories: {
    default: {
      appenders: process.env.NODE_ENV !== 'production' ? ['colorful'] : ['basic'],
      level: 'all',
    },
  },
});

export const dbLogger = log4js.getLogger('Sequelize');
export const expressLogger = log4js.getLogger('Express');
export const brandoLogger = log4js.getLogger('Brando');

export default log4js;
