/**
 * @whatItDoes This Dialog Component displays a dialog with form inputs to create a new process step.
 *
 * @description
 * The user can create a new process step with a discription, required status, type, multiple choices, multiple conditions.
 */
import { Component, inject, Inject } from '@angular/core';
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
  selector: 'app-add-process-step-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormField, MatButtonModule, MatInputModule, MatSelectModule, FormsModule, MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-process-step-dialog.component.html',
  styleUrl: './add-process-step-dialog.component.scss'
})
export class AddProcessStepDialogComponent {
  /** Array Object to store filtered step data */
  filteredStepsData: Step[] = [];
  /** Declare Form Data */
  formData: any = {
    description: '',
    required: '',
    type: '',
    referenceLink: [],
    choices: [],
    conditions: []
  };
  unsavedData: any = {};
  /** Set the Display Type Values */
  type: DisplayType[] = [
    { value: 'radio', label: 'Radio' },
    { value: 'radio&text', label: 'Radio & Text' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'checkbox&text', label: 'Checkbox & Text' },
    { value: 'textbox', label: 'Textbox' }
  ];

  constructor(private uuidService: UuidService, public dialogRef: MatDialogRef<AddProcessStepDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { steps: any[], processId: any, processName: any }) {
    this.filteredStepsData = data.steps.filter(step => step.type !== "textbox");
    this.checkUnsavedData();
  }

  // Check Local storage for unsaved data
  checkUnsavedData(): void {
    const unsavedData = localStorage.getItem("unsavedStepData");
    // If unsaved data exist load the data to form
    if (unsavedData) {
      const formattedData = JSON.parse(unsavedData);
      if (formattedData.processId == this.data.processId) {
        this.formData = formattedData;
        this.formData.conditions.forEach((condition: any, index: number) => {
          this.updateStepConditionChoices(condition.stepUuid, index);
        });
      }
    }
  }

  /** Add data to Local Storage when user inputs any data in form */
  addDataToLocalStorage(): void {
    this.unsavedData = {
      "processId": this.data.processId,
      "processName": this.data.processName,
      ...this.formData
    };
    localStorage.setItem("unsavedStepData", JSON.stringify(this.unsavedData))
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

  /** Reference Link */
    addReferenceLink(){
    this.formData.referenceLink.push({
      id: this.formData.referenceLink.length + 1,
      label: '',
      url:'',
      description: ''
    });
  }

  removeReferenceLink(index:number){
    this.formData.referenceLink.splice(index, 1);
  }

  /** Close the dialog and reset form data when user clicks close button */
  close(): void {
    this.dialogRef.close();
    this.formData = {};
    localStorage.removeItem("unsavedStepData");
  }

  /** Submit the form data if the data is valid*/
  save(stepForm: any): void {
    // Check is form valid and submit the form if its valid
    if (stepForm.valid) {
      // Build Complete Step Structure
      const newStepData = {
        id: this.data.steps.length + 1,
        stepUuid: this.uuidService.generateUuid(),
        answer: '',
        answerLabel: '',
        textAnswer: '',
        isVisible: false,
        isCompleted: false,
        ...this.formData
      };
      this.dialogRef.close(newStepData);
    }
  }
}
/** Interface for Display Type */
interface DisplayType {
  value: string;
  label: string;
}
