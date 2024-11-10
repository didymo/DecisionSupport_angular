// import { TestBed } from '@angular/core/testing';
// import { HttpInterceptorFn } from '@angular/common/http';
//
// import { authInterceptor } from './auth.interceptor';
//
// describe('authInterceptor', () => {
//   const interceptor: HttpInterceptorFn = (req, next) =>
//     TestBed.runInInjectionContext(() => authInterceptor(req, next));
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });
//
//   it('should be created', () => {
//     expect(interceptor).toBeTruthy();
//   });
// });
/////// Above is the inital code

////// Below is the testing code.


import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';
import { of, throwError } from 'rxjs';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a spy object for AuthService
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getAuthTokenFromStorage',
      'refreshTokenMethod',
      'setTokens',
      'logout'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpTestingController.verify();
  });

  it('should add Authorization header for non-refresh requests when token exists', (done) => {
    // Arrange
    const mockToken = 'mock-token';
    authService.getAuthTokenFromStorage.and.returnValue(mockToken);

    // Act
    httpClient.get('/api/data').subscribe({
      next: (response) => {
        // Assert
        expect(response).toBeTruthy();
        done();
      },
      error: done.fail
    });

    // Assert
    const httpRequest = httpTestingController.expectOne('/api/data');
    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    // Complete the request
    httpRequest.flush({ data: 'test' });
  });

  it('should not add Authorization header for refresh token requests', (done) => {
    // Arrange
    const mockToken = 'mock-token';
    authService.getAuthTokenFromStorage.and.returnValue(mockToken);

    // Act
    httpClient.post('/oauth/token', {}).subscribe({
      next: (response) => {
        // Assert
        expect(response).toBeTruthy();
        done();
      },
      error: done.fail
    });

    // Assert
    const httpRequest = httpTestingController.expectOne('/oauth/token');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();

    // Complete the request
    httpRequest.flush({ access_token: 'new-token', refresh_token: 'new-refresh-token' });
  });

  it('should handle 401 error and refresh token', (done) => {
    // Arrange
    const mockToken = 'mock-token';
    const newToken = { access_token: 'new-token', refresh_token: 'new-refresh-token' };
    authService.getAuthTokenFromStorage.and.returnValue(mockToken);
    authService.refreshTokenMethod.and.returnValue(of(newToken));

    // Act
    httpClient.get('/api/data').subscribe({
      next: (response) => {
        // Assert
        expect(response).toBeTruthy();
        expect(authService.setTokens).toHaveBeenCalledWith(newToken.access_token, newToken.refresh_token);
        done();
      },
      error: done.fail
    });

    // Simulate 401 error
    const firstRequest = httpTestingController.expectOne('/api/data');
    firstRequest.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    // Handle the retry request after token refresh
    const retryRequest = httpTestingController.expectOne('/api/data');
    expect(retryRequest.request.headers.get('Authorization')).toBe(`Bearer ${newToken.access_token}`);
    retryRequest.flush({ data: 'test' });
  });

  it('should logout on token refresh failure', (done) => {
    // Arrange
    const mockToken = 'mock-token';
    authService.getAuthTokenFromStorage.and.returnValue(mockToken);
    authService.refreshTokenMethod.and.returnValue(throwError(() => new Error('Refresh failed')));

    // Act
    httpClient.get('/api/data').subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        // Assert
        expect(authService.logout).toHaveBeenCalled();
        done();
      }
    });

    // Simulate 401 error
    const request = httpTestingController.expectOne('/api/data');
    request.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
