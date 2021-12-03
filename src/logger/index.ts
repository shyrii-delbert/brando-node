import dayjs from 'dayjs';
import log4js from 'log4js';

const layout = {
  type: 'pattern',
  tokens: {
    myTime: function (logEvent: log4js.LoggingEvent) {
      return dayjs(logEvent.startTime).tz().format('YYYY-MM-DDTHH:mm:ss.SSS');
    }
  }
};

const basicLayout: log4js.Layout = {
  ...layout,
  pattern: '[%x{myTime}] [%p] %c - %m',
}

const colorfulLayout = {
  ...layout,
  pattern: '%[[%x{myTime}] [%p] %c -%] %m',
};

log4js.configure({
  appenders: {
    colorful: {
      type: 'stdout',
      layout: colorfulLayout,
    },
    basic: {
      type: 'stdout',
      layout: basicLayout,
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
