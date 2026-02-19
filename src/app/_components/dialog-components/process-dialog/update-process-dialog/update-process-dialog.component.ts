/**
 * @whatItDoes This Dialog Component displays a dialog with form inputs to update a existing process.
 *
 * @description
 * The form will be prefilled with the existing process details. The user can make changes and update the process.
 */
import { Component, inject } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-update-process-dialog',
    imports: [MatDialogModule, MatFormField, MatSelectModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
    templateUrl: './update-process-dialog.component.html',
    styleUrl: './update-process-dialog.component.scss'
})
export class UpdateProcessDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject<MatDialogRef<UpdateProcessDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  /** Declare Form Group */
  form: FormGroup;
  /** Set the Revision Status Values */
  revisionStatus: RevisionStatus[] = [
    { value: 'Archived', label: 'Archived' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' }
  ];

  constructor() {
    // Inject the existing process details into form group elements
    this.form = this.fb.group({
      label: [this.data.process.label],
      revision_status: [this.data.process.revisionStatus],
      json_string: this.data.process.json_string
    });
  }

  /** When user closes the dialog */
  close(): void {
    // Close the dialog and reset the form fields.
    this.dialogRef.close(null);
    this.form.reset();
  }

  /** When user clicks the update button */
  onUpdate(): void {
    // Check is form valid and submit the form if its valid
    if (this.form.valid) {
      // Build the complte process structure
      const updatedProcess = {
        ...this.data,
        label: this.form.value.label,
        revision_status: this.form.value.revision_status,
        json_string: this.data.process.json_string
      };
      this.dialogRef.close(updatedProcess);
    }
  }
}

/** Interface for revision status */
interface RevisionStatus {
  value: string;
  label: string;
}
