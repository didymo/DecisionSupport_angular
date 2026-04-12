# Angular `src` Audit Report

Date: 2026-04-10
Project: `DecisionSupport_angular`
Scope: Entire codebase under `src/`
Reviewer focus: Security, robustness, code quality, refactor opportunities, and strengths relevant to the Drupal integration refactor

## Executive Summary

The branch is moving in a better direction on authentication by adopting OAuth/OIDC-style flows with PKCE, central auth state, and a shared interceptor. That is a material improvement over ad hoc token handling.

The main risks are still significant:

- Access and refresh tokens are persisted in `localStorage`
- Sensitive decision-support draft data is persisted in `localStorage`
- A couple of authenticated archive calls are malformed and likely omit headers
- Report generation still parses HTML through `innerHTML`
- Logging still exposes business payloads and error detail too freely
- Route protection is inconsistent
- Test coverage is too weak to support a safe backend compatibility refactor

Overall assessment:

- Security posture: improved, but not yet robust enough for sensitive workflow data
- Code quality: mixed; some good structural intent, but too much `any`, duplicated patterns, and stateful UI coupling
- Refactor readiness: moderate at best; the auth base is workable, but service/component cleanup and test restoration should happen before deeper Drupal contract changes

## High-Priority Findings

### 1. Tokens are stored in `localStorage`

Severity: High

Files:

