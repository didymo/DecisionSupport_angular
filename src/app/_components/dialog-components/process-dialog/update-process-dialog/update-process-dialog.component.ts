import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [MatDialogModule, MatFormField, CommonModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './update-process-dialog.component.html',
  styleUrl: './update-process-dialog.component.scss'
})
export class UpdateProcessDialogComponent {

  form: FormGroup;
  revisionStatus: RevisionStatus[] = [
    { value: 'Archived', label: 'Archived' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' }
  ];

  constructor( private fb: FormBuilder,public dialogRef: MatDialogRef<UpdateProcessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      label: [this.data.process.label],
      revision_status: [this.data.process.revisionStatus],
      json_string: this.data.process.json_string
    });
  }

  close(): void {
    this.dialogRef.close(null);
    this.form.reset();
    }

  onSave(): void {
    if (this.form.valid) {
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

interface RevisionStatus {
  value: string;
  label: string;
}