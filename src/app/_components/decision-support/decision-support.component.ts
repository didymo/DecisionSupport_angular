/**
 * @whatItDoes Where 'decision support' happens. The decision support component carries out a process and records the result.
 *
 * @description
 *  This component takes the JSON string from the backend and renders a form to be filled out.
 */

import { Component, OnInit, signal, computed, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-decision-support',
  standalone: true,
  imports: [QuillModule, MatButtonModule, MatIconModule, MatSidenavModule, MatDivider, CommonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatRadioModule, FormsModule, MatCheckbox, MatTooltip, DocumentUploadComponent],
  templateUrl: './decision-support.component.html',
  styleUrl: './decision-support.component.scss'
})

export class DecisionSupportComponent implements OnInit {
  // Variables: Rendering of the form. 
  @ViewChild(DocumentUploadComponent) documentUploadComponent!: DocumentUploadComponent;
  decisionSupport: DecisionSupport | undefined; // Object of the decision support.
  decisionSupportId: string;
  decisionSupportDetails: any;
  processJson: any;
  collapsed = signal(false); // Is the side bar collapsed? (boolean)
  sideNavWidth = computed(() => this.collapsed() ? '65px' : '350px'); // Width of the Side Navigation Bar
  oneStep: any; // Holds the step that is currently selected.
  userChoices: Map<string, string> = new Map(); // Map holding the user's choices for a radiobutton or checkbox.
  editorContent: any; // content of the quill enditor

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private decisionSupportService: DecisionSupportService,
    private documentService: DocumentService
   
  ) {
    this.decisionSupportId = this.route.snapshot.params['id'];
    this.decisionSupportDetails = this.route.snapshot.params['json_string'];

  }

  ngOnInit() {
    console.log('In an Decision Support.');
    this.getDecisionSupportDetail();
  }

  onSave() {
    // Handle the form submission logic here
    console.log('Form submitted:', this.decisionSupportDetails);
    this.decisionSupportService.patchDecisionSupport(this.decisionSupportDetails.entityId, this.decisionSupportDetails).subscribe(
      (error) => {
        console.error('Error saving decision support answers:', error)
      }
    );
  }

  // Initialises the Decision Support
  getDecisionSupportDetail(): void {
    console.log('Calling Decision Support Details!');
    const headers = this.authService.getHeaders(); // authenticates...
    this.decisionSupportService.getDecisionSupport(this.decisionSupportId, headers).subscribe(
      (data) => {
        this.decisionSupportDetails = data;
        if (this.decisionSupportDetails.steps) {
          this.decisionSupportDetails.steps[0].isVisible = true;
          this.oneStep = this.decisionSupportDetails.steps[0];
          this.documentService.setDocumentDetails(this.decisionSupportDetails.entityId, this.decisionSupportDetails.decisionSupportLabel,this.oneStep.id);

        }
      },
      (error) => {
        console.error('Error fetching decision support details:', error);
      }
    );
  }

  // Puts the Step of the id you passed into oneStep.
  getStep(stepUuid: string) {
    for (const step of this.decisionSupportDetails.steps) {
      if (step && step.stepUuid == stepUuid) {
        this.oneStep = step;
        this.documentService.setDocumentDetails(this.decisionSupportDetails.entityId, this.decisionSupportDetails.label,this.oneStep.id);
        this.documentUploadComponent.getDocumentList();
        this.decisionSupport = new DecisionSupport(this.oneStep.entityId, this.oneStep.decisionSupportLabel, this.oneStep.decisionSupportId);

      }
    }
    return [];
  }

  onRadioChange(event: any, step: Step) {
    //store the choice in userChoices
    this.userChoices.set(step.stepUuid, event.value);
    step.isCompleted = true;

    var currentindex = step.id;
    for (currentindex; currentindex < this.decisionSupportDetails.steps.length; currentindex++) {
      this.decisionSupportDetails.steps[currentindex].isVisible = false;
      this.userChoices.delete(this.decisionSupportDetails.steps[currentindex].stepUuid);
      this.decisionSupportDetails.steps[currentindex].isCompleted = false;
      this.decisionSupportDetails.steps[currentindex].answer = "";
    }
    //determine the next step based on conditions
    this.updateSteps();
  }

  onCheckboxChange(choice: any, step: Step) {
    //store the choice in userChoices
    this.userChoices.set(step.stepUuid, choice.choiceUuid);
    step.isCompleted = true;

    const selectedChoices = step.choices.filter(c => c.selected);
    console.log("Selected", selectedChoices)
    step.answer = selectedChoices.map(c => c.description).join(', ');

    var currentindex = step.id;
    for (currentindex; currentindex < this.decisionSupportDetails.steps.length; currentindex++) {
      this.decisionSupportDetails.steps[currentindex].isVisible = false;
      this.userChoices.delete(this.decisionSupportDetails.steps[currentindex].stepUuid);
      this.decisionSupportDetails.steps[currentindex].isCompleted = false;
      this.decisionSupportDetails.steps[currentindex].answer = "";
    }
    //determine the next step based on conditions
    if (choice.selected) {
      this.updateSteps();
    }
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
    for (const step of this.decisionSupportDetails.steps) {
      step.isVisible = this.checkVisibility(step);
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
  checkRequiredStatus(step: any): boolean{
    if(step.required == 0){
      return false;
    }
    return true;
  }
}