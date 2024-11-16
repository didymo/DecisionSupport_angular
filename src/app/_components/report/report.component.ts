/**
 * @whatItDoes Where 'decision support report'. The Report component to generate report.
 *
 * @description
 *  This component takes the JSON string from the backend and renders a report .
 */


import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MatButtonModule, MatDivider, CommonModule, MatProgressSpinnerModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})

export class ReportComponent implements OnInit {
  documentList: any[] = [];
  decisionSupportDetails: any = null;
  supportId: any;
  response = false;

  constructor(private reportService: ReportService, private route: ActivatedRoute) {
    this.supportId = this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.getDecisionSupportReport();
  }


  getDecisionSupportReport(): void {
    this.reportService.getReport(this.supportId).subscribe(
      (data) => {
        this.decisionSupportDetails = data;
        this.response = true;
        console.log(this.decisionSupportDetails)
      }, (error) => {
        // Log any errors encountered while fetching processes
        this.response = true;
        console.error('Error fetching reports', error);

      }
    )
  }

  downloadJson(): void {
    // Check if decisionSupportDetails and steps are defined
    if (!this.decisionSupportDetails || !this.decisionSupportDetails.steps) {
      console.error('No decision support details found.');
      return;
    }
    // Extract processLabel, reportLabel, and submittedTime
    const processLabel = this.decisionSupportDetails.processLabel || 'N/A';
    const reportLabel = this.decisionSupportDetails.reportLabel || 'N/A';
    const submittedTime = this.decisionSupportDetails.submittedTime || 'N/A';

    // Create a header for the report
    const header = `Report Label: ${reportLabel}\nProcess Name: ${processLabel}\nSubmitted Time: ${submittedTime}\n\n`;

    // Create an array of text lines for each step
    const textLines = this.decisionSupportDetails.steps.map((step: { step: { textAnswer: string; id: any; description: any; answerLabel: any; }; attachedFiles: any[]; }) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = step.step.textAnswer; // Accessing the textAnswer correctly
      const plainText = tempDiv.innerText;



      const filesList = step.attachedFiles.map(file => {
        return `Label: ${file.label}, Entity ID: ${file.entityId}, File ID: ${file.fileEntityId}`;
      }).join('\n'); // Join the files with a newline

      // Only include the attached files section if there are visible files
      const filesSection = filesList.length > 0 ? `Attached Files:\n${filesList}` : '';

      // Constructing the output for each step
      return `Q${step.step.id}: ${step.step.description}\nAnswer: ${step.step.answerLabel}\nText Answer: ${plainText.replace(/\n/g, ' ')}\n${filesSection}`;
    });

    // Join all text lines into a single string
    const textString = header + '\n\n' + textLines.join('\n\n');

    // Create a Blob and download the text file
    const blob = new Blob([textString], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = reportLabel + '-Report.txt';
    link.click();
  }
}


