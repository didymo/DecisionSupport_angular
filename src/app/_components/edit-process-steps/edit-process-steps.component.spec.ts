// import {ComponentFixture, TestBed} from '@angular/core/testing';
//
// import {EditProcessStepsComponent} from './edit-process-steps.component';
// import {ActivatedRoute} from "@angular/router";
// import {of} from "rxjs";
// import {provideHttpClientTesting} from "@angular/common/http/testing";
// import {provideHttpClient} from "@angular/common/http";
//
// describe('EditProcessStepsComponent', () => {
//   let component: EditProcessStepsComponent;
//   let fixture: ComponentFixture<EditProcessStepsComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [EditProcessStepsComponent],  // Use imports for standalone components
//       providers: [
//         provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
//         provideHttpClientTesting(),
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             paramMap: of({get: (key: string) => 'mockParamValue'}),  // Mock param map observable
//             snapshot: {paramMap: {get: (key: string) => 'mockParamValue'}}  // Mock snapshot params
//           }
//         }
//       ]
//     })
//       .compileComponents();
//
//     fixture = TestBed.createComponent(EditProcessStepsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
