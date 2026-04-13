import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Allows access only to authenticated users with the process_builder role.
// Unauthenticated users are redirected to /user/login; authenticated users
// without the role are redirected to /home.
// User info is loaded on demand if not yet available (e.g. hard page reload).
export const processBuilderGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/user/login']);
  }

  if (!authService.getUserInfo()) {
    await authService.loadUserInfo();
  }

  const roles = authService.getUserInfo()?.roles ?? [];
  if (roles.includes('process_builder')) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
