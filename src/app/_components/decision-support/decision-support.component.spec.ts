// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { DecisionSupportComponent } from './decision-support.component';
// import {ActivatedRoute} from "@angular/router";
// import {of} from "rxjs";
// import {provideHttpClientTesting} from "@angular/common/http/testing";
// import {provideHttpClient} from "@angular/common/http";
//
// describe('DecisionSupportComponent', () => {
//   let component: DecisionSupportComponent;
//   let fixture: ComponentFixture<DecisionSupportComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         DecisionSupportComponent
//       ],
//       providers: [
//         provideHttpClient(),
//         provideHttpClientTesting(),
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             // paramMap: of({ get: (key: string) => 'mockParamValue' }),
//             paramMap: of({ get: (key: string) => key === 'id' ? 'mockId' : null }),
//             snapshot: { paramMap: { get: (key: string) => 'mockParamValue' }}
//           }
//         }
//       ]
//     })
//     .compileComponents();
//
//     fixture = TestBed.createComponent(DecisionSupportComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
