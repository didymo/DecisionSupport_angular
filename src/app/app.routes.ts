import {Routes} from '@angular/router';
import {AuthenticateComponent} from './_components/authenticate/authenticate.component';
import {ProcessListComponent} from './_components/process-list/process-list.component';
import {DecisionSupportListComponent} from './_components/decision-support-list/decision-support-list.component';
import {AuthGuard} from './_services/auth.guard';
import {ManageProcessComponent} from './_components/manage-process/manage-process.component';
import {DecisionSupportComponent} from './_components/decision-support/decision-support.component';
import {HomeComponent} from "./_components/home/home.component";
import {ReportGeneratorComponent} from "./_components/Report-Generator/report-generator.component";


export const appRoutes: Routes = [
    { path: 'user/login', component: AuthenticateComponent},
    { path: 'home', component: HomeComponent},
    { path: 'Report-Generator', component: ReportGeneratorComponent},
    { path: 'process', component:ProcessListComponent, canActivate: [AuthGuard]},
    { path: 'process/:id',component:ManageProcessComponent, canActivate: [AuthGuard]},
    { path: 'support', component: DecisionSupportListComponent, canActivate: [AuthGuard]},
    { path: 'support/:id', component: DecisionSupportComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'user/login' }
];
