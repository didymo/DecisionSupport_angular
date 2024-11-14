// import { TestBed } from '@angular/core/testing';
//
// import { ProcessService } from './process.service';
//
// describe('ProcessService', () => {
//   let service: ProcessService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(ProcessService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

// process.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProcessService } from './process.service';
import { AuthService } from './auth.service';
import { ProcessList } from '../_classes/process-list';
import { Process } from '../_classes/process';
import { environment } from '../../environments/environment';

describe('ProcessService', () => {
  let service: ProcessService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProcessService,
        {
          provide: AuthService,
          useValue: { getHeaders: () => ({ 'Authorization': 'Bearer test-token' }) }
        }
      ]
    });
    service = TestBed.inject(ProcessService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get process list', () => {
    const mockProcessList: ProcessList[] = [
      new ProcessList('Process 1', 1, '2024-01-01', 'published', '2024-01-01', '2024-01-02', true)
    ];

    service.getProcessList().subscribe(processes => {
      expect(processes).toEqual(mockProcessList);
    });

    const req = httpMock.expectOne(environment.getProcessListURL);
    expect(req.request.method).toBe('GET');
    req.flush(mockProcessList);
  });

  it('should post new process', () => {
    const mockData = { label: 'New Process' };

    service.postProcess(mockData).subscribe();

    const req = httpMock.expectOne(environment.postProcessURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
  });

  it('should patch process', () => {
    const processId = 1;
    const mockData = { label: 'Updated Process' };

    service.patchProcess(processId, mockData).subscribe();

    const req = httpMock.expectOne(`${environment.patchProcessURL}${processId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockData);
  });
});
