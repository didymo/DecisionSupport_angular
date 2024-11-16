/**
 * @whatItDoes Represents a condition for a step in a process to appear visible and editable.
 *
 * @description
 *  It connects itself to a specific step of a process and holds the id of a choice that must be true for the step to be visible and editable.
 *
 */

export class Condition {

  constructor(conditionId: number, stepUuid: string, choiceUuid: string) {
    this.conditionId = conditionId;
    this.stepUuid = stepUuid;
    this.choiceUuid = choiceUuid;
  }

  /**
   * represents the id of a condition
   */
  conditionId: number;

  /**
   * determines the step using its unique identifier(uuid)
   */
  stepUuid: string;

  /**
   * represents a choice using its unique identifier(uuid)
   */
  choiceUuid: string;
}
