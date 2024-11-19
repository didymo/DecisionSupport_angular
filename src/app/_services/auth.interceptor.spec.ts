import {TestBed} from '@angular/core/testing';
import {HttpRequest} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {authInterceptor} from './auth.interceptor';
import {AuthService} from './auth.service';
import {LoggingService} from './logging.service';
import {CustomHttpError} from '../_classes/custom-http-error';

/**
 * @whatItDoes Tests the AuthInterceptor's ability to handle authentication and HTTP requests securely.
 *
 * @description
 * These tests validate that the AuthInterceptor:
 * - Adds an Authorization header when a token is available.
 * - Handles 401 Unauthorized errors by refreshing the token.
 * - Logs users out on token refresh failure.
 * - Propagates non-401 errors securely with a CustomHttpError.
 *
 * @security
 * - Ensures token handling processes do not expose sensitive information.
 * - Verifies that logs adhere to secure logging practices.
 */

describe('AuthInterceptor Security and Functionality Tests', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let logger: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthTokenFromStorage', 'refreshTokenMethod', 'logout']);
    const loggerSpy = jasmine.createSpyObj('LoggingService', ['log', 'info', 'warn', 'error']);

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: LoggingService, useValue: loggerSpy},
      ],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    logger = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  describe('Token Injection', () => {
    it('should add Authorization header if token is available and request is not a refresh request', (done) => {
      const mockRequest = new HttpRequest('GET', '/api/resource');
      const mockHandler = jasmine.createSpyObj('HttpHandlerFn', ['handle']);
      mockHandler.handle.and.returnValue(of({}));

      authService.getAuthTokenFromStorage.and.returnValue('mock-token');

      TestBed.runInInjectionContext(() => {
        authInterceptor(mockRequest, mockHandler.handle).subscribe(() => {
          const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
          expect(interceptedRequest.headers.get('Authorization')).toBe('Bearer mock-token');
          done();
        });
      });
    });

    it('should not add Authorization header to token refresh requests', (done) => {
      const mockRequest = new HttpRequest<any>('POST', '/oauth/token', {}); // Include empty body
      const mockHandler = jasmine.createSpyObj('HttpHandlerFn', ['handle']);
      mockHandler.handle.and.returnValue(of({}));

      authService.getAuthTokenFromStorage.and.returnValue('mock-token');

      TestBed.runInInjectionContext(() => {
        authInterceptor(mockRequest, mockHandler.handle).subscribe(() => {
          const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
          expect(interceptedRequest.headers.has('Authorization')).toBeFalse();
          done();
        });
      });
    });
  });

  describe('Error Handling and Security', () => {
    it('should handle 401 Unauthorized errors by refreshing the token', (done) => {
      const mockRequest = new HttpRequest('GET', '/api/resource');
      const mockHandler = jasmine.createSpyObj('HttpHandlerFn', ['handle']);
      mockHandler.handle.and.returnValues(
        throwError(() => ({status: 401})),
        of({}) // Mock the retried request
      );

      authService.refreshTokenMethod.and.returnValue(of({access_token: 'new-token'}));

      TestBed.runInInjectionContext(() => {
        authInterceptor(mockRequest, mockHandler.handle).subscribe(() => {
          const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
          expect(interceptedRequest.headers.get('Authorization')).toBe('Bearer new-token');
          expect(logger.warn).toHaveBeenCalledWith('401 Unauthorized detected, initiating token refresh...');
          done();
        });
      });
    });

    it('should log out the user if token refresh fails', (done) => {
      const mockRequest = new HttpRequest('GET', '/api/resource');
      const mockHandler = jasmine.createSpyObj('HttpHandlerFn', ['handle']);
      mockHandler.handle.and.returnValue(throwError(() => ({status: 401})));

      authService.refreshTokenMethod.and.returnValue(throwError(() => new CustomHttpError('Token refresh failed.', 401)));

      TestBed.runInInjectionContext(() => {
        authInterceptor(mockRequest, mockHandler.handle).subscribe({
          error: (err) => {
            expect(authService.logout).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalledWith('Token refresh failed:', jasmine.any(CustomHttpError));
            expect(err).toEqual(jasmine.any(CustomHttpError));
            done();
          },
        });
      });
    });

    it('should propagate non-401 errors as CustomHttpError', (done) => {
      const mockRequest = new HttpRequest<any>('GET', '/test-endpoint');
      const mockHandler = {
        handle: jasmine.createSpy().and.returnValue(throwError(() => ({
          status: 500,
          message: 'Internal Server Error',
        }))),
      };

      TestBed.runInInjectionContext(() => {
        authInterceptor(mockRequest, mockHandler.handle).subscribe({
          next: () => {
            fail('Expected error, but got success.');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(CustomHttpError);
            expect(error.message).toBe('Internal Server Error');
            expect(error.status).toBe(500);
            expect(logger.error).toHaveBeenCalledWith(
              'HTTP error intercepted:',
              {status: 500, message: 'Internal Server Error'}
            );
            done();
          },
        });
      });
    });
  });
});
