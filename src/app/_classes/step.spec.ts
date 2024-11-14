// import { Step } from './step';
//
// describe('Step', () => {
//   it('should create an instance', () => {
//     expect(new Step()).toBeTruthy();
//   });
// });



// step.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Step } from './step';
import { StepChoice } from './step-choice';
import { Condition } from './condition';

describe('Step', () => {
  let step: Step;
  let mockChoices: StepChoice[];
  let mockConditions: Condition[];

  beforeEach(() => {
    mockChoices = [
      new StepChoice('1', 'uuid-1', 'Yes', false),
      new StepChoice('2', 'uuid-2', 'No', false)
    ];
    mockConditions = [];

    step = new Step(
      1,
      'step-uuid-123',
      'radiobutton',
      '1',
      'Is this a test question?',
      mockChoices,
      mockConditions,
      false,
      true,
      '',
      '',
      ''
    );
  });

  it('should create an instance', () => {
    expect(step).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(step.id).toBe(1);
    expect(step.stepUuid).toBe('step-uuid-123');
    expect(step.type).toBe('radiobutton');
    expect(step.required).toBe('1');
    expect(step.description).toBe('Is this a test question?');
    expect(step.choices.length).toBe(2);
    expect(step.isVisible).toBe(true);
    expect(step.isCompleted).toBe(false);
  });

  it('should handle radio type answers', () => {
    step.answer = 'uuid-1';
    step.answerLabel = 'Yes';
    step.isCompleted = true;

    expect(step.answer).toBe('uuid-1');
    expect(step.answerLabel).toBe('Yes');
    expect(step.isCompleted).toBe(true);
  });

  it('should handle text type answers', () => {
    const textStep = new Step(
      2,
      'step-uuid-456',
      'text',
      '1',
      'Please provide details',
      [],
      [],
      false,
      true,
      '',
      '',
      ''
    );

    textStep.textAnswer = 'Sample text response';
    textStep.isCompleted = true;

    expect(textStep.textAnswer).toBe('Sample text response');
    expect(textStep.isCompleted).toBe(true);
  });

  it('should handle combination type answers', () => {
    const comboStep = new Step(
      3,
      'step-uuid-789',
      'radio&text',
      '1',
      'Test question with details',
      mockChoices,
      [],
      false,
      true,
      '',
      '',
      ''
    );

    comboStep.answer = 'uuid-1';
    comboStep.answerLabel = 'Yes';
    comboStep.textAnswer = 'Additional details';
    comboStep.isCompleted = true;

    expect(comboStep.answer).toBe('uuid-1');
    expect(comboStep.answerLabel).toBe('Yes');
    expect(comboStep.textAnswer).toBe('Additional details');
    expect(comboStep.isCompleted).toBe(true);
  });
});
