/**
 * @whatItDoes Manages CSRF tokens allowing the user to be authenticated through being logged-in.
 *
 * @description
 *  Deals with tokens and provides services for other components to access and confirm authentication.
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public refreshToken: string | null = null;
  public isRefreshing = false;
  private authToken: string | null = null;
  private csrfToken: string | null = null;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
  }


  login(username: string, password: string): Observable<any> {
    const url = environment.apiUrl;
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', environment.clientId);
    body.set('client_secret', environment.clientSecret);
    body.set('username', username);
    body.set('password', password);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post(url, body.toString(), options).pipe(
      tap((res: any) => {
        console.log('Login response:', res); // Log the entire response
        if (res.access_token && res.refresh_token) {
          this.setTokens(res.access_token, res.refresh_token);
          this.getUserData();
        } else {
          console.error('Tokens not found in response');
        }
      }),
      switchMap(() => this.getCsrfToken()),
      catchError(this.handleError)
    );
  }

  setTokens(accessToken: string, refreshToken: string): void {

    console.log('Setting tokens with values:', {accessToken, refreshToken});

    if (accessToken && refreshToken) {
      this.authToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      console.log('Tokens set:', {accessToken, refreshToken});
    } else {
      console.error('Invalid tokens provided:', {accessToken, refreshToken});
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getAuthTokenFromStorage(): string | null {
    return this.getToken();
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role')
  }

  getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });

    if (this.csrfToken) {
      headers.append('X-CSRF-Token', this.csrfToken);
    }

    return headers;
  }

  getPOSTFileUploadHeaders(): HttpHeaders {
    const token = this.getToken();
    const csrfToken = this.getCsrfTokenFromStorage();
    if (!token || !csrfToken) {
      throw new Error('Authentication tokens are missing');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.api+json',
      'X-CSRF-Token': csrfToken
    });
  }

  getCsrfTokenFromStorage(): string | null {
    if (!this.csrfToken) {
      this.csrfToken = localStorage.getItem('csrf_token');
    }
    return this.csrfToken;
  }

  refreshTokenMethod(): Observable<any> {

    console.log('Attempting to refresh token'); // Log start of token refresh


    this.refreshToken = localStorage.getItem("refresh_token")
    const url = environment.apiUrl;

    // const formData = new FormData();
    // formData.append('grant_type', 'refresh_token');
    // formData.append('refresh_token', this.refreshToken || '');
    // formData.append('client_id', environment.clientId);
    // formData.append('client_secret', environment.clientSecret);

    // Attempting different format of the body
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', environment.clientId);
    body.set('client_secret', environment.clientSecret);
    body.set('refresh_token', this.refreshToken || '');

    // body.set('refresh_token', this.refreshToken as string);
    // console.log('Refresh token:', this.refreshToken);
    // console.log('Requesting token refresh at URL:', url);
    // console.log('Request body:', body.toString());

    // const body = {
    //   grant_type: 'refresh_token',
    //   client_id: environment.clientId,
    //   client_secret: environment.clientSecret,
    //   refresh_token: this.refreshToken || ''
    // };


    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'Content-Type': 'application/json'
      })
    };

    // return this.http.post(url, body.toString(), options).pipe(
    //   tap((res: any) => this.setTokens(res.access_token, res.refresh_token)),
    //   catchError(this.handleError)
    // );
    return this.http.post(url, body.toString(), options).pipe(
    // return this.http.post(url, formData, options).pipe(
      tap((res: any) => {
        console.log('Token refresh response received:', res); // Log response
        this.setTokens(res.access_token, res.refresh_token);
      }),
      catchError(error => {
        console.error('Token refresh failed with error:', error.message);
        console.error('Error in token refresh:', error); // Log the error in detail
        return throwError(error);
      })
    );
  }

  logout(): void {
    this.authToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('csrf_token');
    this.router.navigate(['/user/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getTokenSubject(): BehaviorSubject<string | null> {
    return this.tokenSubject;
  }

  //Check user data and role. by default user will have user role
  private getUserData() {
    const headers = this.getHeaders();
    return this.http.get<any>(environment.getUserDataUrl, {headers})
      .subscribe(
        (response) => {
          let roles = ['user'];// default role
          if (response.roles && response.roles.length > 0) {
            roles = response.roles.map((role: any) => role.target_id);
          }
          // Set user roles in local storage
          localStorage.setItem("user_role", JSON.stringify(roles));
        },
        (error) => {
          // Log error and set default role
          localStorage.setItem("user_role", JSON.stringify(['user']));
          console.error("Error fetching user data:", error);
        }
      );
  }

  private getCsrfToken(): Observable<string> {
    if (this.csrfToken) {
      return of(this.csrfToken);
    }
    const url = environment.csrfTokenUrl;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    return this.http.get(url, {responseType: 'text', headers}).pipe(
      tap((token: string) => {
        this.csrfToken = token;
        localStorage.setItem('csrf_token', token);
        console.log('CSRF token set:', token);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    this.logout();
    return throwError(() => new Error('Something went wrong; please try again later.'));

  }
}
