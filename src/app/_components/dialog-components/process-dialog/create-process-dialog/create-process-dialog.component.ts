/**
 * @whatItDoes This Dialog Component displays a dialog with form inputs to create a new process.
 *
 * @description
 * The user can fill form fields(name, revision Status) and create a new process.
 */
import { Component, inject } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'app-create-process-dialog',
    imports: [MatDialogModule, MatFormField, MatSelectModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
    templateUrl: './create-process-dialog.component.html',
    styleUrl: './create-process-dialog.component.scss'
})
export class CreateProcessDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject<MatDialogRef<CreateProcessDialogComponent>>(MatDialogRef);

  /** Declare Form Group */
  form: FormGroup;
  /** Set the Revision Status Values */
  revisionStatus: RevisionStatus[] = [
    { value: 'Archived', label: 'Archived' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' }
  ];

  constructor() {
    // Initialize the form group elements.
    this.form = this.fb.group({
      label: [''],
      revision_status: ['Draft']
    });
  }

  /** When user closes the dialog */
  close(): void {
    // Close the dialog and reset the form fields.
    this.dialogRef.close();
    this.form.reset();
  }

  /** When user clicks the save button */
  save(): void {
    // Check is form valid and submit the form if its valid
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } 
  }
}

/** Interface for revision status */
interface RevisionStatus {
  value: string;
  label: string;
}
