// import { TestBed } from '@angular/core/testing';
//
// import { DocumentService } from './document.service';
//
// describe('DocumentService', () => {
//   let service: DocumentService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(DocumentService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get document details correctly', () => {
    const mockDecisionSupportId = '123';
    const mockLabel = 'Test Document';
    const mockStepId = 'step1';

    service.setDocumentDetails(mockDecisionSupportId, mockLabel, mockStepId);

    expect(service.getDecisionSupportId()).toBe(mockDecisionSupportId);
    expect(service.getLabel()).toBe(mockLabel);
    expect(service.getStepId()).toBe(mockStepId);
  });

  it('should return undefined values before setting details', () => {
    expect(service.getDecisionSupportId()).toBeUndefined();
    expect(service.getLabel()).toBeUndefined();
    expect(service.getStepId()).toBeUndefined();
  });
});
