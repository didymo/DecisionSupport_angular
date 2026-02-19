/**
 * @whatItDoes It allows user to easily navigate between tabs like build, edit and preview
 * @description
 * The mat tab group contains three tabs build, edit and preview. The user can navigate to each component by selecting a tab in tab group.
 */

import { Component } from '@angular/core';

import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { BuildProcessStepsComponent } from '../build-process-steps/build-process-steps.component';
import { EditProcessStepsComponent } from '../edit-process-steps/edit-process-steps.component';
import { PreviewProcessStepsComponent } from '../preview-process-steps/preview-process-steps.component';
@Component({
    selector: 'app-manage-process',
    imports: [MatTabsModule, BuildProcessStepsComponent, EditProcessStepsComponent, PreviewProcessStepsComponent],
    templateUrl: './manage-process.component.html',
    styleUrl: './manage-process.component.scss'
})
export class ManageProcessComponent {
  /** Initializing the selected tab index to 0 --> Build Tab */
  selectedTabIndex = 0;

  /** Change the selectedtabindex when any tab change detected */
  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }
}
