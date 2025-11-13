import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class MyLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info', // Set desired log level
      format: format.combine(
        format.timestamp({
          format: "DD-MM-YYYY HH:mm:ss",
        }),
        format.json(), // or format.simple() for plain text
      ),
      transports: [
        new transports.Console(), // Log to console
        new transports.DailyRotateFile({
          filename: 'tutoapp-%DATE%.log',
          dirname: path.join(__dirname, '../../logs'), // Log directory
          datePattern: 'DD-MM-YYYY',
          zippedArchive: true,
          maxSize: '20m', // Rotate file when size exceeds 20MB
          maxFiles: '31d', // Keep logs for 31 days
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
