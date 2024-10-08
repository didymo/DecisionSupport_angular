/**
 * @whatItDoes Where 'decision support' happens. The investigation component carries out a process and records the result.
 *
 * @description
 *  This component takes the JSON string from the backend and renders a form to be filled out.
 */

import { ChangeDetectionStrategy, Component, OnInit, signal, computed, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { QuillModule } from 'ngx-quill';
import { InvestigationList } from '../../_classes/investigation-list';
import { ReportService } from '../../_services/report.service';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';
import {MatTooltip} from "@angular/material/tooltip";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {AuthService} from "../../_services/auth.service";
import {InvestigationService} from "../../_services/investigation.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [QuillModule, MatButtonModule, MatIconModule, MatSidenavModule, MatDivider, CommonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatRadioModule, FormsModule, MatCheckbox, MatTooltip, DocumentUploadComponent, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})

export class ReportComponent implements OnInit {
  panelOpenState = false;

  decisionSupportDetails: any;

  constructor(private http: HttpClient, private authService: AuthService, private reportService: ReportService, private investigatonService: InvestigationService ,private dialog: MatDialog) { }
  ngOnInit(): void {
   this.getDecisionSupportReport();
    //console.log(this.investigations);
    console.log(this.decisionSupportDetails);
    console.log('yo yo');
    this.downloadJson();

  }


  getDecisionSupportReport(): void {
    // @ts-ignore
    this.reportService.getReport('1').subscribe(
      (data) => {this.decisionSupportDetails = data; console.log(data)},
      (error)  => console.error('Error fetching reports: ', error)
    );
  }


  downloadJson(): void{
    const textLines = this.decisionSupportDetails.map((step: { textAnswer: string; id: any; description: any; answerLabel: any; }) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = step.textAnswer;
      const plainText = tempDiv.innerText;

      return `${step.id}. ${step.description}\nAnswer: ${step.answerLabel}\nText Answer: ${plainText.replace(/\n/g, ' ')}\n`;
    });

    const textString = textLines.join('\n');

    const blob = new Blob([textString], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Test' + '.txt';
    link.click();
  }

}
