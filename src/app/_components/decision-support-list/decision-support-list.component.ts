/**
 * @whatItDoes It's a table that lists all of the active decision supports, gives links to access them and some basic info about each.
 *
 * @description
 *  It's accessible from the "DecisionSupport" tab.
 * The tables has columns: "ID#, Name, Process Type, Time Created"
 * For each decision supports the following actions are available: Open (done by clicking on the name), Delete (Archives It), Change Name
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DecisionSupportList } from '../../_classes/decision-support-list';
import { DecisionSupportService } from '../../_services/decision-support.service';
import { NewDecisionSupportDialogComponent } from '../dialog-components/decision-support-dialog/new-decision-support-dialog/new-decision-support-dialog.component';
import { RenameDecisionSupportDialogComponent } from '../dialog-components/decision-support-dialog/rename-decision-support-dialog/rename-decision-support-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnsavedDecisionSupportAlertDialogComponent } from '../dialog-components/decision-support-dialog/unsaved-decision-support-alert-dialog/unsaved-decision-support-alert-dialog.component';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-decision-support-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatTable, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './decision-support-list.component.html',
  styleUrl: './decision-support-list.component.scss'
})

export class DecisionSupportListComponent implements OnInit {

  decisionSupports: DecisionSupportList[] = []; // Create an array of DecisionSupportList objects.
  processLabel ="";
  response = false; //boolean value for spinner
  displayedColumns: string[] = ['decisionSupportId', 'name', 'processType', 'createdTime', 'updatedTime', 'actions']; // machine names for the table's columns.

  constructor(private decisionSupportService: DecisionSupportService, private dialog: MatDialog, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.getDecisionSupports();
  }

  // Queries the backend and returns all decision supports.
  getDecisionSupports(): void {
    this.decisionSupportService.getDecisionSupportList().subscribe({
      next: (data) => {
         this.decisionSupports = data; 
         this.response = true;
          this.checkUnSavedData();},
      error: (err) => { console.error('Error fetching decision supports: ', err); this.response = true; }
    });
  }

  checkUnSavedData(): void {
    const unsavedData = localStorage.getItem("decision_support_data");
    if (unsavedData && this.decisionSupports) {
      const formattedData = JSON.parse(unsavedData);
      const matchingDecisionSupport = this.decisionSupports.find(d =>d.entityId == formattedData.entityId);
      if (matchingDecisionSupport) {
        const dialogRef = this.dialog.open(UnsavedDecisionSupportAlertDialogComponent, { width: '800px', data: { unSavedData: formattedData } });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            //If the user want to continue. Navigate the user to the desired page
            this.router.navigate(['/support/', formattedData.entityId]);
          }
        })
      } else { localStorage.removeItem("decision_support_data") }
    }
  }

  // Opens NewDecisionSupportDialogComponent and then tells the backend to create a new decision support.
  addDecisionSupport(): void {
    const dialogRef = this.dialog.open(NewDecisionSupportDialogComponent, {
      width: '400px'
    });

    // Recieves result from NewDecisionSupportDialogComponent...
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const formattedData = {
          label: result.name,
          process_id: result.process_id,
          json_string: JSON.stringify({ name: result.name })
        }
        // ... and posts it to the backend!
        this.decisionSupportService.postDecisionSupport(formattedData).subscribe({
          next: (response) => {
            console.log('Successfully added decision support: ', formattedData);
            this.getDecisionSupports();
          },
          error: (err) => {
            console.error('Error adding decision support: ', err);
          }
        });
      }
    });
  }

  // Sends an archive request to the backend.
  archiveDecisionSupport(id: string): void {
    this.decisionSupportService.archiveDecisionSupport(id).subscribe({
      next: (response) => {
        this.getDecisionSupports();
      },
      error: (err) => {
        console.error('Error fetching reports: ', err)
      }
    })
  }

  // Submit's a new name for an decision support.
  renameDecisionSupport(id: string): void {
    // Open the rename decision support dialog component
    const dialogRef = this.dialog.open(RenameDecisionSupportDialogComponent, {
      width: '480px'
    });

    dialogRef.afterClosed().subscribe(result => { //result = the new name
      if (result) {
        // Update the json string to include the new name.
        const headers = this.authService.getHeaders();
        this.decisionSupportService.getDecisionSupport(id, headers).subscribe({
          next: (renamedDS: any) => {
            renamedDS.decisionSupportLabel = result;
            // Send the new json string to the backend to update the entity
            this.decisionSupportService.patchDecisionSupport(id, renamedDS).subscribe({
              next: (response) => {
                console.log('Successfully renamed decision support: ', result);
                this.getDecisionSupports();
              },
              error: (err) => {
                console.error('Error adding decision support: ', err);
              }
            });
          },
          error: (err) => {
            console.error('Error fetching the decision support: ', err);
          }
        });

        
      }
    });
  }
}