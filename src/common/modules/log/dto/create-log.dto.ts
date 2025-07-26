import { LogLevel } from './enums/level';

export interface CreateLogDto {

  /**
   * Log level
   */
  level: LogLevel;

  /**
   * Log message
   */
  message: string;

  /**
   * Service name
   */
  service: string;

  /**
   * Error message (optional)
   */
  error?: string;
}
