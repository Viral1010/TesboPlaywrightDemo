# Portal Login Test Plan

## Application Overview

Login page test plan for portal.tesbo.io — covers core functional, error, security and accessibility scenarios for the Tesbo portal login flow. Assumes a fresh session for each scenario and uses placeholder credentials that QA will replace with test accounts.

## Test Scenarios

### 1. Portal Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. Happy path — valid credentials

**File:** `tests/portal-login/happy-path.spec.ts`

**Steps:**
  1. Start with a fresh (incognito) browser session.
  2. Navigate to https://portal.tesbo.io (or https://portal.tesbo.io/login).
  3. Verify the login form is visible with fields labeled 'Email' and 'Password' and a 'Sign in' button.
  4. Enter a valid email (vir@qable.io) into the Email field.
  5. Enter the valid password (QAble@1010) into the Password field.
  6. Click the 'Sign in' button.
  7. Wait for navigation to complete.
  8. Verify the user is redirected to the main dashboard (URL changes from /login) and a visible account/menu or 'Sign out' control is present.

**Expected Results:**
  - Login form visible with Email and Password fields and Sign in button.
  - Successful sign-in navigates away from the login page to the dashboard or workspace home.
  - An account menu or 'Sign out' button is visible, indicating authenticated state.

#### 1.2. Invalid credentials — incorrect password

**File:** `tests/portal-login/invalid-password.spec.ts`

**Steps:**
  1. Start fresh.
  2. Open the login page.
  3. Fill Email with a valid account email.
  4. Fill Password with an incorrect password.
  5. Click 'Sign in'.
  6. Observe error messaging and focus behaviour.

**Expected Results:**
  - No navigation to the dashboard occurs.
  - A clear, accessible error message is shown (e.g., 'Invalid email or password').
  - Error message is associated with the form fields or announced to assistive tech; input focus may move to the first invalid field.

#### 1.3. Validation — empty email

**File:** `tests/portal-login/empty-email.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Leave Email blank, enter a valid Password.
  4. Click 'Sign in'.

**Expected Results:**
  - Form validation prevents submission.
  - An inline validation error appears near the Email field (e.g., 'Email is required').
  - Error is accessible (aria-live / role alert) and focus moves to the Email field or the error message.

#### 1.4. Validation — empty password

**File:** `tests/portal-login/empty-password.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Enter valid Email, leave Password blank.
  4. Click 'Sign in'.

**Expected Results:**
  - Form validation prevents submission.
  - Inline validation error appears near the Password field (e.g., 'Password is required').
  - Error is accessible and focus moves to the Password field or message.

#### 1.5. Brute-force / rate limiting behaviour

**File:** `tests/portal-login/rate-limiting.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Attempt to sign in with the same valid email and a wrong password repeatedly (e.g., 6 rapid attempts).

**Expected Results:**
  - After a small number of failed attempts (config-dependent) the server shows rate-limiting or account-lock message.
  - Further attempts are blocked for a period or require CAPTCHA / account unlock.
  - Appropriate error messages do not leak sensitive info.

#### 1.6. Input sanitization — injection attempts

**File:** `tests/portal-login/injection.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Enter a typical injection string into Email (e.g., "' OR '1'='1") and Password (e.g., "' OR '1'='1").
  4. Click 'Sign in'.

**Expected Results:**
  - Application does not authenticate with injection strings.
  - No stack traces, SQL errors, or sensitive server information are exposed.
  - The app responds with standard authentication error.

#### 1.7. Long input and trimming behaviour

**File:** `tests/portal-login/long-input.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Enter an email with leading/trailing spaces and extremely long local-part (over 256 chars) into Email field.
  4. Enter a long password (e.g., 1024 chars).
  5. Click 'Sign in'.

**Expected Results:**
  - Input is handled gracefully — either client-side validation blocks submission with clear messages or server returns a standard auth error.
  - No crashes, layout breaks, or leakage of raw input in error pages.

#### 1.8. Email case-insensitivity and normalization

**File:** `tests/portal-login/email-normalization.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Enter a valid registered email in uppercase (TEST+USER@EXAMPLE.COM) and correct password.
  4. Click 'Sign in'.

**Expected Results:**
  - Authentication succeeds if system treats email case-insensitively or normalized server-side.
  - User reaches dashboard as in happy path.

#### 1.9. Password autocomplete and security attributes

**File:** `tests/portal-login/autocomplete.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Inspect Password input attribute and any 'autocomplete' attributes.
  4. If 'Remember me' exists, observe its default state and behavior.

**Expected Results:**
  - Password field has `autocomplete="current-password"` (or appropriate value) and email has `autocomplete="email"`.
  - If 'Remember me' exists, it should be explicit and opt-in; password should not be auto-filled without user consent.

#### 1.10. Accessibility — labels, tab order, and ARIA

**File:** `tests/portal-login/accessibility.spec.ts`

**Steps:**
  1. Fresh session.
  2. Open login page.
  3. Verify each form control has an accessible name (label or aria-label).
  4. Tab through controls and verify logical focus order: Email → Password → Sign in → Register link.
  5. Use screen-reader-friendly assertions: error messages are announced, form fields have appropriate `aria-*` attributes when invalid.

**Expected Results:**
  - All controls have accessible names and predictable focus order.
  - Validation messages are exposed to assistive technologies (e.g., aria-live, role=alert).
  - The page meets basic WCAG-related expectations for forms (labels, focus, error announcements).
