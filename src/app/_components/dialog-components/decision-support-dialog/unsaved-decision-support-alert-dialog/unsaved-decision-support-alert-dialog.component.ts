import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'app-unsaved-decision-support-alert-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './unsaved-decision-support-alert-dialog.component.html',
    styleUrl: './unsaved-decision-support-alert-dialog.component.scss'
})
export class UnsavedDecisionSupportAlertDialogComponent {
  dialogRef = inject<MatDialogRef<UnsavedDecisionSupportAlertDialogComponent>>(MatDialogRef);
  unSavedData = inject(MAT_DIALOG_DATA);

  /** ID of the unsaved Decision Support */
  decisionSupportId = " ";
  /** Name of the unsaved Decision Support */
  decisionSupportLabel ="Decision Support";

  constructor() {
    const unSavedData = this.unSavedData;

    this.decisionSupportId = unSavedData.unSavedData.entityId;
    this.decisionSupportLabel = unSavedData.unSavedData.decisionSupportLabel;
  }

  /** Close the dialog when the user clicks Discard and remove the data from local storage*/
  discard(): void {
    localStorage.removeItem("decision_support_data")
    this.dialogRef.close(null);
  }

  /** Navigate the user to the process page if the user clicks Continue */
  continue(): void {
    this.dialogRef.close(true);
  }
}