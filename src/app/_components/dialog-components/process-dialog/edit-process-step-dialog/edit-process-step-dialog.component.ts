/**
 * @whatItDoes This Dialog Component displays a dialog with form inputs to update a existing process step.
 *
 * @description
 * The form will be prefilled with the existing process step details. The user can make changes and update the process step.
 */
import { Component, Inject } from '@angular/core';
import { UuidService } from '../../../../_services/uuid.service';
import { Step } from '../../../../_classes/step';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-process-step-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormField, MatButtonModule, MatInputModule, MatSelectModule, FormsModule, MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-process-step-dialog.component.html',
  styleUrl: './edit-process-step-dialog.component.scss'
})
export class EditProcessStepDialogComponent {
  /** Declare Form Data */
  formData: any = {
    description: '',
    required: '',
    type: '',
    referenceLink: [],
    choices: [],
    conditions: []
  };
  /** Array Object to store filtered step data */
  filteredStepsData: Step[] = [];
  /** Set the Display Type Values */
  type: DisplayType[] = [
    { value: 'radio', label: 'Radio' },
    { value: 'radio&text', label: 'Radio & Text' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'checkbox&text', label: 'Checkbox & Text' },
    { value: 'textbox', label: 'Textbox' }
  ];

  constructor(private uuidService: UuidService, public dialogRef: MatDialogRef<EditProcessStepDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { step: any; stepsData: Step[] }) {
    // Inject the existing process step details into form elements
    this.formData.description = data.step.description;
    this.formData.required = data.step.required;
    this.formData.type = data.step.type;
    this.formData.referenceLink = data.step.referenceLink || [];
    this.formData.choices = data.step.choices || [];
    this.formData.conditions = data.step.conditions || [];
    this.filteredStepsData = data.stepsData.filter(s => s.stepUuid !== data.step.stepUuid);
  }

  /** Add choice method to add a choice to a process step with a unique choice id*/
  addChoice() {
    this.formData.choices.push({
      id: this.formData.choices.length + 1,
      choiceUuid: this.uuidService.generateUuid(),
      description: ''
    });
  }

  /** Remove choice method to remove a choice from a process step */
  removeChoice(index: number) {
    this.formData.choices.splice(index, 1);
  }

  /** Add Condition method to add a conditon to a process step with a stepUuid, choiceUuis and step choices*/
  addCondition() {
    this.formData.conditions.push({
      conditionId: this.formData.conditions.length + 1,
      stepUuid: '',
      choiceUuid: '',
      stepChoices: []
    });
  }

  /** Remove Conditon method to remove a condition from a process step */
  removeCondition(index: number) {
    this.formData.conditions.splice(index, 1);
  }

  /** UpdateStepConditionChoices method to update the step choice of a condition */
  updateStepConditionChoices(uuid: string, conditionIndex: number) {
    const selectedStep = this.filteredStepsData.find(step => step.stepUuid === uuid);
    if (selectedStep && selectedStep.choices) {
      this.formData.conditions[conditionIndex].stepChoices = selectedStep.choices;
    }
  }

  /** Add Reference Link to a Step */
  addReferenceLink(){
    this.formData.referenceLink.push({
      id: this.formData.referenceLink.length + 1,
      label: '',
      url:'',
      description: ''
    });
  }

  /** Remove Remove Reference Link attached to a Step */
  removeReferenceLink(index:number){
    this.formData.referenceLink.splice(index, 1);
  }

  /** Close the dialog and reset form data when user clicks close button */
  close(): void {
    this.dialogRef.close();
    this.formData = {};
  }

  /** Submit the form data if the data is valid*/
  save(stepForm: any): void {
    //Reset the fordata choices if the user update the step type to textbox
    if (this.formData.type === 'textbox') {
      this.formData.choices = [];
    }
    // Check is form valid and submit the form if its valid
    if (stepForm.valid) {
      const updatedStep = {
        id: this.data.step.id,
        stepUuid: this.data.step.stepUuid,
        answer: '',
        answerLabel: '',
        textAnswer: '',
        isVisible: false,
        isCompleted: false,
        ...this.formData
      };
      this.dialogRef.close(updatedStep);
    }
  }
}
/** Interface for Display Type */
interface DisplayType {
  value: string;
  label: string;
}