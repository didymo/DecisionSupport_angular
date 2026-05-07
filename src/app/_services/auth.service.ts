import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthConfig } from './auth-config';
import { AuthTokenSet } from './auth-token-set';
import { PkceTransaction } from './pkce-transaction';
import { TokenResponse } from './token-response';
import { UserInfo } from './user-info';
import { PkceService } from './pkce.service';

const STORAGE_KEYS = {
  tokenSet: 'dsd.auth.token-set',
  pkceTransaction: 'dsd.auth.pkce-transaction'
} as const;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly pkce = inject(PkceService);

  private readonly config: AuthConfig = environment.auth;
  private readonly tokenSetSignal = signal<AuthTokenSet | null>(null);
  private readonly userInfoSignal = signal<UserInfo | null>(null);

  readonly tokenSet = this.tokenSetSignal.asReadonly();
  readonly userInfo = this.userInfoSignal.asReadonly();

  readonly isAuthenticated = computed(() => {
    const tokenSet = this.tokenSetSignal();
    return !!tokenSet && !this.isExpired(tokenSet);
  });

  constructor() {
    this.restoreTokenSet();
    // If a valid token was restored (e.g. page reload), load user info so that
    // role-based guards and menu visibility work without a fresh login.
    // Deferred with queueMicrotask to avoid NG0200: authInterceptor calls
    // inject(AuthService) per-request, which cycles back here if the HTTP call
    // is made synchronously while AuthService is still being constructed.
    if (this.isAuthenticated()) {
      queueMicrotask(() => void this.loadUserInfo());
    }
  }

  async startLogin(): Promise<void> {
    const state = this.pkce.createState();
    const { verifier, challenge } = await this.pkce.createVerifierAndChallenge();

    const transaction: PkceTransaction = { state, verifier, createdAt: Date.now() };
    sessionStorage.setItem(STORAGE_KEYS.pkceTransaction, JSON.stringify(transaction));
    window.location.assign(this.buildAuthorizeUrl(state, challenge));
  }

  async handleCallback(searchParams: URLSearchParams): Promise<void> {
    const callbackError = searchParams.get('error');
    if (callbackError) {
      const description = searchParams.get('error_description') ?? 'Authorization failed.';
      console.error(`OAuth callback error: ${callbackError}: ${description}`);
      await this.router.navigate(['/user/login']);
      return;
    }

    const code = searchParams.get('code');
    const returnedState = searchParams.get('state');
    const transaction = this.getTransaction();

    if (!code || !returnedState || !transaction) {
      console.error('Missing callback parameters or PKCE transaction.');
      await this.router.navigate(['/user/login']);
      return;
    }

    if (transaction.state !== returnedState) {
      console.error('State mismatch — possible CSRF attempt.');
      await this.router.navigate(['/user/login']);
      return;
    }

    try {
      const tokenResponse = await this.exchangeCode(code, transaction.verifier);
      this.saveTokenSet(tokenResponse);
      this.clearTransaction();
      await this.loadUserInfo();
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Token exchange failed:', error);
      await this.router.navigate(['/user/login']);
    }
  }

  // Used by the interceptor for silent token refresh.
  refreshTokenMethod(): Observable<TokenResponse> {
    const tokenSet = this.tokenSetSignal();
    if (!tokenSet?.refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    const body = new HttpParams({
      fromObject: {
        grant_type: 'refresh_token',
        client_id: this.config.clientId,
        refresh_token: tokenSet.refreshToken
      }
    });

    return this.http.post<TokenResponse>(this.tokenUrl, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      tap(response => this.saveTokenSet(response, tokenSet))
    );
  }

  async loadUserInfo(): Promise<void> {
    const tokenSet = this.tokenSetSignal();
    if (!tokenSet) return;

    try {
      const userInfo = await this.http.get<UserInfo>(this.userInfoUrl, {
        headers: new HttpHeaders({ Authorization: `Bearer ${tokenSet.accessToken}` })
      }).toPromise();

      if (userInfo) {
        this.userInfoSignal.set(userInfo);
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  }

  async logout(): Promise<void> {
    const tokenSet = this.tokenSetSignal();
    const sessionLogoutUrl = this.buildSessionLogoutUrl();
    try {
      await this.http.post(this.logoutUrl, null, {
        headers: tokenSet ? new HttpHeaders({ Authorization: `Bearer ${tokenSet.accessToken}` }) : undefined,
        withCredentials: true
      }).toPromise();
    } catch {
      // Continue with local logout even if server logout fails.
    } finally {
      this.clearLocalSession();
      window.location.replace(sessionLogoutUrl);
    }
  }

  // Kept for backward compatibility with existing services.
  getToken(): string | null {
    return this.tokenSetSignal()?.accessToken ?? null;
  }

  getAuthTokenFromStorage(): string | null {
    return this.getToken();
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  getPOSTFileUploadHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token available.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.api+json'
    });
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getUserInfo(): UserInfo | null {
    return this.userInfoSignal();
  }

  private get tokenUrl(): string {
    return `${this.config.issuerBaseUrl}${this.config.tokenEndpoint}`;
  }

  private get userInfoUrl(): string {
    return `${this.config.issuerBaseUrl}${this.config.userInfoEndpoint}`;
  }

  private get logoutUrl(): string {
    return `${this.config.issuerBaseUrl}${this.config.logoutEndpoint}`;
  }

  private buildSessionLogoutUrl(): string {
    const params = new URLSearchParams({
      return_to: this.config.logoutRedirectUri,
    });
    return `${this.config.issuerBaseUrl}${this.config.logoutSessionEndpoint}?${params.toString()}`;
  }

  private buildAuthorizeUrl(state: string, challenge: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      prompt: 'login'
    });
    return `${this.config.issuerBaseUrl}${this.config.authorizeEndpoint}?${params.toString()}`;
  }

  private async exchangeCode(code: string, verifier: string): Promise<TokenResponse> {
    const body = new HttpParams({
      fromObject: {
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        code,
        redirect_uri: this.config.redirectUri,
        code_verifier: verifier
      }
    });

    return this.http.post<TokenResponse>(this.tokenUrl, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).toPromise() as Promise<TokenResponse>;
  }

  private saveTokenSet(response: TokenResponse, current: AuthTokenSet | null = null): void {
    const scopes = this.resolveScopes(response.scope, current);
    const tokenSet: AuthTokenSet = {
      tokenType: response.token_type,
      accessToken: response.access_token,
      refreshToken: response.refresh_token ?? current?.refreshToken ?? null,
      idToken: response.id_token ?? current?.idToken ?? null,
      expiresIn: response.expires_in,
      issuedAt: Date.now(),
      scopes
    };
    this.tokenSetSignal.set(tokenSet);
    localStorage.setItem(STORAGE_KEYS.tokenSet, JSON.stringify(tokenSet));
  }

  private restoreTokenSet(): void {
    const stored = localStorage.getItem(STORAGE_KEYS.tokenSet);
    if (!stored) return;
    try {
      const tokenSet = JSON.parse(stored) as AuthTokenSet;
      if (!this.isExpired(tokenSet)) {
        this.tokenSetSignal.set(tokenSet);
      } else {
        localStorage.removeItem(STORAGE_KEYS.tokenSet);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.tokenSet);
    }
  }

  private clearLocalSession(): void {
    this.tokenSetSignal.set(null);
    this.userInfoSignal.set(null);
    localStorage.removeItem(STORAGE_KEYS.tokenSet);
    sessionStorage.removeItem(STORAGE_KEYS.pkceTransaction);
  }

  private getTransaction(): PkceTransaction | null {
    const stored = sessionStorage.getItem(STORAGE_KEYS.pkceTransaction);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as PkceTransaction;
    } catch {
      return null;
    }
  }

  private clearTransaction(): void {
    sessionStorage.removeItem(STORAGE_KEYS.pkceTransaction);
  }

  private isExpired(tokenSet: AuthTokenSet): boolean {
    return Date.now() >= tokenSet.issuedAt + tokenSet.expiresIn * 1000;
  }

  private resolveScopes(scope: TokenResponse['scope'], current: AuthTokenSet | null): string[] {
    if (Array.isArray(scope)) return scope;
    if (typeof scope === 'string') {
      const scopes = scope.split(' ').filter(s => s.length > 0);
      if (scopes.length > 0) return scopes;
    }
    return current?.scopes ?? [...this.config.scopes];
  }
}
