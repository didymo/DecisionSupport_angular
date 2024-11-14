// import { TestBed } from '@angular/core/testing';
//
// import { ReportService } from './report.service';
// describe('ReportService', () => {
//   let service: ReportService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(ReportService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

// report.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReportService,
        {
          provide: AuthService,
          useValue: { getHeaders: () => ({ 'Authorization': 'Bearer test-token' }) }
        }
      ]
    });
    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should get report', () => {
  //   const decisionSupportId = '123';
  //   const mockReport = { id: 123, title: 'Test Report' };
  //
  //   service.getReport(decisionSupportId).subscribe(report => {
  //     expect(report).toEqual(mockReport);
  //   });
  //
  //   const req = httpMock.expectOne(`${environment.getDecisionSupportReportURL}${decisionSupportId}?_format=json`);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockReport);
  // });

  // it('should get report list', () => {
  //   const mockReportList = [{ id: 1, title: 'Report 1' }];
  //
  //   service.getReportList().subscribe(reports => {
  //     expect(reports).toEqual(mockReportList);
  //   });
  //
  //   const req = httpMock.expectOne(environment.getDecisionSupportReportListURL);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockReportList);
  // });
});
