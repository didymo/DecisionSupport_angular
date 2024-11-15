/**
 * @whatItDoes Represents a single Process retrieved from backend to be listed in an array.
 *
 * @description
 *  Stores the data of a single Process retrieved from the list of Processes.
 *
*/
import DOMPurify from "dompurify";

export class ProcessList {
  constructor(
    label: string,
    entityId: number,
    revisionCreationTime: string,
    revisionStatus: string,
    createdTime: string,
    updatedTime: string,
    enabled: boolean
  ) {
    this.label = this.sanitize(label);
    this.entityId = entityId;
    this.revisionCreationTime = revisionCreationTime;
    this.revisionStatus = revisionStatus;
    this.createdTime = createdTime;
    this.updatedTime = updatedTime;
    this.enabled = enabled;
  }
  /**
   * The title of the Process
   */
  label: string;

  /**
   * The ID assigned by Drupal for the Process
   */
  entityId: number;

  /**
   *
   */
  revisionCreationTime: string;

  /**
   * Determines the status of the Process (i.e, draft, archived, published)
   */
  revisionStatus: string;

  /**
   * Time when the Process was created.
   */
  createdTime: string;

  /**
  * Time when the Process was updated.
  */
  updatedTime: string;

  /**
   * Is process enabled or disabled
   */
  enabled: boolean;

/**
 * Sanitizes the input string to prevent XSS (Cross-Site Scripting) attacks.
 *
 * This method uses DOMPurify to remove any potentially harmful HTML or
 * JavaScript content from the input. It is designed to protect against
 * XSS vulnerabilities by ensuring that only safe, sanitized content is stored.
 *
 * @param input - The unsanitized user-provided or external input string.
 * @returns A sanitized string safe for insertion into the DOM.
 *
 * Note: DOMPurify is a trusted library for client-side sanitization
 * and is configured here with default settings.
 */
  private sanitize(input: string): string {
    return DOMPurify.sanitize(input); // DOMPurify will sanitize the input string
  }

}
