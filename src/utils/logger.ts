import winston, { format, transports } from 'winston';

const customFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logConfiguration = {
  transports: [
    new transports.Console({
      format: customFormat,
    }),
    new transports.File({
      filename: 'logs/info.log',
      level: 'info',
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
};

export const logger = winston.createLogger(logConfiguration);
