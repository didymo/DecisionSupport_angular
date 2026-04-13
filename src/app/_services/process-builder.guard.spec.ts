import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { processBuilderGuard } from './process-builder.guard';

describe('processBuilderGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => processBuilderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
