// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
// import { ManageProcessComponent } from './manage-process.component';
// import {ActivatedRoute} from "@angular/router";
// import {of} from "rxjs";
//
// describe('ManageProcessComponent', () => {
//   let component: ManageProcessComponent;
//   let fixture: ComponentFixture<ManageProcessComponent>;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ManageProcessComponent],
//       providers: [
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             paramMap: of({ get: (key: string) => 'mockParamValue' }),  // Mock params as needed
//             snapshot: { paramMap: { get: (key: string) => 'mockParamValue' }}   // Mock snapshot for non-observable values
//           }
//         }
//       ]
//     })
//     .compileComponents();
//
//     fixture = TestBed.createComponent(ManageProcessComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
