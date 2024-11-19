/**
 * @whatItDoes Provides services for the Decision Support Class
 *
 * @description
 *  GET (singular and list), POST, PATCH and ARCHIVE are available.
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {DecisionSupportList} from "../_classes/decision-support-list";
import {DecisionSupport} from '../_classes/decision-support';
import {AuthService} from "./auth.service";
import {LoggingService} from "./logging.service";

@Injectable({
  providedIn: 'root'
})
export class DecisionSupportService {
  constructor(private http: HttpClient, private authService: AuthService, private loggingService: LoggingService) {
  }

  getDecisionSupport(decisionSupportId: string, headers: HttpHeaders): Observable<DecisionSupport> {

    if (!decisionSupportId) {
      throw new Error('DecisionSupport ID cannot be null or undefined. Please provide a valid ID.');
    }
    if (!headers) {
      throw new Error('Authorization headers are missing.');
    }

    return this.http.get<DecisionSupport>(`${environment.getDecisionSupportURL}${decisionSupportId}?_format=json`, {headers});
  }

  getDecisionSupportList(): Observable<DecisionSupportList[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<DecisionSupportList[]>(environment.getDecisionSupportListURL, {headers});
  }

  postDecisionSupport(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<DecisionSupport>(environment.postDecisionSupportURL, data, {headers});
  }

  patchDecisionSupport(decisionSupportId: string, newSteps: any): Observable<DecisionSupport> {
    if (!decisionSupportId) {
      throw new Error('DecisionSupport ID cannot be null or undefined. Please provide a valid ID.');
    }
    if (!newSteps) {
      throw new Error('The newSteps are required.');
    }

    this.loggingService.info('Decision Support ID:', decisionSupportId);
    this.loggingService.info('Patch URL:', `${environment.patchDecisionSupportURL}${decisionSupportId}`);
    this.loggingService.info('Content of the patch:', newSteps);
    const headers = this.authService.getHeaders();
    return this.http.patch<DecisionSupport>(`${environment.patchDecisionSupportURL}${decisionSupportId}`, newSteps, {headers});
  }

  archiveDecisionSupport(decisionSupportId: string): Observable<any> {
    if (!decisionSupportId) {
      throw new Error('DecisionSupport ID cannot be null or undefined. Please provide a valid ID.');
    }
    const headers = this.authService.getHeaders();
    this.loggingService.info('Patch URL:', `${environment.patchDecisionSupportURL}${decisionSupportId}`);
    return this.http.delete<DecisionSupport>(`${environment.archiveDecisionSupportURL}${decisionSupportId}`, {headers});
  }
}
