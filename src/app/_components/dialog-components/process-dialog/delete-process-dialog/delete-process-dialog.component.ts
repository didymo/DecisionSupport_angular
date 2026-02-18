/**
 * @whatItDoes This Dialog Component displays a dialog with a confirmation message to delete a process.
 *
 * @description
 * The user can cancel or delete a process.
 */
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-process-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './delete-process-dialog.component.html',
    styleUrl: './delete-process-dialog.component.scss'
})
export class DeleteProcessDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteProcessDialogComponent>) { }

  /** Close the dialog when the user clicks close */
  close(): void {
    this.dialogRef.close(null);
  }

  /** Send the confirmation if the user clicks Delete */
  ok(): void {
    this.dialogRef.close(true);
  }
}
