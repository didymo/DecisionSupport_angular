// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { BuildProcessStepsComponent } from './build-process-steps.component';
// import {ActivatedRoute} from "@angular/router";
// import {of} from "rxjs";
// import {provideHttpClient} from "@angular/common/http";
// import {provideHttpClientTesting} from "@angular/common/http/testing";
//
// describe('BuildProcessStepsComponent', () => {
//   let component: BuildProcessStepsComponent;
//   let fixture: ComponentFixture<BuildProcessStepsComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [BuildProcessStepsComponent],
//       providers: [
//         provideHttpClient(),
//         provideHttpClientTesting(),
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             paramMap: of({ get: (key: string) => 'mockParamValue' }), // Mock params as needed
//             snapshot: { paramMap: { get: (key: string) => 'mockParamValue' }}  // Mock snapshot for non-observable values
//           }
//         }
//       ]
//     })
//     .compileComponents();
//
//     fixture = TestBed.createComponent(BuildProcessStepsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
