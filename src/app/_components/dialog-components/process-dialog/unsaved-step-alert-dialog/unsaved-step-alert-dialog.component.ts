/**
 * @whatItDoes This Dialog Component displays a dialog with a alert message to alert user about unsaved step data.
 *
 * @description
 * The user can discard or continue the changes.
 */
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unsaved-step-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './unsaved-step-alert-dialog.component.html',
  styleUrl: './unsaved-step-alert-dialog.component.scss'
})
export class UnsavedStepAlertDialogComponent {
  /** ID of the unsaved Process */
  processId = " ";
  /** Name of the unsaved process */
  processName ="Process";

  constructor(public dialogRef: MatDialogRef<UnsavedStepAlertDialogComponent>, @Inject(MAT_DIALOG_DATA) public unSavedData: any) {
    this.processId = unSavedData.unSavedData.processId;
    this.processName = unSavedData.unSavedData.processName;
  }

  /** Close the dialog when the user clicks Discard and remove the data from local storage*/
  discard(): void {
    localStorage.removeItem("unsavedStepData")
    this.dialogRef.close(null);
  }

  /** Navigate the user to the process page if the user clicks Continue */
  continue(): void {
    this.dialogRef.close(true);
  }
}
