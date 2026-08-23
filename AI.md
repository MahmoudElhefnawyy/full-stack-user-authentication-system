# AI Usage

> This document describes how AI assistance was used during this assessment, what worked well, what required correction, and where engineering judgment overrode AI suggestions. It is written to be transparent about the process, not just disclose that AI was used.

---

## Approach

I treated AI as a senior pair-programmer for the parts of this task that are well-understood and pattern-driven (scaffolding, boilerplate, validation rules), and as a first-draft generator for everything else. Every output was read, understood, and either accepted, adapted, or rejected. Nothing was copy-pasted blindly.

The rough split:

| Category | AI contribution | My contribution |
|---|---|---|
| Project structure & scaffolding | Generated | Reviewed, adjusted folder layout |
| DTO validation rules | Generated | Cross-checked against spec exactly |
| JWT / bcrypt / Passport wiring | Generated | Verified token flow end-to-end |
| CSS design system | Generated initial values | Tuned visually after rendering |
| Form validation (Zod schemas) | Generated | Verified rules match backend exactly |
| Unit tests | Generated structure | Verified assertions, caught mock issues |
| CI workflow | Generated | Adjusted jest flags for v30 compatibility |
| READMEs | Generated drafts | Rewrote to be project-specific |
| AI.md | Written by me | — |

---

## What AI Was Used For

### Backend scaffolding
The NestJS module structure (auth module, DTOs, guards, Passport strategy, exception filter, logging middleware) was AI-generated. These follow a well-established NestJS pattern, and generating them manually would have been time-consuming without adding engineering value. I verified each file before committing.

### Validation logic
Both the `class-validator` decorators on the backend DTOs and the Zod schema on the frontend were AI-assisted. The password regex rules (letter + number + special character) were given as exact requirements from the spec — AI produced correct patterns on the first attempt, which I verified independently before using them.

### CSS design system
I described the visual direction (dark glassmorphism, indigo gradient accent, frosted glass card, Inter font) and AI produced the initial `index.css`. I adjusted blur intensity, box-shadow values, button hover lift, and input focus ring color manually after seeing the result rendered in the browser.

### Unit tests
AI generated the initial test file structure and the mock setup for `UsersService` and `JwtService`. I reviewed every assertion for correctness before running them. All 7 tests passed on the first run.

---

## What I Had to Correct or Rework

### Token key mismatch — caught during review
The backend `AuthService.signIn` returns `{ accessToken }` (camelCase). The AI-generated frontend service initially read `res.data.access_token` (snake_case). This is a silent bug — the token would never be stored in `localStorage`, and the sign-in flow would appear to work but immediately redirect back to `/signin`. I caught it by cross-referencing the server response shape with the client consumption code during a manual code review pass.

```diff
- const res = await api.post<{ access_token: string }>('/auth/signin', data);
- localStorage.setItem('access_token', res.data.access_token);
+ const res = await api.post<{ accessToken: string }>('/auth/signin', data);
+ localStorage.setItem('access_token', res.data.accessToken);
```

### AI-style decorative comments
The first version of `auth.types.ts` used box-drawing comment dividers:
```ts
// ─── Request shapes ──────────────────────────────────────────────────────────
```
These are an immediate AI tell. No human writes comments like that. I replaced them with plain, minimal comments. I also reviewed all other files for similar patterns and cleaned them where found.

### Unused state variable (TypeScript caught it)
`AppPage.tsx` had a `setError` state setter declared but never called — the error case redirects to `/signin` rather than showing an inline message, so the setter was dead code. TypeScript's strict mode flagged it as `TS6133`. I removed it rather than wiring it to a UI element that wasn't needed.

### CI `--testPathPattern` flag
The initial CI workflow used `--testPathPattern` (Jest v27 flag). Jest v30 (used in this project) replaced it with `--testPathPatterns`. The workflow would have failed on the first run. I corrected the flag before committing.

### Wrong JWT algorithm label in README
The README initially described the auth as using `JWT (RS256)`. RS256 uses an asymmetric public/private key pair. This project uses a symmetric secret (`JWT_SECRET`), which is HS256. I corrected the label — a tech lead would have noticed this immediately.

---

## Prompting Approaches That Worked Well

- **Being specific upfront about constraints**: providing the exact field validation rules (min 8 chars, at least one letter, number, and special character) meant AI output matched the spec without iteration.
- **One file at a time**: asking for one file per prompt rather than generating the whole feature kept outputs focused, easier to review, and easier to catch errors in.
- **Describing the visual direction clearly**: giving specific aesthetic direction (dark glassmorphism, indigo accent, frosted glass, Inter font) produced a usable CSS foundation that only needed minor tuning.
- **Asking for mocked unit tests explicitly**: specifying that the tests should mock `UsersService` and `JwtService` (no real DB) produced the right testing pattern immediately.

---

## Decisions Made Differently from AI Suggestions

| AI suggestion | What I did instead | Reason |
|---|---|---|
| Use `shadcn/ui` for components | Plain Tailwind + custom `@layer components` | Fewer dependencies, no abstraction hiding the implementation, easier for a reviewer to follow |
| Use `react-query` for profile fetch | Plain `useEffect` + `useState` | One endpoint call on one page doesn't justify a caching library |
| `onSubmit` validation mode in react-hook-form | `onTouched` mode | Better UX — users get feedback per field after interacting, not only on form submit |
| Return 404 when user not found on sign-in | Return 401 with "Invalid credentials" | Prevents user enumeration — an attacker shouldn't know whether the email exists |
| Store token in `sessionStorage` | `localStorage` (with awareness of the tradeoff) | `sessionStorage` clears on tab close; the real production answer is `httpOnly` cookies, which would require backend changes beyond this task's scope. `localStorage` is the pragmatic choice here and is industry-standard for this class of demo app |

---

## Overall Assessment

AI meaningfully accelerated the scaffolding and boilerplate phases of this task. The parts that required real engineering judgment — catching the token key mismatch, deciding against over-engineering with react-query, knowing that RS256 ≠ HS256, understanding why 401 is safer than 404 for auth errors — were not things AI got right without human review. That's the right dynamic: AI handles the repetitive and well-known, the engineer handles correctness, security, and tradeoffs.
