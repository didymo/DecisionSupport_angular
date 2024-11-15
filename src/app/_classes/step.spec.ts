// import { TestBed } from '@angular/core/testing';
// import { Step } from './step';
// import { StepChoice } from './step-choice';
// import { Condition } from './condition';
// import {SanitizeService} from "../_services/sanitize.service";
//
// describe('Step Security and Functionality Tests', () => {
//   let mockStepChoices: StepChoice[];
//   let mockConditions: Condition[];
//   let sanitizeService: SanitizeService; // Declare SanitizeService
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [SanitizeService], // Provide SanitizeService
//     });
//     sanitizeService = TestBed.inject(SanitizeService); // Inject SanitizeService
//
//     // Initialize mock choices and conditions
//     mockStepChoices = [] as StepChoice[];
//     mockConditions = [] as Condition[];
//   });
//
//   it('creates a Step instance securely with SanitizeService', () => {
//     const step = new Step(
//       1,
//       'uuid-step-1',
//       'radiobutton',
//       '1',
//       'Secure Assessment',
//       mockStepChoices,
//       mockConditions,
//       false,
//       true,
//       '',
//       '',
//       '',
//       sanitizeService // Pass sanitizeService instance
//     );
//
//     expect(step).toBeTruthy();
//     expect(step.description).toBe('Secure Assessment');
//   });
// });

import { Step } from './step';
import { StepChoice } from './step-choice';
import { Condition } from './condition';
import { TestBed } from '@angular/core/testing';
import {SanitizeService} from "../_services/sanitize.service";

describe('Step Security and Functionality Tests', () => {
  let mockStepChoices: StepChoice[];
  let mockConditions: Condition[];
  let sanitizeService: SanitizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SanitizeService],
    });
    sanitizeService = TestBed.inject(SanitizeService);

    mockStepChoices = [
      new StepChoice('1', 'uuid-choice-1', 'Choice 1', false),
      new StepChoice('2', 'uuid-choice-2', 'Choice 2', false),
    ];

    mockConditions = [
      new Condition(1, 'uuid-step-1', 'uuid-choice-1'),
    ];
  });

  describe('Step Initialization', () => {
    it('creates a Step instance with valid data', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        'Secure Assessment',
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        '',
        sanitizeService
      );

      expect(step).toBeTruthy();
      expect(step.id).toBe(1);
      expect(step.stepUuid).toBe('uuid-step-1');
      expect(step.description).toBe('Secure Assessment');
      expect(step.choices).toEqual(mockStepChoices);
      expect(step.conditions).toEqual(mockConditions);
      expect(step.isVisible).toBeTrue();
      expect(step.isCompleted).toBeFalse();
    });
  });

  describe('Data Sanitization', () => {
    it('prevents XSS vulnerabilities in step description', () => {
      const maliciousDescription = '<script>alert("xss")</script>Secure Step';
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        maliciousDescription,
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        '',
        sanitizeService
      );

      expect(step.description).not.toContain('<script>');
      expect(step.description).toBe('Secure Step');
    });

    it('ensures text answers are sanitized', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'text',
        '1',
        'Secure Step',
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        '<img src="javascript:alert(\'xss\')">',
        sanitizeService
      );

      expect(step.textAnswer).not.toContain('javascript:');
      expect(step.textAnswer).toBe('');
    });
  });

  describe('Workflow Validation', () => {
    it('validates step visibility and completion states', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        'Secure Step',
        mockStepChoices,
        mockConditions,
        true,
        true,
        '',
        '',
        '',
        sanitizeService
      );

      expect(step.isVisible).toBeTrue();
      expect(step.isCompleted).toBeTrue();
    });

    it('validates required fields', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        'Required Step',
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        '',
        sanitizeService
      );

      expect(step.required).toBe('1');
    });
  });

  describe('StepChoice Integration', () => {
    it('correctly integrates step choices', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        'Secure Step',
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        '',
        sanitizeService
      );

      expect(step.choices.length).toBe(2);
      expect(step.choices[0].description).toBe('Choice 1');
      expect(step.choices[1].description).toBe('Choice 2');
    });
  });

  describe('Condition Validation', () => {
    it('ensures conditions are correctly linked', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        'Secure Step',
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        '',
        sanitizeService
      );

      expect(step.conditions.length).toBe(1);
      expect(step.conditions[0].choiceUuid).toBe('uuid-choice-1');
      expect(step.conditions[0].stepUuid).toBe('uuid-step-1');
    });
  });

  describe('Answer Security and Validation', () => {
    it('validates radio/checkbox answer fields', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        'Secure Step',
        mockStepChoices,
        mockConditions,
        false,
        true,
        'uuid-choice-1',
        'Choice 1',
        '',
        sanitizeService
      );

      expect(step.answer).toBe('uuid-choice-1');
      expect(step.answerLabel).toBe('Choice 1');
    });

    it('validates text answer fields', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'text',
        '1',
        'Secure Step',
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        'This is a secure text answer',
        sanitizeService
      );

      expect(step.textAnswer).toBe('This is a secure text answer');
    });
  });

  describe('Enterprise Security Features', () => {
    it('enforces type safety across all fields', () => {
      const step = new Step(
        1,
        'uuid-step-1',
        'radiobutton',
        '1',
        'Secure Step',
        mockStepChoices,
        mockConditions,
        false,
        true,
        '',
        '',
        '',
        sanitizeService
      );

      expect(typeof step.id).toBe('number');
      expect(typeof step.stepUuid).toBe('string');
      expect(typeof step.type).toBe('string');
      expect(typeof step.required).toBe('string');
      expect(Array.isArray(step.choices)).toBeTrue();
      expect(Array.isArray(step.conditions)).toBeTrue();
    });
  });
});
