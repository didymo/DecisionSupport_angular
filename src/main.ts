import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideRouter} from '@angular/router';
import {appRoutes} from './app/app.routes';
import {authInterceptor} from "./app/_services/auth.interceptor";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideQuillConfig} from 'ngx-quill/config';

// Define secure Quill configuration
const SECURE_QUILL_CONFIG = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
      matchers: [
        ['p', {'class': null}]
      ]
    },
    keyboard: {
      bindings: {
        'list autofill': undefined,
        'html paste': undefined
      }
    }
  },
  formats: [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ],
  sanitize: true,
  theme: 'snow'
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(appRoutes), provideAnimationsAsync(),
    provideQuillConfig(SECURE_QUILL_CONFIG),
  ],
}).catch(err => console.error(err));
