/**
 * @whatItDoes Allows a route to be activated and accessible if the user is authenticated.
 *
 * @description
 * Provides authentication.
 *
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';

/**
 * @whatItDoes Protects routes by ensuring that only authenticated and authorized users can access them.
 *
 * @description
 * The `AuthGuard` checks if the user is authenticated and determines their access based on their role.
 * It redirects unauthorized or unauthenticated users to appropriate routes.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * Constructor to inject dependencies required for authentication and navigation.
   *
   * @param authService - Service that handles authentication and user role management.
   * @param router - Router instance used for redirection.
   */
  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * Determines if a route can be activated based on user authentication and roles.
   *
   * @param route - The `ActivatedRouteSnapshot` representing the route being accessed.
   * @returns true if the route can be activated, false otherwise.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    try {
      // Check if the user is logged in.
      const isLoggedIn = this.authService.isLoggedIn();
      const userRole = this.authService.getUserRole();

      if (isLoggedIn) {
        // Redirect to login if userRole is undefined or null (unexpected scenario).
        if (!userRole) {
          console.warn('User role is undefined or null. Redirecting to login.');
          this.router.navigate(['/user/login']);
          return false;
        }

        // Grant access if the user has an administrator role.
        if (userRole.includes('administrator')) {
          return true;
        }

        // Define restricted paths for regular users.
        const restrictedPaths = ['process', 'process/:id'];

        // Restrict access to specific paths for regular users.
        if (
          userRole.includes('user') &&
          restrictedPaths.includes(route.routeConfig?.path || '')
        ) {
          console.warn('Access denied: Regular user attempting to access restricted route.');
          this.router.navigate(['/home']);
          return false;
        }

        // Allow access for authenticated users with no restrictions.
        return true;
      } else {
        // Redirect unauthenticated users to the login page.
        console.warn('User is not authenticated. Redirecting to login.');
        this.router.navigate(['/user/login']);
        return false;
      }
    } catch (error) {
      // Handle unexpected errors by redirecting to a generic error page.
      console.error('Error during route activation check:', error);
      this.router.navigate(['/error']);
      return false;
    }
  }
}

