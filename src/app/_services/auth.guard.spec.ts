// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';
//
// import { AuthGuard } from './auth.guard';
//
// describe('authGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) =>
//       TestBed.runInInjectionContext(() => {
//         return new AuthGuard(...guardParameters);
//       });
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });
//
//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access for authenticated administrator', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getUserRole.and.returnValue('administrator');

    const route = { routeConfig: { path: 'process' } } as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect regular users from process page', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getUserRole.and.returnValue('user');

    const route = { routeConfig: { path: 'process' } } as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should redirect unauthenticated users to login', () => {
    authService.isLoggedIn.and.returnValue(false);

    const route = { routeConfig: { path: 'any-path' } } as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/user/login']);
  });

  it('should allow regular users to access non-process pages', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getUserRole.and.returnValue('user');

    const route = { routeConfig: { path: 'home' } } as ActivatedRouteSnapshot;

    expect(guard.canActivate(route)).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
