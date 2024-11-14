/**
 * @whatItDoes Root Component
 *
 * @description The main container for the site, this component is always there. It includes Menu Component for navigation.
 *
 */

import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, RouterOutlet, Router} from '@angular/router';
import {MenuComponent} from './_components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(public router: Router){}
  title = 'Decision Support';
}
