/**
 * @whatItDoes This Dialog Component displays a dialog with a confirmation message to delete a process step.
 *
 * @description
 * The user can cancel or delete a process step.
 */
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-process-step-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './delete-process-step-dialog.component.html',
    styleUrl: './delete-process-step-dialog.component.scss'
})
export class DeleteProcessStepDialogComponent {
  dialogRef = inject<MatDialogRef<DeleteProcessStepDialogComponent>>(MatDialogRef);
  data = inject<{
    dependantSteps: any;
}>(MAT_DIALOG_DATA);


  dependantSteps : any;
  constructor() { 
    this.dependantSteps  = this.data.dependantSteps ;
  }

  /** Close the dialog when the user clicks close */
  close(): void {
    this.dialogRef.close(null);
  }

  /** Send the confirmation if the user clicks Delete */
  ok(): void {
    this.dialogRef.close(true);
  }
}
