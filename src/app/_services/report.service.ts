import { Injectable, inject } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);


  getReport(decisionSupportId: string): Observable<Report> {
    const headers = this.authService.getHeaders();
    return this.http.get<any>(`${environment.getDecisionSupportReportURL}${decisionSupportId}?_format=json`,{ headers });
  }

  getReportList(): Observable<ReportList> {
    const headers = this.authService.getHeaders();
    return this.http.get<any>(`${environment.getDecisionSupportReportListURL}`,{ headers });
  }
  

}

