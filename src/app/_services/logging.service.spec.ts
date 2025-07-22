// import {TestBed} from '@angular/core/testing';
// import {LoggingService} from './logging.service';
// import {environment} from '../../environments/environment';
//
// describe('LoggingService', () => {
//   let loggingService: LoggingService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [LoggingService],
//     });
//     loggingService = TestBed.inject(LoggingService);
//   });
//
//   it('should be created', () => {
//     expect(loggingService).toBeTruthy();
//   });
//
//   describe('log()', () => {
//     it('should log in non-production environments', () => {
//       spyOn(console, 'log');
//       (environment as any).production = false;
//
//       loggingService.log('Test log message', {key: 'value'});
//
//       expect(console.log).toHaveBeenCalledWith('[LOG]: Test log message', {key: 'value'});
//     });
//
//     it('should not log in production environments', () => {
//       spyOn(console, 'log');
//       (environment as any).production = true;
//
//       loggingService.log('Test log message', {key: 'value'});
//
//       expect(console.log).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('info()', () => {
//     it('should log info messages in non-production environments', () => {
//       spyOn(console, 'info');
//       (environment as any).production = false;
//
//       loggingService.info('Test info message', {key: 'value'});
//
//       expect(console.info).not.toHaveBeenCalledWith('[INFO]: Test info message', {key: 'value'});
//     });
//
//     it('should not log info messages in production environments', () => {
//       spyOn(console, 'info');
//       (environment as any).production = true;
//
//       loggingService.info('Test info message', {key: 'value'});
//
//       expect(console.info).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('warn()', () => {
//     it('should always log warnings', () => {
//       spyOn(console, 'warn');
//
//       loggingService.warn('Test warning message', {key: 'value'});
//
//       expect(console.warn).toHaveBeenCalledWith('[WARN]: Test warning message', {key: 'value'});
//     });
//   });
//
//   describe('error()', () => {
//     it('should always log errors', () => {
//       spyOn(console, 'error');
//
//       loggingService.error('Test error message', {key: 'value'});
//
//       expect(console.error).toHaveBeenCalledWith('[ERROR]: Test error message', {key: 'value'});
//     });
//   });
// });

import {TestBed} from '@angular/core/testing';
import {LoggingService} from './logging.service';
import {environment} from '../../environments/environment';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingService],
    });
    loggingService = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });

  describe('log()', () => {
    it('should log in non-production environments', () => {
      spyOn(console, 'log');
      (environment as any).production = false; // Ensure production is false
      loggingService.log('Test log message', {key: 'value'});
      expect(console.log).toHaveBeenCalledWith('[LOG]: Test log message', {key: 'value'});
    });

    it('should not log in production environments', () => {
      spyOn(console, 'log');
      (environment as any).production = true; // Ensure production is true
      loggingService.log('Test log message', {key: 'value'});
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('info()', () => {
    it('should log info messages in non-production environments', () => {
      spyOn(console, 'info');
      (environment as any).production = false; // Ensure production is false
      loggingService.info('Test info message', {key: 'value'});
      expect(console.info).toHaveBeenCalledWith('[INFO]: Test info message', {key: 'value'});
    });

    it('should not log info messages in production environments', () => {
      spyOn(console, 'info');
      (environment as any).production = true; // Ensure production is true
      loggingService.info('Test info message', {key: 'value'});
      expect(console.info).not.toHaveBeenCalled();
    });
  });

  describe('warn()', () => {
    it('should always log warnings', () => {
      spyOn(console, 'warn');
      loggingService.warn('Test warning message', {key: 'value'});
      expect(console.warn).toHaveBeenCalledWith('[WARN]: Test warning message', {key: 'value'});
    });
  });

  describe('error()', () => {
    it('should always log errors', () => {
      spyOn(console, 'error');
      loggingService.error('Test error message', {key: 'value'});
      expect(console.error).toHaveBeenCalledWith('[ERROR]: Test error message', {key: 'value'});
    });
  });
});
