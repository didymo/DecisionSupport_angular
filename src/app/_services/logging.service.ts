import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

/**
 * @whatItDoes Centralized logging service with environment-based filtering.
 *
 * @description
 * The `LoggingService` provides methods for logging (`log`, `info`, `warn`, `error`) with environment-based controls.
 * In production environments, only critical logs (`warn`, `error`) are enabled to ensure performance and security.
 *
 * This service can be extended to integrate with external logging and monitoring systems (e.g., Sentry, LogRocket).
 *
 * @security
 * - Avoid logging sensitive data in any environment.
 * - Ensure logs do not expose user details, tokens, or any identifiable information.
 * - In production, only log errors and warnings.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  /**
   * Dynamically determines if the current environment is production.
   * This ensures environment changes are reflected without requiring service reinitialization.
   */
  private get isProduction(): boolean {
    return environment.production;
  }

  /**
   * Logs general information, useful for debugging during development.
   * Suppressed in production environments for performance and security reasons.
   *
   * @param message - The message to log.
   * @param context - Optional additional context (e.g., request, error objects).
   */
  log(message: string, context?: any): void {
    if (!this.isProduction) {
      console.log(`[LOG]: ${message}`, context);
    }
  }

  /**
   * Logs informational messages that provide insights into application behavior.
   * Suppressed in production environments.
   *
   * @param message - The message to log.
   * @param context - Optional additional context.
   */
  info(message: string, context?: any): void {
    if (!this.isProduction) {
      console.info(`[INFO]: ${message}`, context);
    }
  }

  /**
   * Logs warnings about potential issues that may require attention.
   * Always logged in all environments.
   *
   * @param message - The warning message.
   * @param context - Optional additional context.
   */
  warn(message: string, context?: any): void {
    console.warn(`[WARN]: ${message}`, context);
  }

  /**
   * Logs errors for critical issues or exceptions.
   * Always logged in all environments.
   *
   * @param message - The error message.
   * @param context - Optional additional context.
   * @security
   * Ensure error messages do not contain sensitive data, such as API keys or user credentials.
   */
  error(message: string, context?: any): void {
    console.error(`[ERROR]: ${message}`, context);
  }
}
