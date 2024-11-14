// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { EditProcessStepDialogComponent } from './edit-process-step-dialog.component';
// import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
// import {ActivatedRoute} from "@angular/router";
// import {of} from "rxjs";
//
// describe('EditProcessStepDialogComponent', () => {
//   let component: EditProcessStepDialogComponent;
//   let fixture: ComponentFixture<EditProcessStepDialogComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [EditProcessStepDialogComponent],
//       providers: [
//         { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
//         {  provide: MAT_DIALOG_DATA, useValue: {} },  // Adjust mock data as needed
//                 {
//           provide: ActivatedRoute,
//           useValue: {
//             paramMap: of({ get: (key: string) => (key === 'id' ? 'mockId' : null) })
//           }
//         }
//       ]
//     })
//     .compileComponents();
//
//     fixture = TestBed.createComponent(EditProcessStepDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
