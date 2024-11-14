// import { DecisionSupport } from './decision-support';
//
// describe('DecisionSupport', () => {
//   it('should create an instance', () => {
//     expect(new DecisionSupport()).toBeTruthy();
//   });
// });

// decision-support.spec.ts
import { DecisionSupport } from './decision-support';

describe('DecisionSupport', () => {
  let decisionSupport: DecisionSupport;

  beforeEach(() => {
    decisionSupport = new DecisionSupport(
      1,
      'Test Support',
      100,
      false
    );
  });

  it('should create an instance', () => {
    expect(decisionSupport).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(decisionSupport.entityId).toBe(1);
    expect(decisionSupport.label).toBe('Test Support');
    expect(decisionSupport.processId).toBe(100);
    expect(decisionSupport.isCompleted).toBe(false);
  });

  it('should allow updating completion status', () => {
    decisionSupport.isCompleted = true;
    expect(decisionSupport.isCompleted).toBe(true);
  });
});
