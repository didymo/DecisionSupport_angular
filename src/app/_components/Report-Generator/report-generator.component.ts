import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {NgIf} from "@angular/common";
import { AuthService } from '../../_services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './report-generator.component.html',
  /* template: `
     <section>
       <form>
         <input type="text" placeholder="Filter by city">
         <button class="primary" type="button">Search</button>
       </form>
     </section>
 `, */
  styleUrl: './report-generator.component.scss'
})

export class ReportGeneratorComponent {

}
/*export class AuthenticateComponent {
  username: string = '';
  password: string = '';

  constructor(protected authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.setTokens(res.access_token, res.refresh_token);
        this.router.navigate(['/support']);
      },
      error: (err) => {
        console.error('Login error', err);
        alert('Login failed. Please check your username and password.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
} */
