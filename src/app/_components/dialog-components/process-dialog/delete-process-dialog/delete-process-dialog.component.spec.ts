import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeleteProcessDialogComponent} from './delete-process-dialog.component';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";


describe('DeleteProcessDialogComponent', () => {
  let component: DeleteProcessDialogComponent;
  let fixture: ComponentFixture<DeleteProcessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProcessDialogComponent],
      providers: [
        provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
        provideHttpClientTesting(),
        {provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
