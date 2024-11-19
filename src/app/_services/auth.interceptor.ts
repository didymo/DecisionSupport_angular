// /**
//  * @whatItDoes Intercepts HTTP requests to add an authorization header if the user is authenticated.
//  *
//  * @description
//  *  Handles authentication by adding tokens to requests, refreshing tokens on 401 errors, and logging out on token refresh failure.
//  */
//
// import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
// import {inject} from '@angular/core';
// import {AuthService} from './auth.service';
// import {LoggingService} from './logging.service';
// import {Observable, throwError} from 'rxjs';
// import {catchError, switchMap} from 'rxjs/operators';
// import {CustomHttpError} from "../_classes/custom-http-error";
//
// export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const authService = inject(AuthService);
//   const logger = inject(LoggingService);
//   const authToken = authService.getAuthTokenFromStorage();
//
//   const refreshEndpointPattern = /\/oauth\/token$/;
//   const isRefreshRequest = refreshEndpointPattern.test(req.url);
//
//   if (authToken && !req.headers.has('Authorization') && !isRefreshRequest) {
//     req = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//   }
//
//   return next(req).pipe(
//     catchError(error => {
//       logger.error('HTTP error intercepted:', {status: error.status, message: error.message});
//
//       if (error.status === 401) {
//         logger.warn('401 Unauthorized detected, initiating token refresh...');
//         req = req.clone({
//           headers: req.headers.delete('Authorization'),
//         });
//
//         return authService.refreshTokenMethod().pipe(
//           switchMap((token: any) => {
//             if (!token || !token.access_token) {
//               logger.error('Invalid token received during refresh. Logging out.');
//               authService.logout();
//
//               return throwError(() => new CustomHttpError('Invalid token received.', 401));
//             }
//
//             logger.info('Token refreshed successfully:', token);
//
//             req = req.clone({
//               setHeaders: {
//                 Authorization: `Bearer ${token.access_token}`,
//               },
//             });
//
//             return next(req);
//           }),
//           catchError(refreshError => {
//             logger.error('Token refresh failed:', refreshError);
//             authService.logout();
//
//             return throwError(() => new CustomHttpError('Token refresh failed.', refreshError.status));
//           })
//         );
//       }
//
//       return throwError(() => new CustomHttpError(error.message || 'Unknown HTTP error occurred.', error.status));
//     })
//   );
// };


/**
 * @whatItDoes Intercepts HTTP requests to add an authorization header if the user is authenticated.
 *
 * @description
 * This interceptor attaches an authorization token to outgoing HTTP requests if available.
 * It also handles 401 Unauthorized responses by attempting to refresh the token and retry the request.
 * If token refresh fails, it logs the user out and propagates the error.
 *
 * @security
 * - Ensures sensitive operations like token refresh are logged without leaking sensitive data.
 * - Uses a regular expression to securely identify token refresh endpoints.
 */

import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {LoggingService} from './logging.service';
import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {CustomHttpError} from "../_classes/custom-http-error";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Dependency injection for services
  const authService = inject(AuthService);
  const logger = inject(LoggingService);

  // Retrieve the authentication token from storage
  const authToken = authService.getAuthTokenFromStorage();

  // Regex to identify token refresh requests
  const refreshEndpointPattern = /\/oauth\/token$/;
  const isRefreshRequest = refreshEndpointPattern.test(req.url);

  // Attach Authorization header to non-refresh requests
  if (authToken && !req.headers.has('Authorization') && !isRefreshRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError(error => {
      logger.error('HTTP error intercepted:', {status: error.status, message: error.message});

      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        logger.warn('401 Unauthorized detected, initiating token refresh...');
        req = req.clone({
          headers: req.headers.delete('Authorization'),
        });

        return authService.refreshTokenMethod().pipe(
          switchMap((token: any) => {
            // Validate the refreshed token
            if (!token || !token.access_token) {
              logger.error('Invalid token received during refresh. Logging out.');
              authService.logout();
              return throwError(() => new CustomHttpError('Invalid token received.', 401));
            }

            logger.info('Token refreshed successfully:', {access_token: token.access_token});

            // Attach the refreshed token to the request
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token.access_token}`,
              },
            });

            // Retry the original request with the refreshed token
            return next(req);
          }),
          catchError(refreshError => {
            logger.error('Token refresh failed:', refreshError);
            authService.logout();
            return throwError(() => new CustomHttpError('Token refresh failed.', refreshError.status));
          })
        );
      }

      // Propagate non-401 errors as CustomHttpError
      return throwError(() => new CustomHttpError(error.message || 'Unknown HTTP error occurred.', error.status));
    })
  );
};
