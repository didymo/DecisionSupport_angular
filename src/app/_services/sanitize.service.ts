import { Injectable } from '@angular/core';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class SanitizeService {

  constructor() { }

    sanitize(input: string): string {
    return DOMPurify.sanitize(input);
  }
}
