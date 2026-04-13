/**
 * @whatItDoes Allows navigation between pages on the site.
 *
 * @description
 *  Provides navigation between the following pages: login/out, process creator, decision support.
 */

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from "@angular/common";
import { AuthService } from "../../_services/auth.service";
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-menu',
    imports: [RouterModule, MatToolbar, CommonModule, NgOptimizedImage, MatIconModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {
  protected authService = inject(AuthService);
  router = inject(Router);


  logout(): void {
    void this.authService.logout();
  }
  isActive(route: string): boolean{
    return this.router.url === route;
  }
  isAdmin(): boolean {
    return this.authService.userInfo()?.roles?.includes('process_builder') ?? false;
  }
}

