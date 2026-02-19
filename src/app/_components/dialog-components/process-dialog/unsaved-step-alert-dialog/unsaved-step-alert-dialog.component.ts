/**
 * @whatItDoes This Dialog Component displays a dialog with a alert message to alert user about unsaved step data.
 *
 * @description
 * The user can discard or continue the changes.
 */
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-unsaved-step-alert-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './unsaved-step-alert-dialog.component.html',
    styleUrl: './unsaved-step-alert-dialog.component.scss'
})
export class UnsavedStepAlertDialogComponent {
  dialogRef = inject<MatDialogRef<UnsavedStepAlertDialogComponent>>(MatDialogRef);
  unSavedData = inject(MAT_DIALOG_DATA);

  /** ID of the unsaved Process */
  processId = " ";
  /** Name of the unsaved process */
  processName ="Process";

  constructor() {
    const unSavedData = this.unSavedData;

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
