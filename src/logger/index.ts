import log4js from 'log4js';

log4js.configure({
  appenders: {
    stdout: {
      type: 'stdout',
    },
  },
  categories: {
    default: {
      appenders: ['stdout'],
      level: 'all',
    },
  },
});

export const dbLogger = log4js.getLogger('Sequelize');
export const expressLogger = log4js.getLogger('Express');
export const brandoLogger = log4js.getLogger('Brando');

export default log4js;
