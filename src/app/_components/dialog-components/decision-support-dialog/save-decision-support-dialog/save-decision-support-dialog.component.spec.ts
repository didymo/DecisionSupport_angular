import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SaveDecisionSupportDialogComponent } from './save-decision-support-dialog.component';

describe('SaveDecisionSupportDialogComponent', () => {
  let component: SaveDecisionSupportDialogComponent;
  let fixture: ComponentFixture<SaveDecisionSupportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveDecisionSupportDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} }  // Replace {} with actual mock data if needed
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveDecisionSupportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
