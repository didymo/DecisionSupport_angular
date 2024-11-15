import {Injectable} from '@angular/core';
import DOMPurify from 'dompurify';

/**
 * @whatItDoes Provides utility methods to sanitize user-provided input to prevent XSS attacks.
 *
 * @description
 * The `SanitizeService` wraps the DOMPurify library to sanitize strings, ensuring that potentially
 * malicious code (e.g., scripts or unsafe HTML tags) cannot be injected into the application.
 *
 * This service is particularly useful for protecting user input displayed in the DOM or processed
 * by the application.
 */
@Injectable({
  providedIn: 'root'
})
export class SanitizeService {

  /**
   * The constructor is explicitly defined for clarity, even if it is not used.
   *
   * @whyItExists
   * - Angular dependency injection may require initialization in the future.
   * - Maintains consistency across services.
   */
  constructor() {
  }

  /**
   * Sanitizes a given input string to remove potentially harmful code.
   *
   * @param input - The string to be sanitized.
   * @returns A sanitized string, with all unsafe HTML tags removed.
   *
   * @example
   * const sanitized = sanitizeService.sanitize('<script>alert("xss")</script>Hello');
   * console.log(sanitized); // Outputs: 'Hello'
   */
  sanitize(input: string): string {
    // Configure DOMPurify to strip tags completely
    return DOMPurify.sanitize(input, {ALLOWED_TAGS: []});
  }
}
