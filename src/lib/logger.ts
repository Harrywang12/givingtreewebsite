const isProduction = process.env.NODE_ENV === 'production';

type LogArgs = unknown[];

export const logger = {
  log: (...args: LogArgs) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  info: (...args: LogArgs) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
  warn: (...args: LogArgs) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args: LogArgs) => {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },
};

export default logger;


