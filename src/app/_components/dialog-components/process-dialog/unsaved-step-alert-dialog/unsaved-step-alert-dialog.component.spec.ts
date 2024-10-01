import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedStepAlertDialogComponent } from './unsaved-step-alert-dialog.component';

describe('UnsavedStepAlertDialogComponent', () => {
  let component: UnsavedStepAlertDialogComponent;
  let fixture: ComponentFixture<UnsavedStepAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsavedStepAlertDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsavedStepAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});