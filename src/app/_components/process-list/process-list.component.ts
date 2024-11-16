/**
 * @whatItDoes This Component lists all the processes, gives links to access them and some basic info about each. And create a new process.
 *
 * @description
 *  It's accessible from the "Process Builder" tab.
 * The tables has columns: "ID, Name, Revision Status, Created Time, Updated Time, Actions"
 * For each processes the following actions are available: View a process (done by clicking on the name), Delete (Archives It), Duplicate(create a new 
 * updated version), and  Edit 
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router} from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { ProcessList } from '../../_classes/process-list';
import { ProcessService } from '../../_services/process.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CreateProcessDialogComponent } from '../dialog-components/process-dialog/create-process-dialog/create-process-dialog.component';
import { Process } from '../../_classes/process';
import { UpdateProcessDialogComponent } from '../dialog-components/process-dialog/update-process-dialog/update-process-dialog.component';
import { DuplicateProcessDialogComponent } from '../dialog-components/process-dialog/duplicate-process-dialog/duplicate-process-dialog.component';
import { DeleteProcessDialogComponent } from '../dialog-components/process-dialog/delete-process-dialog/delete-process-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnsavedStepAlertDialogComponent } from '../dialog-components/process-dialog/unsaved-step-alert-dialog/unsaved-step-alert-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-process-list',
  standalone: true,
  imports: [FormsModule,MatProgressSpinnerModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, CommonModule, MatSelectModule, RouterLink],
  templateUrl: './process-list.component.html',
  styleUrl: './process-list.component.scss'
})
export class ProcessListComponent implements OnInit {
  /** Inject Mat Snack Bar */
  private snackBar = inject(MatSnackBar);
  /** Array to store all processes retrieved from the backend */
  processes: ProcessList[] = [];
  /** Array to store the filtered processes based on revision status */
  filteredProcesses: ProcessList[] = [];
  /** Default revision status filter and serach input */
  revisionStatus = "All";
  searchInput = "";
  /** Table Columns */
  displayedColumns: string[] = ['entityid', 'label', 'revisionStatus', 'createdTime', 'updatedTime', 'actions'];
  /**Boolean Value for spinner */
  response = false;
  
  constructor(private processService: ProcessService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    /** Fetch the list of processes and check for unsaved data when the component loads */
    this.getProcessList();
  }
  
  /** Check for unSaved data and alert the user if data exist */
  checkUnsavedData(): void{
    //Get Data from local Storage
    const unsavedData = localStorage.getItem("unsavedStepData");
    //If data exist alert the user
    if(unsavedData && this.processes ){
      const formattedData = JSON.parse(unsavedData);
      //Open Alert Dialog
      const dialogRef = this.dialog.open(UnsavedStepAlertDialogComponent,{width: '800px', data: {unSavedData: formattedData}});
      dialogRef.afterClosed().subscribe(result =>{
        if(result){
          //If the user want to continue. Navigate the user to the desired page
          this.router.navigate(['/process/', formattedData.processId]);
        }
      })

    }
  }
  
  /** Fetch the available processes from the backend and update the array objects */
  getProcessList(): void {
    this.processService.getProcessList().subscribe(
      (data) => { 
        this.processes = data; 
        this.filterProcessList(this.revisionStatus); 
        this.response = true;
        this.checkUnsavedData();
      },
      (error) =>{
        // Log any errors encountered while fetching processes
        this.response = true;
         console.error('Error fetching processes');
         this.snackBar.open('Error Fetching Processes - Try Again', 'Ok',{
          duration: 3000
        });
      } 
    );
    }
  

  /** Filter the available processes based on the seletced revision status */
  filterProcessList(revisionStatus: any): void {
    this.revisionStatus = revisionStatus;
    if (revisionStatus == "All") {
      // No filtering, show all processes
      this.filteredProcesses = this.processes;
    } else {
      //Filter process list based on the revision status
      this.filteredProcesses = this.processes.filter(process => process.revisionStatus == revisionStatus);
    }
  }

  /** Filter the available processes based on the user serach input */
  filterBySearch(): void {
    if (this.revisionStatus == "All") {
      //Filter Process List based on the user search input
      this.filteredProcesses = this.processes.filter(process =>
        process.label.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      // Filter Process List based on revision status and serach input
      this.filteredProcesses = this.processes.filter(process =>
        process.label.toLowerCase().includes(this.searchInput.toLowerCase()) && process.revisionStatus == this.revisionStatus
      );
    }
  }

  /** Opens CreateProcessDialog and then request the backend to create a new process with the provided data. */
  createProcess(): void {
    const dialogRef = this.dialog.open(CreateProcessDialogComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processService.postProcess(result).subscribe({
          next: (response) => {
            // Log the success message
            console.log('Successfully created process');
            this.snackBar.open('Successfully Created Process', 'Ok', {
              duration: 1000
            });
            // Refresh the list after a new process is created
            this.getProcessList();
          },
          error: (err) => {
            // Log any errors encountered while creating process.
            console.error('Error Creating Process:', err);
            this.snackBar.open('Error Creating Process - Try Again', 'Ok', {
              duration: 2000
            });
          }
        });
      }
    })
  }

  /** Opens UpdateProcessDialog and then request the backend to update the process with the updated data. */
  updateProcess(process: ProcessList) {
    const dialogRef = this.dialog.open(UpdateProcessDialogComponent, {
      width: '400px', data: {
        process: process,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processService.patchProcess(process.entityId, result).subscribe({
          next: (response) => {
            // Log the success message
            console.log('Successfully updated process');
            this.snackBar.open('Successfully Updated Process', 'Ok', {
              duration: 1000
            });
            // Refresh the list after the process is updated
            this.getProcessList();
          },
          error: (err) => {
            // Log any errors encountered while updating process
            console.error('Error updating process:', err);
            this.snackBar.open('Error Updating Process - Try Again', 'Ok', {
              duration: 2000
            });
          }
        });
      }
    });
  }

  /** Opens DuplicateProcessDialog and then request the backend to create a updated version of the existing process with the provided data. */
  duplicateProcess(process: Process) {
    const dialogRef = this.dialog.open(DuplicateProcessDialogComponent, {
      width: '400px', data: {
        process: process,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processService.duplicateProcess(result).subscribe({
          next: (response) => {
            // Log the success message
            console.log('Successfully duplicated process');
            this.snackBar.open('Successfully Duplicated Process', 'Ok', {
              duration: 1000
            });
            // Refresh the list after a updated version of existing process is created
            this.getProcessList();
          },
          error: (err) => {
            // Log any errors encountered while duplicating process
            console.error('Error duplicating process:', err);
            this.snackBar.open('Error Duplicating Process - Try Again', 'Ok', {
              duration: 2000
            });
          }
        })
      }
    })
  }

  /** Opens DeleteProcessDialog, after user confirmation,deletes the process from the user's perspective. But, this operation archives the process on the backend */
  deleteProcess(processId: any) {
    const dialogRef = this.dialog.open(DeleteProcessDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.processService.archiveProcess(processId).subscribe({
          next: (response) => {
            // Log Success Message
            console.log('Successfully deleted process');
            this.snackBar.open('Successfully Deleted Process', 'Ok', {
              duration: 1000
            });
            // Refresh the list after a  process is archived
            this.getProcessList();
          },
          error: (err) => {
            // Log any errors encountered while deleting process
            console.error('Error deleting process:', err);
            this.snackBar.open('Error Deleting Process - Try Again', 'Ok', {
              duration: 2000
            });
          }
        })
      }
    })
  }

}
