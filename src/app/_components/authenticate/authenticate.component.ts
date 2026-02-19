/**
 * @whatItDoes Component for logging in and out.
 *
 * @description
 *  This component provides an authentication screen for the user. It's the first screen they see in DecisionSupport and they will be sent here if they ever aren't authenticated.
 */

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

//
@Component({
    selector: 'app-authenticate',
    imports: [RouterModule, FormsModule, MatFormField, MatInputModule, MatButtonModule, NgOptimizedImage],
    templateUrl: './authenticate.component.html',
    styleUrl: './authenticate.component.scss'
})

export class AuthenticateComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.setTokens(res.access_token, res.refresh_token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Login failed. Please check your username and password.');
      }
    });
  }

}
