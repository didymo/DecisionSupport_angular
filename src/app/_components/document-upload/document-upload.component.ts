/**
 * @whatItDoes Allows the user to upload documents to a decision support.
 *
 * @description
 *  Provides functions for handling the uploading and display of documents.
 *  Uploaded documents cannnot be accessed after uploading, only their names displayed.
 */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DocumentUploadService } from '../../_services/document-upload.service';
import { DocumentService } from '../../_services/document.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatDivider, MatListModule],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.scss'
})
export class DocumentUploadComponent implements OnInit {
  selectedFile: File | null = null;
  uploadResponse: string | null = null;
  documentList: any[] = [];
  filteredDocumentList: any[] = [];
  private snackBar = inject(MatSnackBar);

  constructor(private documentUploadService: DocumentUploadService, private documentService: DocumentService) { }

  ngOnInit() {
    this.getDocumentList();

  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      console.error('No file selected');
      this.snackBar.open(`No File Selected`, 'Ok', {
              duration: 1000
            }); 
      return;
    }

    this.documentUploadService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload complete:', response);
         this.snackBar.open(`Document Uploaded Successfully`, 'Ok', {
              duration: 1000
            }); 
        this.selectedFile = null;
        // Extract the fid from the response
        const fileFid = response?.fid?.[0]?.value;
        if (fileFid) {
          // Proceed to create the decision support document entity in the backend.
          this.createDecisionSupportDocument(fileFid);
        } else {
          console.error('File fid not found in the response');
          this.uploadResponse = 'File upload successful, but file fid is missing.';
           this.snackBar.open('File upload successful, but file fid is missing.', 'Ok', {
              duration: 1000
            });
            this.selectedFile = null;
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploadResponse = `Upload failed: ${err.message}`;
        this.snackBar.open(`Upload failed: ${err.message}`, 'Ok');
        this.selectedFile = null;
      }
    });
  }

  createDecisionSupportDocument(fid: string): void {
    const label = this.documentService.getLabel();
    const notes = 'This is a test document';
    const stepId = this.documentService.getStepId();  
    const decisionSupportId = this.documentService.getDecisionSupportId();

    this.documentUploadService.createDecisionSupportDocument(fid, label, notes, stepId, decisionSupportId).subscribe({
      next: (response) => {
        console.log('Decision Support document creation complete:', response);
        this.uploadResponse = `Upload and entity creation successful: ${JSON.stringify(response)}`;
        this.getDocumentList();
      },
      error: (err) => {
        console.error('Entity creation error:', err);
        this.uploadResponse = `Entity creation failed: ${err.message}`;
      }
    });
  }

  getDocumentList(): void {
    this.documentUploadService.getDocumentlist(this.documentService.getDecisionSupportId()).subscribe({
      next: (data) => {
        this.documentList = data;
        const stepId = this.documentService.getStepId();
        this.filteredDocumentList = this.documentList.filter(d => d.stepId == stepId);
      },
      error: (err) => console.error('Error fetching reports', err)
    });
  }

  deleteDocument(fileId: string):void{
    this.documentUploadService.archiveDecisionSupportDocument(fileId).subscribe({
      next: (response) =>{
        console.log('Successfully archived decision support document ', fileId);
        this.getDocumentList();
        this.snackBar.open('File Deleted', 'Ok', {
              duration: 1000
            });
      },
      error: (err) =>{
        console.error('Error archiving decision support document', err);
        this.snackBar.open("Couldn't delete file. Try Again!", 'Ok', {
              duration: 1000
            });
      }
    })
  }
}