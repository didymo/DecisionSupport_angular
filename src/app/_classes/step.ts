/**
 * @whatItDoes Represents a step in a process.
 *
 * @description
 *  Steps make up processes, they can have a
 */

import {Condition} from "./condition";
import {StepChoice} from "./step-choice";
import {SanitizeService} from "../_services/sanitize.service";


export class Step {
  /**
   * Displayed ID of the step (1, 2, 3, etc.).
   */
  id: number;
  /**
   * Unique identifier for the individual step.
   */
  stepUuid: string;
  /**
   * The question or instruction that is presented to the user (i.e. "How many of these options are true?").
   */
  description: string;
  /**
   * The type of step (radiobutton; checkbox; radio&text; checkbox&text; text)
   */
  type: string;
  /**
   * Determines a step is required to complete the decision support or not (0 - no, 1 -yes)
   */
  required: string;
  /**
   * An array of step choices.
   * If an step has no choices, it will still be populated by one step choice. It's not used.
   */
  choices: StepChoice[];
  /**
   * An array of conditions which includes the skip logic conditions.
   */
  conditions: Condition[];
  /**
   * Should the step be visible (according to the logic)?
   */
  isVisible: boolean;
  /**
   * Has the step been completed?
   */
  isCompleted: boolean;
  /**
   * Holds the answers from radio buttons and checkboxes by holding their step choice unique identifiers.
   */
  answer: string;
  /**
   *  Holds the answers from radio buttons and checkboxes by holding their step choice label.
   */
  answerLabel: string;
  /**
   * Holds answers put into the text field (often the used for the "more details" text boxes)
   */
  textAnswer: string;

  constructor(
    id: number,
    stepUuid: string,
    type: string,
    required: string,
    description: string,
    choices: StepChoice[],
    conditions: Condition[],
    isCompleted: boolean,
    isVisible: boolean,
    answer: string,
    answerLabel: string,
    textAnswer: string,
    private sanitizeService: SanitizeService)
  {
    this.id = id;
    this.stepUuid = stepUuid;
    this.description = this.sanitizeService.sanitize(description); // Use SanitizeService
    this.type = type;
    this.required = required;
    this.choices = choices;
    this.conditions = conditions;
    this.isCompleted = isCompleted;
    this.isVisible = isVisible;
    this.answer = answer;
    this.answerLabel = this.sanitizeService.sanitize(answerLabel);
    this.textAnswer = this.sanitizeService.sanitize(textAnswer);
  }
}
