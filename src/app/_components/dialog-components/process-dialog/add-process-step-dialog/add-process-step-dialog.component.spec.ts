// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//
// import { AddProcessStepDialogComponent } from './add-process-step-dialog.component';
// import {provideHttpClientTesting} from "@angular/common/http/testing";
// import {provideHttpClient} from "@angular/common/http";
//
// describe('AddProcessStepDialogComponent', () => {
//   let component: AddProcessStepDialogComponent;
//   let fixture: ComponentFixture<AddProcessStepDialogComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AddProcessStepDialogComponent],
//       providers: [
//         provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
//         provideHttpClientTesting(),
//         { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },  // Mock MatDialogRef with a 'close' spy
//         { provide: MAT_DIALOG_DATA, useValue: {} }  // Provide any necessary mock data
//       ]
//     })
//     .compileComponents();
//
//     fixture = TestBed.createComponent(AddProcessStepDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
