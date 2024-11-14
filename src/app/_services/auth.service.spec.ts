// import { TestBed } from '@angular/core/testing';
//
// import { AuthService } from './auth.service';
//
// describe('AuthService', () => {
//   let service: AuthService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(AuthService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle successful login', (done) => {
    const mockCredentials = { username: 'test', password: 'test123' };
    const mockResponse = {
      access_token: 'test-token',
      refresh_token: 'refresh-token'
    };
    const mockCsrfToken = 'csrf-token';

    service.login(mockCredentials.username, mockCredentials.password).subscribe(() => {
      expect(localStorage.getItem('access_token')).toBe(mockResponse.access_token);
      expect(localStorage.getItem('refresh_token')).toBe(mockResponse.refresh_token);
      expect(localStorage.getItem('csrf_token')).toBe(mockCsrfToken);
      done();
    });

    // Handle login request
    const loginReq = httpMock.expectOne(environment.apiUrl);
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush(mockResponse);

    // Handle CSRF token request
    const csrfReq = httpMock.expectOne(environment.csrfTokenUrl);
    expect(csrfReq.request.method).toBe('GET');
    csrfReq.flush(mockCsrfToken);

    // Handle user data request
    const userDataReq = httpMock.expectOne(environment.getUserDataUrl);
    expect(userDataReq.request.method).toBe('GET');
    userDataReq.flush({ roles: [{ target_id: 'user' }] });
  });

  it('should handle token refresh', (done) => {
    const mockResponse = {
      access_token: 'new-token',
      refresh_token: 'new-refresh-token'
    };

    localStorage.setItem('refresh_token', 'old-refresh-token');

    service.refreshTokenMethod().subscribe(() => {
      expect(localStorage.getItem('access_token')).toBe(mockResponse.access_token);
      expect(localStorage.getItem('refresh_token')).toBe(mockResponse.refresh_token);
      done();
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
    req.flush(mockResponse);
  });

  it('should clear storage and redirect on logout', () => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('refresh_token', 'test-refresh');
    localStorage.setItem('user_role', 'user');
    localStorage.setItem('csrf_token', 'test-csrf');

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
    expect(localStorage.getItem('user_role')).toBeNull();
    expect(localStorage.getItem('csrf_token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/user/login']);
  });

  it('should return correct authentication status', () => {
    expect(service.isLoggedIn()).toBeFalsy();

    localStorage.setItem('access_token', 'test-token');
    expect(service.isLoggedIn()).toBeTruthy();

    localStorage.removeItem('access_token');
    expect(service.isLoggedIn()).toBeFalsy();
  });

  it('should provide correct headers', () => {
    const mockToken = 'test-token';
    localStorage.setItem('access_token', mockToken);

    const headers = service.getHeaders();
    expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('should handle file upload headers', () => {
    const mockToken = 'test-token';
    const mockCsrfToken = 'test-csrf';
    localStorage.setItem('access_token', mockToken);
    localStorage.setItem('csrf_token', mockCsrfToken);

    const headers = service.getPOSTFileUploadHeaders();
    expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(headers.get('X-CSRF-Token')).toBe(mockCsrfToken);
    expect(headers.get('Accept')).toBe('application/vnd.api+json');
  });
});
