/**
 * @whatItDoes Is a dialog box which recieves input from the user to rename an decision support.
 *
 * @description There is only one input: "What will you rename the decision support to?"
 *  
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-decision-support-dialog',
  standalone: true,
  imports: [MatDialogContent, MatFormField, MatDialogActions, ReactiveFormsModule],
  templateUrl: './rename-decision-support-dialog.component.html',
  styleUrl: './rename-decision-support-dialog.component.scss'
})

export class RenameDecisionSupportDialogComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<RenameDecisionSupportDialogComponent>)
  {
    this.form = this.fb.group({
      name: [''], // holds the new name of the decision-support.
    });
  }

  // If the dialog is closed, reset the form, and don't pass anything on.
  close(): void {
    this.dialogRef.close(null);
    this.form.reset();
    }

  // When the new name is submitted, close this component and pass on the new name.
  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.name);
    }
  }
}
