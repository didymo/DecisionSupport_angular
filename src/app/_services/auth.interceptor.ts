/**
 * @whatItDoes Intercepts HTTP requests to add an authorization header if the user is authenticated.
 *
 * @description
 *  Handles authentication by adding tokens to requests, refreshing tokens on 401 errors, and logging out on token refresh failure.
 */


import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const authToken = authService.getAuthTokenFromStorage();
  // Check if this is a token refresh request
  const isRefreshRequest = req.url.includes('/oauth/token'); // adjust URL pattern as needed

  // Only add auth header for non-refresh requests
  if (authToken && !req.headers.has('Authorization') && !isRefreshRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  // if (authToken) {
  //   req = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${authToken}`
  //     }
  //   });
  // }

  // if (authToken && !req.headers.has('Authorization')) {
  //   req = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${authToken}`
  //     }
  //   });
  // }


  return next(req).pipe(
    catchError(error => {
      console.log('Caught error:', error); // Log the error

      if (error.status === 401) {
        console.log('401 error detected, attempting to refresh token'); // Log the detection of a 401 error
        req.headers.delete('Authorization');

        return authService.refreshTokenMethod().pipe(
            // tap(() => console.log('Starting token refresh process...')), // Add a starting log

          switchMap((token: any) => {

            console.log('Entering switchMap after token refresh'); // Log entry into switchMap
            console.log('Token refreshed:', token); // Log the new token

            // Call setTokens with the new access and refresh tokens
            authService.setTokens(token.access_token, token.refresh_token);
            req.headers.keys().forEach(key => {
              console.log(`${key}:`, req.headers.get(key));
            });
            // if (token.access_token && !req.headers.has('Authorization')) {
               if (token.access_token) {
              // Log before updating the request with the refreshed token
              console.log('Setting Authorization header with new access token');

              // Ensure the cloned request has the refreshed access token
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token.access_token}`
                }
              });
            }

            return next(req);  // Ensure an Observable is returned here
          }),
          catchError(err => {
            console.log('Token refresh failed, logging out', err); // Log the refresh failure
            authService.logout();
            return throwError(err);
          })
        );
      }

      return throwError(error);
    })
  );
};
