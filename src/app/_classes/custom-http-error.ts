/**
 * A custom error class to represent HTTP errors with additional metadata.
 */
export class CustomHttpError extends Error {
  timestamp: number;
  status?: number;

  constructor(message: string, status?: number) {
    super(message); // Call the parent class constructor with the message
    this.timestamp = Date.now(); // Add a timestamp for when the error was created
    this.status = status; // Optional HTTP status code
  }
}
