import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";

@Component({
    selector: 'app-home',
    imports: [
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
