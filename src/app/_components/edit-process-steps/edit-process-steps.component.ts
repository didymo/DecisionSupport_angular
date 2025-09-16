/**
 * @whatItDoes This component lists all the process steps,some basic info about each. Multiple user actions - edit, delete, rearrange.
 *
 * @description
 *  It's accessible from the "Edit" tab.
 * The tables has columns: "ID, Description, Type, Required, Logic, Actions"
 * For each process steps the following action is available: Edit a process step (done by clicking on the edit button), Delete a process step and Rearrange the process steps
 * and save the step order changes
 */
import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ProcessService } from '../../_services/process.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Step } from '../../_classes/step';
import { Process } from '../../_classes/process';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProcessStepDialogComponent } from '../dialog-components/process-dialog/edit-process-step-dialog/edit-process-step-dialog.component';
import { DeleteProcessStepDialogComponent } from '../dialog-components/process-dialog/delete-process-step-dialog/delete-process-step-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-edit-process-steps',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CdkDrag, CdkDropList, CommonModule, MatProgressSpinnerModule],
  templateUrl: './edit-process-steps.component.html',
  styleUrl: './edit-process-steps.component.scss'
})
export class EditProcessStepsComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table!: MatTable<Step>;
  /** Inject Mat snack bar  */
  private snackBar = inject(MatSnackBar);
  /** Id of the process */
  processId: string;
  /** Process object to store the process details retrieved from the backend */
  processDetails!: Process;
  /** Array to store all process steps retrieved from the backend */
  processSteps: Step[] = [];
  /** Table Columns to be displayed */
  displayedColumns: string[] = ['id', 'description', 'type', 'required', 'referenceLink', 'logic', 'actions'];
  /** Detect Changes in step order */
  changeDetected = false;
  /** Boolean value for spinner */
  response = false;
  constructor(private route: ActivatedRoute, private processService: ProcessService, private dialog: MatDialog) {
    /** Get and set the process ID from the route */
    this.processId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    /** Fetch the process steps when the component loads */
    this.getProcessSteps();
  }

  /** Fetch the available process steps from the backend and update the array objects */
  getProcessSteps(): void {
    this.processService.getProcessSteps(this.processId).subscribe(
      (data) => {
        this.processDetails = data;
        this.processSteps = data.steps;
        // Log Success message
        console.log("Successfully fetched process details ");
        this.response = true;
      }, (error) => {
        // Log any errors encountered while fetching processes
        console.error('Error fetching process details:', error);
        this.response = true;;
        //Display error message in snack bar
        this.snackBar.open('Error Fetching Process Details - Try Again', 'Ok', {
          duration: 2000
        });
      }
    )
  }

  /** Method to handle the drop event when the user drag and drop a step */
  drop(event: CdkDragDrop<string>) {
    //Record the prevoius index of the step
    const previousIndex = this.processSteps.findIndex(d => d === event.item.data);
    const movedStep = this.processSteps[previousIndex];
    // Make the change in processStep array
    moveItemInArray(this.processSteps, previousIndex, event.currentIndex);
    this.processSteps.forEach((step, index) => {
      step.id = index + 1;
    });
    this.changeDetected = true;
    this.table.renderRows();
  }

  /** Opens EditProcessStepDialog and then request the backend to update the process step with the updated data. */
  openEditDialog(step: Step) {
    const dialogRef = this.dialog.open(EditProcessStepDialogComponent, {
      width: '60%',
      data: { step: step, stepsData: this.processSteps }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Find the updated step index and update the step in processDetails array
        const index = this.processDetails.steps.findIndex(step => step.stepUuid == result.stepUuid);
        this.processDetails.steps[index] = result;
        this.processService.updateProcessStep(this.processDetails.entityId, this.processDetails).subscribe({
          next: (response) => {
            // Refresh the list after a process step is updated
            this.getProcessSteps();
            // Log success message           
            console.log('Successfully updated step');
            this.snackBar.open('Updated Step Successfully', 'Ok', {
              duration: 1000
            });
          },
          error: (err) => {
            // Log any errors encountered while updating process step.
            console.error('Error updating step:', err);
            this.snackBar.open('Error Updating Step - Try Again', 'Ok', {
              duration: 2000
            });
          }
        });
      }
    });
  }

  /** Requests the backend to save the changes made in the process step order */
  saveChanges() {
    this.processService.updateProcessStep(this.processDetails.entityId, this.processDetails).subscribe({
      next: (response) => {
        // Refresh the list after a new process step is added
        this.getProcessSteps();
        // Log the success message
        console.log('Successfully saved step');
        this.snackBar.open('Successfully Saved Changes ', 'Ok', {
          duration: 1000
        });
      },
      error: (err) => {
        // Log any errors encountered while adding process step.
        console.error('Error saving step:', err);
        this.snackBar.open('Error Saving Changes - Try Again', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  /** Delete the step from the object array and request the backend to save the changes */
  deleteStep(stepUuid: any): void {
    // FInd the deleted step Index and remove the step from array
    const index = this.processDetails.steps.findIndex(step => step.stepUuid == stepUuid);
    if (index != null) {
      const dependantSteps = this.processDetails.steps.filter(step => step.conditions.filter(condition => condition.stepUuid === stepUuid).length > 0);

      const dialogRef = this.dialog.open(DeleteProcessStepDialogComponent, {
        width: '40%',
        data: { dependantSteps: dependantSteps }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.deleteCondition(dependantSteps, stepUuid);
          // Remove the step
          this.processDetails.steps.splice(index, 1);
          //Generate new id for steps
          let newId = 1 ;
          this.processDetails.steps.forEach(step => step.id = newId++);
          this.processService.updateProcessStep(this.processDetails.entityId, this.processDetails).subscribe({
            next: (response) => {
              // Log Success Message
              console.log('Successfully deleted step');
              this.snackBar.open('Deleted Step Successfully', 'Ok', {
                duration: 1000
              });
              // Refresh the list after a new process step is added
              this.getProcessSteps();
            },
            error: (err) => {
              // Log any errors encountered while adding process step.
              console.error('Error deleting step:', err);
              this.snackBar.open('Error Deleting Step - Try Again', 'Ok', {
                duration: 2000
              });
            }
          });
        }
      }
      );
    } 
  }

  /** When deleting a step remove the condition dependency with other steps  */
  deleteCondition(dependantSteps: any, stepUuid: any):void{
    for (const dependantStep of dependantSteps) {
      for (const step of this.processDetails.steps) {
        // Check if dependantStep's stepUuid matches with step's stepUuid
        if (dependantStep.stepUuid === step.stepUuid) {
          // Filter out the condition where the stepUuid matches dependantStep
          step.conditions = step.conditions.filter(condition => condition.stepUuid !== stepUuid);
          let newId = 1 ;
          this.processDetails.steps.forEach(step => step.conditions.forEach(condition => condition.conditionId  = newId++));
        }
      }
    }

  }
}
