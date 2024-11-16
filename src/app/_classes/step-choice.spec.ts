import { StepChoice } from './step-choice';
import { SanitizeService } from '../_services/sanitize.service';

describe('StepChoice Security and Functionality Tests', () => {

  describe('Instantiation and Data Validation', () => {
    it('should create a StepChoice instance with sanitized description', () => {
      const maliciousDescription = '<script>alert("xss")</script>';
      const sanitizedDescription = SanitizeService.sanitizeStatic(maliciousDescription);

      const stepChoice = new StepChoice(
        '1',
        'uuid-choice-1',
        maliciousDescription,
        false
      );

      expect(stepChoice).toBeTruthy();
      expect(stepChoice.description).toBe(sanitizedDescription);
    });

    it('should correctly assign and sanitize properties', () => {
      const stepChoice = new StepChoice(
        '2',
        'uuid-choice-2',
        'Safe Description',
        true
      );

      expect(stepChoice.id).toBe('2');
      expect(stepChoice.choiceUuid).toBe('uuid-choice-2');
      expect(stepChoice.description).toBe('Safe Description');
      expect(stepChoice.selected).toBe(true);
    });
  });

  describe('Security Features', () => {
    it('ensures description is sanitized to prevent XSS attacks', () => {
      const maliciousDescription = '<script>alert("xss")</script>';

      const stepChoice = new StepChoice(
        '3',
        'uuid-choice-3',
        maliciousDescription,
        false
      );

      expect(stepChoice.description).not.toContain('<script>');
      expect(stepChoice.description).toBe(''); // DOMPurify removes all unsafe tags
    });

    it('removes potentially harmful tags in the description', () => {
      const maliciousDescription = '<img src="x" onerror="alert(1)">Some text';

      const stepChoice = new StepChoice(
        '4',
        'uuid-choice-4',
        maliciousDescription,
        false
      );

      expect(stepChoice.description).not.toContain('<img>');
      expect(stepChoice.description).toBe('Some text');
    });

    it('retains plain text in the description when no harmful tags are present', () => {
      const plainTextDescription = 'This is a safe description.';

      const stepChoice = new StepChoice(
        '5',
        'uuid-choice-5',
        plainTextDescription,
        true
      );

      expect(stepChoice.description).toBe(plainTextDescription);
    });
  });

  describe('SanitizeStatic Integration', () => {
    it('calls SanitizeService.sanitizeStatic during initialization', () => {
      const maliciousDescription = '<b>bold</b>';
      spyOn(SanitizeService, 'sanitizeStatic').and.callThrough();

      const stepChoice = new StepChoice(
        '6',
        'uuid-choice-6',
        maliciousDescription,
        true
      );

      expect(SanitizeService.sanitizeStatic).toHaveBeenCalledWith(maliciousDescription);
      expect(stepChoice.description).toBe('bold'); // DOMPurify keeps plain text
    });
  });
});
