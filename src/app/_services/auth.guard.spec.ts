import {TestBed} from '@angular/core/testing';
import {Router, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';

// Mock ActivatedRouteSnapshot
class MockActivatedRouteSnapshot extends ActivatedRouteSnapshot {
  constructor(public path: string) {
    super();
    Object.defineProperty(this, 'routeConfig', {
      value: {path},
      writable: true,
    });
  }
}

describe('AuthGuard Security and Functionality Tests', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {provide: AuthService, useValue: authServiceSpy},
        {provide: Router, useValue: routerSpy},
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('Authenticated User Access', () => {
    it('should allow access for administrators', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUserRole.and.returnValue('administrator');
      const mockRoute = new MockActivatedRouteSnapshot('');

      const result = authGuard.canActivate(mockRoute);

      expect(result).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should restrict access for regular users to "process" routes', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUserRole.and.returnValue('user');
      const mockRoute = new MockActivatedRouteSnapshot('process');

      const result = authGuard.canActivate(mockRoute);

      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should allow access for regular users to non-restricted routes', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getUserRole.and.returnValue('user');
      const mockRoute = new MockActivatedRouteSnapshot('dashboard');

      const result = authGuard.canActivate(mockRoute);

      expect(result).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Unauthenticated User Access', () => {
    it('should redirect unauthenticated users to login', () => {
      authService.isLoggedIn.and.returnValue(false);
      const mockRoute = new MockActivatedRouteSnapshot('dashboard');

      const result = authGuard.canActivate(mockRoute);

      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/user/login']);
    });
  });
});
