import winston from 'winston';
import Sentry from 'winston-transport-sentry-node';
import Config from '@/Config';

const currentDate = new Date();
const fileDatePrefix = currentDate.toISOString().split('T')[0];

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: Config.serviceName, shard: Config.botShard },
  transports: [
    new winston.transports.File({
      filename: `./logs/${fileDatePrefix}-error.log`,
      level: 'error',
      maxsize: 1024,
    }),
    new winston.transports.File({
      filename: `./logs/${fileDatePrefix}-combined.log`,
      maxsize: 1024,
    }),
  ],
});

if (Config.sentryDSN) {
  logger.add(new Sentry({
    sentry: {
      serverName: Config.serviceName,
      dsn: Config.sentryDSN,
    },
    level: 'error',
  }));
}

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
