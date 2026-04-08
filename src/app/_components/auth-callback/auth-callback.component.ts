import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss',
})
export class AuthCallbackComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    void this.processCallback();
  }

  private async processCallback(): Promise<void> {
    const searchParams = new URLSearchParams(window.location.search);
    await this.authService.handleCallback(searchParams);
  }
}
