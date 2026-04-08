import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

// TODO: Role-based route restrictions (process routes vs support routes) require
// role claims in the OIDC userinfo or access token. Configure Simple OAuth to
// include role claims, then restore fine-grained role checks here.
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    void this.router.navigate(['/user/login']);
    return false;
  }
}

