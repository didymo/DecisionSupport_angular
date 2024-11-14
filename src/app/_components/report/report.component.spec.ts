// import {ComponentFixture, TestBed} from '@angular/core/testing';
//
// import {ReportComponent} from './report.component';
// import {provideHttpClientTesting} from "@angular/common/http/testing";
// import {provideHttpClient} from "@angular/common/http";
// import {ActivatedRoute} from "@angular/router";
// import {of} from "rxjs";
// import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
//
// describe('ReportComponent', () => {
//   let component: ReportComponent;
//   let fixture: ComponentFixture<ReportComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         ReportComponent,
//         BrowserAnimationsModule,
//       ],
//       providers: [
//         provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
//         provideHttpClientTesting(),
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             paramMap: of({get: (key: string) => (key === 'id' ? 'mockId' : null)})
//           }
//         }
//       ]
//     })
//       .compileComponents();
//
//     fixture = TestBed.createComponent(ReportComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
