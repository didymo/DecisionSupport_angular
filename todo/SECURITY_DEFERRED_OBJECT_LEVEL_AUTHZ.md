# Deferred Security Investigation: Object-Level Authorization (Angular)

**Status:** Deferred — Drupal investigation must complete first; Angular changes follow
**Identified:** 2026-04-10 (audit)
**Documented:** 2026-04-11
**Severity:** High (downstream consumer of the Drupal IDOR gap)

Coordination-level document (cross-project context and decision log):
`/extra/Agent_Coordination/decision-support-coordination/SECURITY_DEFERRED_OBJECT_LEVEL_AUTHZ.md`

Drupal-side document:
`/extra/PhpstormProjects/d11.dsd.didymodesigns.com.au/custom/SECURITY_DEFERRED_OBJECT_LEVEL_AUTHZ.md`

---

## Angular's relationship to this issue

Angular is not the source of the vulnerability — the gap is in the Drupal service layer.
However, Angular is the client that sends entity IDs in requests, and when Drupal adds
object-level authorization, Angular must be updated to handle the resulting 403 responses
correctly. Implementing Drupal-side fixes without the Angular changes will cause silent
failures or unhandled errors in the UI.

---

## Current behaviour

Angular services construct URLs using entity IDs obtained from list responses or stored
state. No Angular code validates whether the current user owns a given ID before sending
it to the backend. This is appropriate — ownership enforcement belongs on the server.
The issue is that the server currently does not enforce it.

---

## Affected Angular services and calls

These are the service methods that send entity IDs to the endpoints that will gain
owner-only access control on the Drupal side. Each will receive a 403 when Drupal
adds the check and the caller does not own the target entity.

### `decision-support.service.ts`

| Method | Endpoint | What happens on 403 after Drupal fix |
|---|---|---|
| `getDecisionSupport(id)` | `GET /rest/support/get/{id}` | Currently unhandled — observable errors silently or surfaces as a generic error |
| `patchDecisionSupport(id, data)` | `PATCH /rest/support/update/{id}` | Currently unhandled |
| `archiveDecisionSupport(id)` | `DELETE /rest/support/archive/{id}` | Currently unhandled |
| `getDecisionSupportReport(id)` | `GET /rest/support/report/{id}` | Currently unhandled |

File: `src/app/_services/decision-support.service.ts`

### `process.service.ts`

| Method | Endpoint | What happens on 403 after Drupal fix |
|---|---|---|
| `getProcessSteps(id)` | `GET /rest/process/get/{id}` | Currently unhandled |
| `patchProcess(id, data)` | `PATCH /rest/process/update/{id}` | Currently unhandled |
| `archiveProcess(id)` | `PATCH /rest/process/delete/{id}` | Currently unhandled |

File: `src/app/_services/process.service.ts`

### `document-upload.service.ts`

| Method | Endpoint | What happens on 403 after Drupal fix |
|---|---|---|
| `archiveDecisionSupportDocument(fileId)` | `PATCH /rest/support/file/archive/{fileId}` | Currently unhandled |

File: `src/app/_services/document-upload.service.ts`

---

## What Angular needs to change when Drupal implements the fix

### 1. Centralised 403 handling

Add a 403 case to the HTTP interceptor (or create one if not present). A 403 from an
entity endpoint means the user is authenticated but is trying to access a record they
do not own. This is distinct from a 401 (not authenticated) and should produce a
user-facing message rather than a redirect to login.

Suggested location: the existing auth interceptor in `src/app/_services/` or a new
`error.interceptor.ts`.

```typescript
// In the interceptor error handler:
if (error.status === 403) {
  // Do not redirect to login — the user is authenticated.
  // Show a snackbar or navigate to an "access denied" state.
  // Do not expose the technical detail to the user.
}
```

### 2. Per-service error handling for destructive operations

Archive and patch calls in particular should catch 403 and surface a clear message
to the user — e.g. "You do not have permission to modify this record."

### 3. List endpoints — confirm filtering behaviour first

If `GET /rest/support/list` and `GET /rest/process/list` already return only the calling
user's own records (to be confirmed during investigation — see coordination doc), then
the UI will never surface an ID the user does not own through normal navigation, and the
403s above will only occur on direct API access or enumeration attempts.

If the list endpoints return all records regardless of ownership, Angular may need to
filter or adjust UI elements based on ownership metadata returned by those endpoints.
This depends on the product decision about whether editors see each other's records.

---

## Investigation questions for Angular

1. **Does any component navigate to an entity ID not returned from the current user's
   list?** Review `decision-support.component.ts`, `process-list.component.ts`, and
   `report.component.ts` for hardcoded IDs, route parameters, or stored state that
   could reference entities not owned by the caller.

2. **Is there a route or component that allows an admin to view another user's records
   in the current UI?** If so, that workflow must be accounted for in the Drupal
   owner-check design (admin bypass).

3. **What is the current UX when a backend call returns an error?** Audit error handling
   in the affected components to understand what the user sees today on a 500 vs what
   they should see on a 403.

---

## Sequencing

Angular changes are downstream of Drupal changes. Do not implement Angular 403 handling
in isolation — it has no effect until Drupal adds the owner checks.

Recommended order:
1. Complete the investigation (ownership data audit, product decision on access model)
2. Implement and test Drupal owner checks behind a feature flag or on a non-production
   environment
3. Verify Angular behaviour against the updated Drupal environment
4. Implement Angular 403 handling
5. Test end-to-end before deploying to production

---

## Decision log

| Date | Decision | Reason |
|---|---|---|
| 2026-04-11 | Deferred pending Drupal investigation | Angular changes are follow-on; cannot be meaningfully implemented until the Drupal access model is defined and tested |
