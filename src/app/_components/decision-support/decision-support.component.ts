/**
 * @whatItDoes Where 'decision support' happens. The decision support component carries out a process and records the result.
 *
 * @description
 *  This component takes the JSON string from the backend and renders a form to be filled out.
 */

import { Component, OnInit, signal, computed, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Step } from '../../_classes/step';
import { DecisionSupport } from '../../_classes/decision-support';
import { DecisionSupportService } from '../../_services/decision-support.service';
import { AuthService } from '../../_services/auth.service';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';
import { DocumentService } from '../../_services/document.service';
import { MatTooltip } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SaveDecisionSupportDialogComponent } from '../dialog-components/decision-support-dialog/save-decision-support-dialog/save-decision-support-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-decision-support',
  standalone: true,
  imports: [QuillModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatSidenavModule, MatDivider, CommonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatRadioModule, FormsModule, MatCheckbox, MatTooltip, DocumentUploadComponent],
  templateUrl: './decision-support.component.html',
  styleUrl: './decision-support.component.scss'
})

export class DecisionSupportComponent implements OnInit {
  // Variables: Rendering of the form. 
  @ViewChild(DocumentUploadComponent) documentUploadComponent!: DocumentUploadComponent;
  /** Inject Mat Snack Bar */
  private snackBar = inject(MatSnackBar);
  decisionSupport: DecisionSupport | undefined; // Object of the decision support.
  decisionSupportId: string;
  decisionSupportDetails: any;
  processJson: any;
  collapsed = signal(false); // Is the side bar collapsed? (boolean)
  sideNavWidth = computed(() => this.collapsed() ? '65px' : '350px'); // Width of the Side Navigation Bar
  oneStep: any; // Holds the step that is currently selected.
  userChoices = new Map<string, string>(); // Map holding the user's choices for a radiobutton or checkbox.
  editorContent: any; // content of the quill enditor
  response = false; //Boolean value for spinner
  lastStep = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private decisionSupportService: DecisionSupportService,
    private documentService: DocumentService,
    private router: Router,
    private dialog: MatDialog

  ) {
    this.decisionSupportId = this.route.snapshot.params['id'];
    this.decisionSupportDetails = this.route.snapshot.params['json_string'];
  }

  ngOnInit() {
    this.getDecisionSupportDetail();
    
    // I really don't like this...
    //setTimeout(() => {
    //  this.updateSteps();
    //}, 500);
  }

  onSaveDraft() {
    this.decisionSupportService.patchDecisionSupport(this.decisionSupportDetails.entityId, this.decisionSupportDetails).subscribe(
      (data) => {
        console.log("Successfully saved a draft of decision support");
        localStorage.removeItem("decision_support_data");
        this.snackBar.open('Successfully saved changes as draft', 'Ok', {
          duration: 3000
        });
      },
      (error) => {
        console.error('Error saving decision support answers:', error);
        this.snackBar.open('Error saving changes as draft - Try Again', 'Ok', {
          duration: 3000
        });
      }
    );
  }

  onSave() {
    // Handle the form submission logic here
    const dialogRef = this.dialog.open(SaveDecisionSupportDialogComponent, { width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //If the user click save 
        this.decisionSupportDetails.isCompleted = true;
        this.decisionSupportService.patchDecisionSupport(this.decisionSupportDetails.entityId, this.decisionSupportDetails).subscribe(
          (data) => {
            console.log("Successfully saved decision support");
            localStorage.removeItem("decision_support_data");
            this.router.navigate(['/support']);
            this.snackBar.open('Successfully Saved Decision Support', 'Ok', {
              duration: 3000
            });
          },
          (error) => {
            console.error('Error saving decision support answers:', error);
            this.snackBar.open('Error saving Decision Support - Try Again', 'Ok', {
              duration: 3000
            });
          }
        );
      }

    })
  }


  // Initialises the Decision Support
  getDecisionSupportDetail(): void {
    console.log('Calling Decision Support Details!');
    const headers = this.authService.getHeaders(); // authenticates...
    this.decisionSupportService.getDecisionSupport(this.decisionSupportId, headers).subscribe(
      (data) => {
        this.decisionSupportDetails = data;
        this.checkUnSavedData();
        this.response = true;
        if (this.decisionSupportDetails.steps) {
          this.decisionSupportDetails.steps[0].isVisible = true;
          this.oneStep = this.decisionSupportDetails.steps[0];
          this.documentService.setDocumentDetails(this.decisionSupportDetails.entityId, this.decisionSupportDetails.decisionSupportLabel, this.oneStep.id);

          // Update the steps once they've come.
          this.updateSteps();
        }
      },
      (error) => {
        console.error('Error fetching decision support details:', error);
        this.response = true;
      }
    );
  }

  // Puts the Step of the id you passed into oneStep.
  getStep(stepUuid: string) {
    for (const step of this.decisionSupportDetails.steps) {
      if (step && step.stepUuid == stepUuid) {
        this.oneStep = step;
        this.documentService.setDocumentDetails(this.decisionSupportDetails.entityId, this.decisionSupportDetails.label, this.oneStep.id);
        this.documentUploadComponent.getDocumentList();
        //this.decisionSupport = new DecisionSupport(this.oneStep.entityId, this.oneStep.decisionSupportLabel, this.oneStep.decisionSupportId, this.oneStep.isCompleted);

      }
    }
    return [];
  }

  onRadioChange(event: any, step: Step) {
    //store the choice in userChoices
    this.userChoices.set(step.stepUuid, event.value);
    step.answerLabel = this.getChoiceLabel(event.value);
    step.isCompleted = true;
    this.updateLocalStorage();
    const currentindex = step.id;
    this.clearFields(currentindex);
    //determine the next step based on conditions
    this.updateSteps();
  }

  onCheckboxChange(choice: any, step: Step) {
    //store the choice in userChoices
    this.userChoices.set(step.stepUuid, choice.choiceUuid);
    step.isCompleted = true;
    this.updateLocalStorage();
    const selectedChoices = step.choices.filter(c => c.selected);

    step.answer = selectedChoices.map(c => c.description).join(', ');
    const currentindex = step.id;
    this.clearFields(currentindex);
    //determine the next step based on conditions
    if (choice.selected) {
      this.updateSteps();
    }
  }
  
  onTextAnswerChange(step: Step){
    step.isCompleted = true;
    this.updateLocalStorage();
  }

  // Returns the description of a choice (in other words, the value next to a single radio button or checkbox).
  getChoiceLabel(choiceUuid: any) {
    for (const step of this.decisionSupportDetails.steps) {
      for (const choice of step.choices) {
        if (choice.choiceUuid == choiceUuid) {
          return choice.description;
        }
      }
    }
    return "";
  }

  // Updates the form, specifically what steps should be visilbe and therefore accessible at any time.
  updateSteps() {
    let lastVisibleStepIndex = -1;
  
    // Iterate over all steps to update their visibility
    for (let i = 0; i < this.decisionSupportDetails.steps.length; i++) {
      const step = this.decisionSupportDetails.steps[i];
      const isVisible = this.checkVisibility(step);
  
      if (isVisible) {
        lastVisibleStepIndex = i; // Track the index of the last visible step
      }
      // Set visibility for each step
      step.isVisible = isVisible;
    }
    // Check if the currently selected step is the last visible one
    const currentStepIndex = this.decisionSupportDetails.steps.findIndex((step: any) => step === this.oneStep);
    if (currentStepIndex === lastVisibleStepIndex) {
      this.lastStep = true; // Mark that we are at the last step
      this.snackBar.open('No more steps found! - You can save your progress ', 'Ok', {
        duration: 3000
      });
    } else {
      this.lastStep = false;
    }
  }

  // Checks whether a step should be visible and accessible or greyed out and unaccessible.
  checkVisibility(step: any): boolean {
    //if there are no conditions, the step is always visible
    if (!step.conditions || step.conditions.length === 0 || step.isCompleted === true) {
      return true;
    }
    //check each condition
    for (const condition of step.conditions) {
      const userChoice = this.userChoices.get(condition.stepUuid);
      if (userChoice === condition.choiceUuid) {
        return true;
      }
    }
    return false;
  }

  // Returns whether a step is required.
  checkRequiredStatus(step: any): boolean {
    if (step.required == 0) {
      return false;
    }
    return true;
  }
  //Clear invisbile step fields
  clearFields(currentindex: any){
    for (currentindex; currentindex < this.decisionSupportDetails.steps.length; currentindex++) {
      this.decisionSupportDetails.steps[currentindex].isVisible = false;
      this.userChoices.delete(this.decisionSupportDetails.steps[currentindex].stepUuid);
      this.decisionSupportDetails.steps[currentindex].isCompleted = false;
      this.decisionSupportDetails.steps[currentindex].answer = "";
      this.decisionSupportDetails.steps[currentindex].answerLabel = "";
      this.decisionSupportDetails.steps[currentindex].textAnswer = "";
    }
  }

  //Local Storage
  updateLocalStorage(): void {
    localStorage.setItem("decision_support_data", JSON.stringify(this.decisionSupportDetails))
  }

  checkUnSavedData(): void {
    const unsavedData = localStorage.getItem("decision_support_data");
    if (unsavedData) {
      const formattedData = JSON.parse(unsavedData);
      if (formattedData.entityId == this.decisionSupportId) {
        this.decisionSupportDetails = formattedData;
      }
    }
  }
}