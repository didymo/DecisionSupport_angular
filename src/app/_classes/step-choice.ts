/**
 * @whatItDoes Represents a step choice.
 *
 * @description
 *  Step choices are the different individual choices that can be made within a step (i.e. one step choice for "yes" and one for "no" in a yes/no radio button step.)
 */
import {SanitizeService} from "../_services/sanitize.service";

export class StepChoice {
  constructor(
    id: string,
    choiceUuid: string,
    description: string,
    selected: boolean,
  ) {
    this.choiceUuid = choiceUuid;
    this.id = id;
    this.description = SanitizeService.sanitizeStatic(description); // Use static sanitize method
    this.selected = selected;
  }

    /**
     * The ID of the class.
     */
     id: string;

    /**
     * A completely unique identifier that identifies a single choice.
     */
    choiceUuid: string;

    /**
     * The text that displays to represent the choice (i.e. "Yes", "No", "Maybe").
     */
    description: string;

    /**
     * Has this choice selected or not?
     */
    selected: boolean;

}
