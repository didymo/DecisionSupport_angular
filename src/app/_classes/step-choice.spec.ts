// import { StepChoice } from './step-choice';
//
// describe('StepChoice', () => {
//   it('should create an instance', () => {
//     expect(new StepChoice()).toBeTruthy();
//   });
// });


// step-choice.spec.ts
import { StepChoice } from './step-choice';

describe('StepChoice', () => {
  let stepChoice: StepChoice;

  beforeEach(() => {
    stepChoice = new StepChoice(
      'choice-1',
      'uuid-123',
      'Yes',
      false
    );
  });

  it('should create an instance', () => {
    expect(stepChoice).toBeTruthy();
  });

  it('should have correct property values', () => {
    expect(stepChoice.id).toBe('choice-1');
    expect(stepChoice.choiceUuid).toBe('uuid-123');
    expect(stepChoice.description).toBe('Yes');
    expect(stepChoice.selected).toBe(false);
  });

  it('should update selected state', () => {
    stepChoice.selected = true;
    expect(stepChoice.selected).toBe(true);
  });
});
