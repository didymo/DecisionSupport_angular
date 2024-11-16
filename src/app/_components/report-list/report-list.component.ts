
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../_services/auth.service";
import { ReportService } from '../../_services/report.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatTableModule, CommonModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.scss'
})
export class ReportListComponent implements OnInit {

  decisionSupportReports: any; 
  displayedColumns: string[] = ['reportId', 'name', 'processId', 'submittedTime', 'actions']; // machine names for the table's columns.
  response = false;

  constructor(private http: HttpClient, private authService: AuthService, private reportService: ReportService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getInvestigations();
  }

  getInvestigations(): void {
    this.reportService.getReportList().subscribe(
      (data) => { 
        this.decisionSupportReports = data; 
        this.response = true;
      },
      (error) =>{
        // Log any errors encountered while fetching processes
        this.response = true;
         console.error('Error fetching processes');
      } 
    );
    }






}
