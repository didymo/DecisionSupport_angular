// import { CustomHttpError } from './custom-http-error';
//
// describe('CustomHttpError', () => {
//   it('should create an instance', () => {
//     expect(new CustomHttpError()).toBeTruthy();
//   });
// });
import {CustomHttpError} from './custom-http-error';

describe('CustomHttpError', () => {
  it('should create an instance with a message and timestamp', () => {
    const error = new CustomHttpError('Test error message', 404);

    expect(error).toBeTruthy();
    expect(error.message).toBe('Test error message');
    expect(error.timestamp).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('should default status to undefined if not provided', () => {
    const error = new CustomHttpError('Test error message');

    expect(error.status).toBeUndefined();
  });
});
