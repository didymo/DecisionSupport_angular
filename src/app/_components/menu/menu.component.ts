/**
 * @whatItDoes Allows navigation between pages on the site.
 *
 * @description
 *  Provides navigation between the following pages: login/out, process creator, decision support.
 */

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { NgIf, NgOptimizedImage } from "@angular/common";
import { AuthService } from "../../_services/auth.service";
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, MatToolbar, CommonModule, NgIf, NgOptimizedImage, MatIconModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  constructor(protected authService: AuthService,public router: Router){}

  logout(): void {
    this.authService.logout();
  }
  isActive(route: string): boolean{
    return this.router.url === route;
  }
  isAdmin(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? userRole.includes('administrator') : false; 
  }
}

