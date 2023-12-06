import * as winston from 'winston';
const { combine, timestamp, printf, colorize, splat } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});


const logger: winston.Logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    splat(),
    colorize(),
    myFormat
  ),
  transports: [new winston.transports.Console()]
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function info(cls: any, message: string, ...meta: any[]): void {
  logger.info(`(${cls.constructor.name}): ${message}`, meta);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debug(cls: any, message: string, ...meta: any[]): void {
  logger.debug(`(${cls.constructor.name}): ${message}`, meta);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function error(cls: any, message: string, ...meta: any[]): void {
  logger.error(`(${cls.constructor.name}): ${message}`, meta);
}
