# Audit Report Assessment

Date: 2026-04-10
Assessor: Claude Sonnet 4.6 (claude-sonnet-4-6)
Assessing: AUDIT_REPORT_2026-04-10.md
Method: Static code review of `src/` — all findings verified directly against source files

---

## Overall Verdict on the Report

The report is accurate and well-grounded. Every high-priority finding is directly verifiable in the code. There are a few places where the framing is slightly imprecise, noted below.

---

## High-Priority Findings — All Confirmed

### Finding 1: Tokens in `localStorage`

**Status: Confirmed.**

`auth.service.ts:232` calls `localStorage.setItem(STORAGE_KEYS.tokenSet, ...)` storing the full `AuthTokenSet` including the refresh token. `restoreTokenSet()` at line 235 reads it back on construction. The PKCE transaction itself correctly uses `sessionStorage`, but the token set — the durable credential — is in `localStorage`. Finding is accurate.

### Finding 2: Draft data in `localStorage`

**Status: Confirmed.**

`decision-support.component.ts:322` writes the entire `decisionSupportDetails` object to `localStorage.setItem("decision_support_data", ...)`. `decision-support-list.component.ts:59` reads the same key. There is no expiry, no scoping, and no cleanup on logout. Finding is accurate.

### Finding 3: Archive requests are malformed

**Status: Confirmed — and this is the most immediately breaking bug.**

Both calls are wrong:

- `process.service.ts:46`: `this.http.patch(..., {headers})` — `{headers}` is passed as the request **body**, not as options
- `document-upload.service.ts:57`: same pattern

`HttpClient.patch(url, body, options)` takes three arguments. Passing `{headers}` as the second argument sends the headers object as the JSON body and attaches no `Authorization` header. The correct call is `http.patch(url, null, { headers })`. These calls will silently send wrong requests and are likely causing live failures.

Note: `getDocumentlist` at line 62 uses `http.get(..., {headers})` which is **correct** — two-argument GET treats the second argument as options. The report correctly cites only line 57 for this file.

---

## Medium-Priority Findings — All Confirmed

### Finding 4: `innerHTML` in report generation

**Status: Confirmed.**

`report.component.ts:73`: `tempDiv.innerHTML = step.step.textAnswer`. The intent is plain-text extraction, but server/user content is still parsed through the HTML engine. `DOMParser` would be safer. Finding is accurate.

### Finding 5: Sensitive payloads logged

**Status: Confirmed, with a nuance the report does not capture.**

`patchDecisionSupport` in `decision-support.service.ts:169-171` logs via `this.loggingService.info(...)`. `LoggingService.info()` is suppressed in production (`if (!this.isProduction)` at line 51), so the payload exposure is a development and staging risk, not a production one. However, `warn()` (line 63) and `error()` (line 76) are always emitted regardless of environment, and error objects passed to those can expose backend structure. The risk is real, but the report slightly overstates production exposure for the `info()` calls specifically.

### Finding 6: Route protection inconsistent

**Status: Confirmed.**

`app.routes.ts:16-18`: `home`, `Report-Generator`, and `Report/:id` have no `canActivate`. Only the `process` and `support` routes are guarded. Finding is accurate.

### Finding 7: Test coverage

**Status: Confirmed, and worse than the report implies.**

`auth.service.spec.ts` has two layers of problems: the original spec is entirely commented out (lines 1–16), and the replacement tests reference `service.login()` — a method that does not exist in the current PKCE auth service. Those tests will fail at runtime. The spec is testing a pre-refactor API that was removed. The report calls coverage "not in a healthy state"; it is more precisely broken.

---

## Code Quality Assessment — Accurate

- **Too much `any`**: Confirmed throughout. `process.service.ts:29,34`, `decision-support.service.ts:122`, `report.component.ts:28-29`.
- **Business logic in components**: Confirmed. `decision-support.component.ts` handles fetch, draft persistence, navigation, file upload coordination, and form validation in a single component.
- **Mutable singleton state**: Confirmed. `document.service.ts` is a plain mutable singleton with public fields and no reactive primitives — fragile for any async component ordering.
- **Inconsistent logging**: Confirmed. `auth.service.ts` uses `console.error` directly at lines 56, 68, 75, 84, 125 while other code routes through `LoggingService`.
- **`toPromise()` usage**: `auth.service.ts:118, 134, 217` all use the deprecated `toPromise()`. The report lists `firstValueFrom` as a replacement in the "change first" list, which is correct.

---

## One Item the Report Does Not Flag

`DocumentUploadService.getDocumentlist()` at line 62 is syntactically correct, but the `any[]` return type and absent error handling are consistent with the broader `any` and logging concerns the report already identifies. Not a new finding, but worth noting when that service is cleaned up.

---

## Priority Ordering Agreement

The report's suggested order — security cleanup, then API/service cleanup, then test baseline, then backend contract refactoring — is correct. The one adjustment worth making: the malformed archive calls (Finding 3) should move to the very top of the security cleanup list because they are actively broken HTTP calls, not a future risk.

---

## Summary

The audit report is a reliable and actionable document. All high-priority findings are real and verified. The most pressing fix is Finding 3 (malformed archive calls) — broken HTTP calls producing silent failures now. The `localStorage` token storage (Finding 1) is the most significant security risk. The test suite (Finding 7) is in worse shape than the report conveys: the replacement tests reference a deleted API surface and will not pass as written.
