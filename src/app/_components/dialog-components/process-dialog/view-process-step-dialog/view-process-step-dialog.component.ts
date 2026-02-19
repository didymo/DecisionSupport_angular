/**
 * @whatItDoes This Dialog Component displays a dialog with the complete detailsof a  process.
 *
 * @description
 * The user can view the details of a process.
 */
import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Step } from '../../../../_classes/step';

@Component({
    selector: 'app-view-process-step-dialog',
    imports: [MatButtonModule, MatDialogModule, MatIconModule, MatDividerModule],
    templateUrl: './view-process-step-dialog.component.html',
    styleUrl: './view-process-step-dialog.component.scss'
})
export class ViewProcessStepDialogComponent {
  /** Step Object to store step */
  processStep!: Step;
  /** Step array oject to store multiple steps */
  processSteps: Step[] = [];

  constructor(public dialogRef: MatDialogRef<ViewProcessStepDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { step: any; stepsData: any[] }) {
    // Inject the data to desired objects
    this.processStep = data.step;
    this.processSteps = data.stepsData;
  }

  /** Get the step description using the uuid of the step */
  getStepDescription(stepUuid: string) {
    for (const step of this.data.stepsData) {
      if (step && step.stepUuid === stepUuid) {
        return step.description;
      }
    }
    return "";
  }

  /** Get Choice description using the step and choice uuid */
  getChoiceDescription(stepUuid: string, choiceUuid: string) {
    for (const step of this.data.stepsData) {
      if (step && step.stepUuid === stepUuid) {
        for (const choice of step.choices) {
          if (choice && choice.choiceUuid === choiceUuid) {
            return choice.description;
          }
        }
      }
    }
    return "";
  }

}
