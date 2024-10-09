import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

// import {Report} from '../_classes/report';
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getReport(decisionSupportId: string): Observable<Report> {
    const headers = this.authService.getHeaders();
    return this.http.get<any>(`${environment.getDecisionSupportReportURL}${decisionSupportId}?_format=json`,{ headers });
  }

  getDocumentlist(decisionSupportId:string){
    const headers =this.authService.getHeaders();
    return this.http.get<any[]>(`${environment.getDecisionSupportDocumentsURL}${decisionSupportId}`, {headers});
  }
}