- [src/app/_services/auth.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/auth.service.ts#L232)
- [src/app/_services/auth.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/auth.service.ts#L236)
- [src/environments/environment.ts](/extra/WebstormProjects/DecisionSupport_angular/src/environments/environment.ts#L15)

Why this matters:

- Any XSS issue in the app or a related origin can expose both access and refresh tokens
- Refresh token theft is especially serious because it enables durable session hijack
- This is a poor fit for an application handling decision-support data that may be sensitive or operationally important

Recommendation:

- Prefer a backend session or BFF model
- If frontend OAuth must remain, keep access tokens in memory and use a more controlled refresh strategy
- Avoid storing refresh tokens in `localStorage`

### 2. Decision-support draft data is stored in `localStorage`

Severity: High

Files:

- [src/app/_components/decision-support/decision-support.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/decision-support/decision-support.component.ts#L321)
- [src/app/_components/decision-support/decision-support.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/decision-support/decision-support.component.ts#L330)
- [src/app/_components/decision-support-list/decision-support-list.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/decision-support-list/decision-support-list.component.ts#L59)

Why this matters:

- Unsaved answers persist indefinitely in the browser
- Sensitive case content may survive logout, crashes, or shared-device reuse
- The storage model sits outside server-side access control and retention policies

Recommendation:

- Store drafts server-side
- If local draft support is required, use `sessionStorage`, add expiry metadata, and scope the stored payload tightly

### 3. Archive requests are malformed and likely unauthenticated

Severity: High

Files:

- [src/app/_services/process.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/process.service.ts#L46)
- [src/app/_services/document-upload.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/document-upload.service.ts#L57)

Why this matters:

- These calls appear to send `{ headers }` as the request body, not as request options
- That likely means the actual `Authorization` header is never attached
- This can cause subtle failures against the updated Drupal install and may be misdiagnosed as backend incompatibility

Recommendation:

- Fix these immediately to use the proper Angular `HttpClient.patch(url, body, options)` signature

## Medium-Priority Findings

### 4. Report generation uses `innerHTML`

Severity: Medium

File:

- [src/app/_components/report/report.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/report/report.component.ts#L72)

Why this matters:

- The code uses a temporary DOM node and assigns backend/user-authored text through `innerHTML`
- Even though the goal is plain-text extraction, this is still the wrong trust boundary
- It increases risk if content rules loosen later or richer HTML is stored

Recommendation:

- Sanitize before parsing or convert rich text to plain text without `innerHTML`
- Keep report export on a strict plain-text path

### 5. Sensitive payloads are logged

Severity: Medium

Files:

- [src/app/_services/decision-support.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/decision-support.service.ts#L169)
- [src/app/_services/decision-support.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/decision-support.service.ts#L171)
- [src/app/_services/logging.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/logging.service.ts#L63)
- [src/app/_services/logging.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/logging.service.ts#L76)

Why this matters:

- Full business payloads should not be printed in browser logs
- Error objects can leak request structure, backend details, or user content
- Browser console data often ends up in screenshots, support sessions, and diagnostics

Recommendation:

- Remove payload logging
- Standardize structured, redacted logging
- In production, log only minimal metadata needed for supportability

### 6. Route protection is inconsistent

Severity: Medium

File:

- [src/app/app.routes.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/app.routes.ts#L13)

Why this matters:

- `process` and `support` routes are guarded
- `home`, `Report-Generator`, and `Report/:id` are not
- If reports or lists are sensitive, frontend access control is inconsistent even if backend authorization still exists

Recommendation:

- Guard all authenticated application routes consistently
- Leave only login and callback routes public

### 7. Test coverage is not in a healthy state

Severity: Medium

Representative files:

- [src/app/_services/auth.service.spec.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/auth.service.spec.ts#L62)
- [src/app/_components/decision-support/decision-support.component.spec.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/decision-support/decision-support.component.spec.ts#L9)
- [src/app/_components/process-list/process-list.component.spec.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/process-list/process-list.component.spec.ts#L10)

Why this matters:

- Many specs are commented out entirely
- Some auth tests still reference a pre-refactor login/token model
- That leaves the branch exposed while changing backend contracts against Drupal

Recommendation:

- Restore and modernize tests around auth callback handling, token refresh, service contracts, and core CRUD paths

## Code Quality Assessment

### What is good

#### Auth direction is much better

Files:

- [src/app/_services/auth.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/auth.service.ts#L41)
- [src/app/_services/pkce.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/pkce.service.ts#L6)
- [src/main.ts](/extra/WebstormProjects/DecisionSupport_angular/src/main.ts#L42)

Good points:

- PKCE flow is present
- State verification is implemented
- Token refresh is centralized through an interceptor
- Auth config is separated cleanly from component logic

#### Rich text is constrained

Files:

- [src/main.ts](/extra/WebstormProjects/DecisionSupport_angular/src/main.ts#L12)
- [src/app/_components/decision-support/decision-support.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/decision-support/decision-support.component.ts#L35)

Good points:

- Quill formats are intentionally narrowed
- Toolbar capabilities are restricted
- There is at least some validation logic around editor content

#### Domain modeling exists

Files:

- [src/app/_services/auth-token-set.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/auth-token-set.ts#L1)
- [src/app/_services/auth-config.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/auth-config.ts#L1)
- [src/app/_classes/step.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_classes/step.ts#L14)

Good points:

- The codebase is trying to move toward explicit models and service boundaries
- Sanitization intent exists in the model layer
- Environment-driven configuration is cleaner than hardcoded component logic

### What is weak

#### Too much `any`

Representative files:

- [src/app/_services/process.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/process.service.ts#L29)
- [src/app/_services/decision-support.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/decision-support.service.ts#L122)
- [src/app/_components/decision-support/decision-support.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/decision-support/decision-support.component.ts#L88)

Why this matters:

- It weakens compile-time safety exactly where backend contracts are changing
- It makes Drupal integration regressions harder to detect
- It encourages hidden shape assumptions in components

#### Components carry too much business logic

Representative files:

- [src/app/_components/decision-support/decision-support.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/decision-support/decision-support.component.ts#L173)
- [src/app/_components/process-list/process-list.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/process-list/process-list.component.ts#L129)
- [src/app/_components/edit-process-steps/edit-process-steps.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/edit-process-steps/edit-process-steps.component.ts#L95)

Why this matters:

- Fetching, transformation, persistence, view-state management, and notifications are tightly mixed
- This reduces testability and makes future Drupal API adaptations more expensive

#### Shared mutable singleton state is fragile

File:

- [src/app/_services/document.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/document.service.ts#L13)

Why this matters:

- This service acts as ambient cross-component state
- It is easy for navigation order or component timing to break assumptions
- It is not a robust pattern for long-lived workflow state

#### Logging is inconsistent

Representative files:

- [src/app/_components/process-list/process-list.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/process-list/process-list.component.ts#L137)
- [src/app/_components/document-upload/document-upload.component.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_components/document-upload/document-upload.component.ts#L60)
- [src/app/_services/auth.service.ts](/extra/WebstormProjects/DecisionSupport_angular/src/app/_services/auth.service.ts#L56)

Why this matters:

- Some code uses `console.*` directly
- Some code uses `LoggingService`
- There is no consistent production-safe logging policy across the app

## Security Robustness Assessment

Current state:

- Better than the old token pattern, but not yet strong enough for sensitive application data
- XSS impact remains too high because both auth state and decision data are browser-persisted
- Client-side sanitization is present in places, but trust boundaries are not consistently enforced

Security positives:

- PKCE and state verification are implemented
- Quill is constrained
- There is explicit awareness of sanitization and auth boundaries

Security negatives:

- `localStorage` for tokens
- `localStorage` for workflow data
- log leakage
- inconsistent guards
- unsafe HTML parsing path in reporting

## Refactor Recommendations

### 1. Centralize HTTP API access behind typed clients

Why:

- The Drupal integration refactor will keep changing payload shape and endpoints
- Typed request/response DTOs will catch regressions earlier than runtime-only debugging

Suggested direction:

- One typed API client per bounded area: auth, process, decision support, documents, reports
- Remove `any` from service return types and major component state

### 2. Remove manual header construction from feature services

Why:

- Auth logic is duplicated across services
- It increases inconsistency and bugs like the malformed archive requests

Suggested direction:

- Let the interceptor attach auth by default
- Only override headers in well-justified edge cases such as binary upload specifics

### 3. Move workflow logic out of components

Why:

- Components are too large and handle too many responsibilities
- This makes testing and backend adaptation harder

Suggested direction:

- Extract facade or state services for:
  - decision support session state
  - process editing state
  - document upload state

### 4. Replace mutable singleton UI context services

Why:

- Services like `DocumentService` are acting as hidden state containers
- This pattern is brittle and difficult to reason about

Suggested direction:

- Pass context explicitly via inputs, route state, or a dedicated reactive store/facade

### 5. Standardize persistence policy

Why:

- Browser persistence is currently ad hoc
- Sensitive data handling should be deliberate and consistent

Suggested direction:

- Define what may be stored locally, for how long, and in which storage mechanism
- Add expiry and cleanup rules where local persistence remains necessary

### 6. Rebuild the test baseline before further Drupal integration work

Why:

- Without a working test baseline, backend compatibility fixes will be slower and riskier

Suggested minimum suite:

- auth callback success/failure
- state mismatch handling
- token refresh and retry
- guarded route behavior
- process CRUD service contracts
- decision support CRUD service contracts
- report export sanitization path

## Specific Items I Would Change First

1. Fix malformed archive HTTP calls
2. Remove token persistence from `localStorage`
3. Remove decision-support answer persistence from `localStorage` or reduce it to short-lived session state
4. Guard report routes
5. Remove payload logging from decision-support updates
6. Replace `toPromise()` with `firstValueFrom`
7. Introduce typed DTOs for all Drupal-facing service calls
8. Restore tests around the auth and CRUD critical paths

## Overall Verdict

This branch has some good foundations for the Drupal migration, especially in the newer auth flow. The intent is clearly better than the legacy approach.

The main problem is that the codebase is still carrying risky browser persistence, inconsistent API patterns, weak typing, and an unreliable test suite. Those issues will make the updated Drupal integration harder to validate and easier to break.

If this were my branch, I would treat the next phase as:

1. security cleanup
2. API/service cleanup
3. test baseline restoration
4. only then deeper backend contract refactoring

## Audit Notes

- This report is based on a static audit of the code under `src/`
- No runtime verification or full test execution was performed as part of this review
