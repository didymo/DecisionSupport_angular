// import {ComponentFixture, TestBed} from '@angular/core/testing';
//
// import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//
// import {ProcessListComponent} from './process-list.component';
// import {provideHttpClientTesting} from "@angular/common/http/testing";
// import {provideHttpClient} from "@angular/common/http";
// import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
//
// describe('ProcessListComponent', () => {
//   let component: ProcessListComponent;
//   let fixture: ComponentFixture<ProcessListComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         ProcessListComponent,
//         BrowserAnimationsModule
//       ],
//       providers: [
//         provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
//         provideHttpClientTesting(),
//         {provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
//         {provide: MAT_DIALOG_DATA, useValue: {}}  // Add any specific mock data if required
//       ]
//     })
//       .compileComponents();
//
//     fixture = TestBed.createComponent(ProcessListComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
//
