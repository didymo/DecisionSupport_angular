import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { AuthService } from '../../_services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MenuComponent,
    NgIf,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  textToType = 'Welcome to Decision Support Software'; 
  displayText = ''; 
  typingSpeed = 100; 

  ngOnInit(): void {
    this.startTypingEffect();
  }

  startTypingEffect() {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.textToType.length) {
        this.displayText += this.textToType.charAt(index);
        index++;
      } else {
        clearInterval(interval); 
      }
    }, this.typingSpeed);
  }
}
