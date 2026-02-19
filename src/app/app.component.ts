/**
 * @whatItDoes Root Component
 *
 * @description The main container for the site, this component is always there. It includes Menu Component for navigation.
 *
 */

import { Component, inject } from '@angular/core';

import {RouterModule, RouterOutlet, Router} from '@angular/router';
import {MenuComponent} from './_components/menu/menu.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterModule, MenuComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  router = inject(Router);

  title = 'Decision Support';
}
