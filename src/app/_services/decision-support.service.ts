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

  /**
   * Fetches a specific Decision Support record by its ID.
   *
   * @param decisionSupportId - The unique identifier of the Decision Support record to retrieve.
   * @param headers - The HTTP headers, including authorization, required for the request.
   *
   * @returns An `Observable` emitting the retrieved `DecisionSupport` object.
   *
   * @throws Error if the `decisionSupportId` is null, undefined, or an empty string.
   * @throws Error if the `headers` parameter is not provided, as authorization is mandatory.
   *
   * @security
   * - Ensures `decisionSupportId` is validated to prevent accidental or malicious misuse.
   * - Requires `headers` to include appropriate authorization to protect sensitive data.
   *
   * @usage
   * Ensure `decisionSupportId` and `headers` are correctly populated before calling this method.
   * ```typescript
   * const headers = new HttpHeaders({
   *   'Authorization': `Bearer ${authToken}`
   * });
   * service.getDecisionSupport('12345', headers).subscribe({
   *   next: (data) => console.log(data),
   *   error: (err) => console.error(err)
   * });
   * ```
   */
  getDecisionSupport(decisionSupportId: string, headers: HttpHeaders): Observable<DecisionSupport> {

    if (!decisionSupportId) {
      throw new Error('DecisionSupport ID cannot be null or undefined. Please provide a valid ID.');
    }
    if (!headers) {
      throw new Error('Authorization headers are missing.');
    }

    return this.http.get<DecisionSupport>(`${environment.getDecisionSupportURL}${decisionSupportId}?_format=json`, {headers});
  }

  /**
   * Retrieves the list of Decision Support records.
   *
   * @returns An `Observable` emitting an array of `DecisionSupportList` objects.
   *
   * @description
   * This method fetches all Decision Support records available to the user. It uses the
   * authorization headers retrieved from the `AuthService` to ensure that the request is authenticated.
   *
   * @security
   * - Ensures that only authenticated users can access the Decision Support list by attaching authorization headers.
   * - Leverages the `AuthService` to securely obtain and validate authentication tokens.
   *
   * @usage
   * Call this method to retrieve a list of all available Decision Support records:
   * ```typescript
   * service.getDecisionSupportList().subscribe({
   *   next: (data) => console.log(data),
   *   error: (err) => console.error(err)
   * });
   * ```
   *
   * @throws Error if the `AuthService.getHeaders` fails to provide valid authentication headers.
   */
  getDecisionSupportList(): Observable<DecisionSupportList[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<DecisionSupportList[]>(environment.getDecisionSupportListURL, {headers});
  }

  /**
   * Creates a new Decision Support record.
   *
   * @param data - The data object representing the Decision Support record to be created.
   *               Ensure that the object adheres to the expected structure for the API.
   *
   * @returns An `Observable` emitting the response from the server, typically containing the created record or a success status.
   *
   * @description
   * This method sends a POST request to the server to create a new Decision Support record.
   * It uses authorization headers obtained from the `AuthService` to authenticate the request.
   *
   * @security
   * - Authenticates the request by attaching authorization headers retrieved from the `AuthService`.
   * - Ensures sensitive operations such as record creation are securely managed.
   *
   * @usage
   * Use this method to create a new Decision Support record:
   * ```typescript
   * const newRecord = { name: 'New Decision Support', steps: ['Step 1', 'Step 2'] };
   * service.postDecisionSupport(newRecord).subscribe({
   *   next: (response) => console.log('Record created successfully:', response),
   *   error: (err) => console.error('Failed to create record:', err)
   * });
   * ```
   *
   * @throws Error if the `AuthService.getHeaders` fails to provide valid authentication headers.
   */
  postDecisionSupport(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<DecisionSupport>(environment.postDecisionSupportURL, data, {headers});
  }

  /**
   * Updates a Decision Support record with new steps.
   *
   * @param decisionSupportId - The unique identifier of the Decision Support record to update.
   *                            This ID must not be null or undefined.
   * @param newSteps - The object containing the updated steps for the Decision Support record.
   *                   This must not be null or undefined.
   *
   * @returns An `Observable` emitting the updated `DecisionSupport` record returned by the server.
   *
   * @description
   * This method sends a PATCH request to update the specified Decision Support record with the provided steps.
   * It validates the inputs and logs the request details for debugging and auditing purposes.
   * Authorization headers are added to the request using the `AuthService`.
   *
   * @security
   * - Ensures secure updates by authenticating requests with headers retrieved from the `AuthService`.
   * - Prevents invalid operations by validating input parameters.
   * - Logs key details of the update operation for traceability without exposing sensitive data.
   *
   * @usage
   * Use this method to update a Decision Support record:
   * ```typescript
   * const updatedSteps = { steps: ['Updated Step 1', 'Updated Step 2'] };
   * service.patchDecisionSupport('12345', updatedSteps).subscribe({
   *   next: (response) => console.log('Record updated successfully:', response),
   *   error: (err) => console.error('Failed to update record:', err)
   * });
   * ```
   *
   * @throws Error if:
   * - `decisionSupportId` is null or undefined.
   * - `newSteps` is null or undefined.
   */
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

  /**
   * Archives a Decision Support record by its ID.
   *
   * @param decisionSupportId - The unique identifier of the Decision Support record to be archived.
   *                            This ID must not be null or undefined.
   *
   * @returns An `Observable` emitting the server's response for the archive operation.
   *
   * @description
   * This method sends a DELETE request to archive the specified Decision Support record.
   * It ensures the provided ID is valid and logs the operation for debugging and auditing purposes.
   * Authorization headers are securely attached to the request using the `AuthService`.
   *
   * @security
   * - Validates input to prevent invalid or unauthorized requests.
   * - Ensures all requests are authenticated using headers obtained from the `AuthService`.
   * - Logs the request details for traceability while avoiding exposure of sensitive data.
   *
   * @usage
   * Use this method to archive a Decision Support record:
   * ```typescript
   * service.archiveDecisionSupport('12345').subscribe({
   *   next: (response) => console.log('Record archived successfully:', response),
   *   error: (err) => console.error('Failed to archive record:', err)
   * });
   * ```
   *
   * @throws Error if:
   * - `decisionSupportId` is null or undefined.
   */
  archiveDecisionSupport(decisionSupportId: string): Observable<any> {
    if (!decisionSupportId) {
      throw new Error('DecisionSupport ID cannot be null or undefined. Please provide a valid ID.');
    }
    const headers = this.authService.getHeaders();
    this.loggingService.info('Patch URL:', `${environment.patchDecisionSupportURL}${decisionSupportId}`);
    return this.http.delete<DecisionSupport>(`${environment.archiveDecisionSupportURL}${decisionSupportId}`, {headers});
  }
}
