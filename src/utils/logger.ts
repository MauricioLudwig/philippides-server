import winston from 'winston';

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const logConfiguration = {
  transports: [
    new winston.transports.Console({
      format,
    }),
  ],
};

export const logger = winston.createLogger(logConfiguration);
