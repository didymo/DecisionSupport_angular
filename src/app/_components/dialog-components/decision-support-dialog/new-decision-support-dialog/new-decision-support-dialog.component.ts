/**
 * @whatItDoes This dialog components recieves input from the user to generate a new decision support.
 *
 * @description There are two inputs: the name of the user, and the type of process the decision support is following.
 *  
 */

import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ProcessService } from '../../../../_services/process.service';
import { ProcessList } from '../../../../_classes/process-list';

@Component({
    selector: 'app-new-decision-support-dialog',
    imports: [MatFormField, ReactiveFormsModule, MatDialogModule, MatInputModule, MatButtonModule, MatSelectModule],
    templateUrl: './new-decision-support-dialog.component.html',
    styleUrl: './new-decision-support-dialog.component.scss'
})

export class NewDecisionSupportDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  dialogRef = inject<MatDialogRef<NewDecisionSupportDialogComponent>>(MatDialogRef);
  private processService = inject(ProcessService);


  form: FormGroup;
  processId: ProcessId[] = []; // This array holds a list of all the processes an decision support could be created from.

  constructor() {
    this.form = this.fb.group({
      //variables being collected from user by the form
      name: [''], // the name of the new decision support
      process_id: [''] // the id of the linked process
    });
  }

  ngOnInit(): void {
    //fills the processId array with the currently available processes (i.e. ones that have the Published revision status).
    this.processService.getProcessList().subscribe((processes: ProcessList[]) => {
      processes = processes.filter(process => process.revisionStatus == 'Published');
      this.processId = processes.map(process => ({
        value: process.entityId,
        label: process.label
      }));
    });
  }

  close(): void {
    this.dialogRef.close();
    this.form.reset();
  }

  save(): void {
    if (this.form.valid) {
      console.log(this.form.value)
      this.dialogRef.close(this.form.value);
    }
  }
}

// Defines the structure of the ProcessId array (use to list all available processes for selection).
interface ProcessId {
  value: number;
  label: string;
}