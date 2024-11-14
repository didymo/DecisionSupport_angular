// import { Process } from './process';
//
// describe('Process', () => {
//   it('should create an instance', () => {
//     expect(new Process()).toBeTruthy();
//   });
// });


// process.spec.ts
import { Process } from './process';
import { Step } from './step';

describe('Process', () => {
  let process: Process;
  let mockSteps: Step[];

  beforeEach(() => {
    mockSteps = [
      new Step(1, 'uuid-1', 'radiobutton', '1', 'Test Step 1', [], [], false, true, '', '', ''),
      new Step(2, 'uuid-2', 'checkbox', '1', 'Test Step 2', [], [], false, true, '', '', '')
    ];

    process = new Process(
      1,
      123,
      'Test Process',
      mockSteps
    );
  });

  it('should create an instance', () => {
    expect(process).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(process.entityId).toBe(1);
    expect(process.uuid).toBe(123);
    expect(process.label).toBe('Test Process');
    expect(process.steps).toEqual(mockSteps);
    expect(process.steps.length).toBe(2);
  });

  it('should maintain step order', () => {
    expect(process.steps[0].id).toBe(1);
    expect(process.steps[1].id).toBe(2);
  });
});
