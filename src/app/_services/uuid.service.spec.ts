// import { TestBed } from '@angular/core/testing';
//
// import { UuidService } from './uuid.service';
// import {TestBed} from "@angular/core/testing";
//
// describe('UuidService', () => {
//   let service: UuidService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(UuidService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

//////

// import { TestBed } from '@angular/core/testing';
// // import { UuidService } from './uuid.service';
// import { v4 as uuidv4 } from 'uuid';
// import {UuidService} from "./uuid.service";
//
// describe('UuidService', () => {
//   let service: UuidService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(UuidService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//
//   it('should generate a UUID', () => {
//     const uuid = service.generateUuid();
//     expect(uuid).toBeTruthy();
//     expect(typeof uuid).toBe('string');
//   });
//
//   it('should call uuidv4 to generate UUID', () => {
//     spyOn(uuidv4, 'call').and.callThrough(); // Spy on uuidv4
//     service.generateUuid();
//     expect(uuidv4).toHaveBeenCalled();
//   });
//
//   it('should generate unique UUIDs each time', () => {
//     const uuid1 = service.generateUuid();
//     const uuid2 = service.generateUuid();
//     expect(uuid1).not.toEqual(uuid2); // Verify uniqueness
//   });
// });

// uuid.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { UuidService } from './uuid.service';

describe('UuidService', () => {
  let service: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UuidService]
    });
    service = TestBed.inject(UuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = service.generateUuid();
    const uuid2 = service.generateUuid();

    expect(uuid1).toBeTruthy();
    expect(typeof uuid1).toBe('string');
    expect(uuid1).not.toEqual(uuid2);
  });

  it('should generate valid UUID format', () => {
    const uuid = service.generateUuid();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(uuid)).toBeTruthy();
  });
});
