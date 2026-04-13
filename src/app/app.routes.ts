import { Routes } from '@angular/router';
import { AuthenticateComponent } from './_components/authenticate/authenticate.component';
import { AuthCallbackComponent } from './_components/auth-callback/auth-callback.component';
import { ProcessListComponent } from './_components/process-list/process-list.component';
import { DecisionSupportListComponent } from './_components/decision-support-list/decision-support-list.component';
import { AuthGuard } from './_services/auth.guard';
import { processBuilderGuard } from './_services/process-builder.guard';
import { ManageProcessComponent } from './_components/manage-process/manage-process.component';
import { DecisionSupportComponent } from './_components/decision-support/decision-support.component';
import { HomeComponent } from './_components/home/home.component';
import { ReportListComponent } from './_components/report-list/report-list.component';
import { ReportComponent } from './_components/report/report.component';

export const appRoutes: Routes = [
  { path: 'user/login', component: AuthenticateComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'home', component: HomeComponent },
  { path: 'Report-Generator', component: ReportListComponent, canActivate: [processBuilderGuard] },
  { path: 'Report/:id', component: ReportComponent, canActivate: [processBuilderGuard] },
  { path: 'process', component: ProcessListComponent, canActivate: [AuthGuard] },
  { path: 'process/:id', component: ManageProcessComponent, canActivate: [AuthGuard] },
  { path: 'support', component: DecisionSupportListComponent, canActivate: [AuthGuard] },
  { path: 'support/:id', component: DecisionSupportComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'user/login' }
];
