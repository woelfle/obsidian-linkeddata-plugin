import * as winston from 'winston';
const { combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});


const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    colorize(),
    myFormat
  ),
  transports: [new winston.transports.Console()]
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(cls: any, message: string): void {
  logger.info(`(${cls.constructor.name}): ${message}`);
}

