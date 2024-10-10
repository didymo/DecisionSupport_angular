/**
 * @whatItDoes It's a table that lists all of the active decision supports, gives links to access them and some basic info about each.
 *
 * @description
 *  It's accessible from the "DecisionSupport" tab.
 * The tables has columns: "ID#, Name, Process Type, Time Created"
 * For each decision supports the following actions are available: Open (done by clicking on the name), Delete (Archives It), Change Name
 */

import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../_services/auth.service';
import { DecisionSupportList } from '../../_classes/decision-support-list';
import { DecisionSupportService } from '../../_services/decision-support.service';
import { NewDecisionSupportDialogComponent } from '../dialog-components/decision-support-dialog/new-decision-support-dialog/new-decision-support-dialog.component';
import { RenameDecisionSupportDialogComponent } from '../dialog-components/decision-support-dialog/rename-decision-support-dialog/rename-decision-support-dialog.component';

@Component({
  selector: 'app-decision-support-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatTable, MatTableModule],
  templateUrl: './decision-support-list.component.html',
  styleUrl: './decision-support-list.component.scss'
})

export class DecisionSupportListComponent {

  decisionSupports: DecisionSupportList[] = []; // Create an array of DecisionSupportList objects.
  displayedColumns: string[] = ['decisionSupportId', 'name', 'processId', 'createdTime', 'updatedTime', 'actions']; // machine names for the table's columns.

  constructor(private http: HttpClient, private authService: AuthService, private decisionSupportService: DecisionSupportService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getDecisionSupports();
    console.log(this.decisionSupports);
  }

  // Queries the backend and returns all decision supports.
  getDecisionSupports(): void {
    this.decisionSupportService.getDecisionSupportList().subscribe({
      next: (data) => this.decisionSupports = data,
      error: (err) => console.error('Error fetching reports: ', err)
    });
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
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => { //result = the new name
      if (result) {
        this.decisionSupportService.patchDecisionSupport(id, null).subscribe({  // Need to edit the patch decision support function to accept "name" as a third parameter
          next: (response) => {
            console.log('Successfully renamed decision support: ', result);
            this.getDecisionSupports();
          },
          error: (err) => {
            console.error('Error adding decision support: ', err);
          }
        });
      }
    });
  }
}