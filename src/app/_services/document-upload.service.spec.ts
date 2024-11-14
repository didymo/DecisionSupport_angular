// import { TestBed } from '@angular/core/testing';
//
// import { DocumentUploadService } from './document-upload.service';
//
// describe('DocumentUploadService', () => {
//   let service: DocumentUploadService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(DocumentUploadService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentUploadService } from './document-upload.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

describe('DocumentUploadService', () => {
  let service: DocumentUploadService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getPOSTFileUploadHeaders', 'getHeaders']);
    authServiceSpy.getPOSTFileUploadHeaders.and.returnValue(new HttpHeaders());
    authServiceSpy.getHeaders.and.returnValue(new HttpHeaders());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DocumentUploadService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(DocumentUploadService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload file', () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockResponse = { fid: '123' };

    service.uploadFile(mockFile).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.fileUploadURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/octet-stream');
    expect(req.request.headers.get('Content-Disposition')).toBe('file; filename="test.txt"');
    req.flush(mockResponse);
  });

  it('should create decision support document', () => {
    const mockParams = {
      fid: '123',
      label: 'Test Doc',
      notes: 'Test Notes',
      stepId: 'step1',
      decisionSupportId: 'decision1'
    };
    const mockResponse = { id: '456', ...mockParams };

    service.createDecisionSupportDocument(
      mockParams.fid,
      mockParams.label,
      mockParams.notes,
      mockParams.stepId,
      mockParams.decisionSupportId
    ).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.postDecisionSupportDocumentsURL);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should archive decision support document', () => {
    const mockFileId = '123';

    service.archiveDecisionSupportDocument(mockFileId).subscribe();

    const req = httpMock.expectOne(`${environment.archiveDecisionSupportDocumentsURL}${mockFileId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(null);
  });

  it('should get document list', () => {
    const mockDecisionSupportId = '123';
    const mockDocList = [
      { id: '1', name: 'doc1' },
      { id: '2', name: 'doc2' }
    ];

    service.getDocumentlist(mockDecisionSupportId).subscribe(response => {
      expect(response).toEqual(mockDocList);
    });

    const req = httpMock.expectOne(`${environment.getDecisionSupportDocumentsURL}${mockDecisionSupportId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDocList);
  });
});
