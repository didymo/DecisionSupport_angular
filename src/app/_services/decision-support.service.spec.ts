import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {DecisionSupportService} from './decision-support.service';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {HttpHeaders, provideHttpClient} from '@angular/common/http';

describe('DecisionSupportService', () => {
  let service: DecisionSupportService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getHeaders']);
    authServiceSpy.getHeaders.and.returnValue(new HttpHeaders());

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DecisionSupportService,
        {provide: AuthService, useValue: authServiceSpy}
      ]
    });

    service = TestBed.inject(DecisionSupportService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should get decision support by id', () => {
  //   const mockId = '123';
  //   const mockHeaders = new HttpHeaders();
  //   const mockResponse = { id: mockId, title: 'Test Decision' };
  //
  //   service.getDecisionSupport(mockId, mockHeaders).subscribe(response => {
  //     expect(response).toEqual(mockResponse);
  //   });
  //
  //   const req = httpMock.expectOne(`${environment.getDecisionSupportURL}${mockId}?_format=json`);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockResponse);
  // });

  // it('should get decision support list', () => {
  //   const mockList = [{ id: '1', title: 'Decision 1' }, { id: '2', title: 'Decision 2' }];
  //
  //   service.getDecisionSupportList().subscribe(response => {
  //     expect(response).toEqual(mockList);
  //   });
  //
  //   const req = httpMock.expectOne(environment.getDecisionSupportListURL);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockList);
  // });

  it('should post new decision support', () => {
    const mockData = {title: 'New Decision'};
    const mockResponse = {id: '123', ...mockData};

    service.postDecisionSupport(mockData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.postDecisionSupportURL);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // it('should patch decision support', () => {
  //   const mockId = '123';
  //   const mockSteps = { steps: ['step1', 'step2'] };
  //   const mockResponse = { id: mockId, ...mockSteps };
  //
  //   service.patchDecisionSupport(mockId, mockSteps).subscribe(response => {
  //     expect(response).toEqual(mockResponse);
  //   });
  //
  //   const req = httpMock.expectOne(`${environment.patchDecisionSupportURL}${mockId}`);
  //   expect(req.request.method).toBe('PATCH');
  //   req.flush(mockResponse);
  // });

  it('should archive decision support', () => {
    const mockId = '123';

    service.archiveDecisionSupport(mockId).subscribe();

    const req = httpMock.expectOne(`${environment.archiveDecisionSupportURL}${mockId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
