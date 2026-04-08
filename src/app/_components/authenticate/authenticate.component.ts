/**
 * @whatItDoes Component for logging in and out.
 *
 * @description
 *  This component provides an authentication screen for the user. It's the first screen they see in DecisionSupport and they will be sent here if they ever aren't authenticated.
 */

import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-authenticate',
  imports: [MatButtonModule, NgOptimizedImage],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.scss'
})
export class AuthenticateComponent {
  private readonly authService = inject(AuthService);

  login(): void {
    void this.authService.startLogin();
  }
}
