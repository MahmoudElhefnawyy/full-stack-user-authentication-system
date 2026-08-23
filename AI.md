# AI Usage

This file describes how I used AI assistance during this task, what worked well, what needed fixing, and where I made deliberate choices that differed from what AI suggested.

## What I used AI for

**Scaffolding and boilerplate**
I used AI to generate the initial NestJS module structure (auth module, DTOs, guards, strategy) and the React routing setup. This is exactly where AI shines — the patterns are well-established and the output is reliable. Generating this by hand would have been repetitive without adding any engineering value.

**Validation logic**
Both the Zod schema on the frontend and the class-validator decorators on the backend were AI-assisted. The password regex rules (letter + number + special char) are a good example — AI got the regex right on the first attempt and I verified them against the spec.

**CSS design system**
I described the visual direction (dark glassmorphism, indigo accent, frosted cards) and AI produced the initial `index.css`. I adjusted the blur intensity, button shadow values, and input focus ring color by hand after seeing it rendered.

## What I had to correct or rework

**Token key mismatch**
The backend `authService.signIn` returns `{ accessToken }` (camelCase). The AI-generated frontend service initially read `res.data.access_token` (snake_case), which would have silently broken the sign-in flow — the token would never be stored. I caught this during code review by cross-referencing the server response shape with the client consumption code, and fixed it before it could cause a bug in the running app.

**AI-style comments**
The first version of `auth.types.ts` had decorative box-drawing comment dividers (`// ─── Section ─────────────`). These are an immediate AI tell and look unprofessional in a real codebase. I replaced them with plain, minimal comments.

**Unused state variable**
`AppPage.tsx` had a `setError` state setter that was declared but never called — the error case was handled entirely by redirecting to `/signin`. TypeScript's strict mode caught this (`TS6133`). I removed the setter rather than wiring it up to a UI element that wasn't needed.

## Prompting approaches that worked well

- Being specific about constraints upfront: giving the exact validation rules (min 8 chars, letter, number, special) meant the output matched the spec without iteration.
- Asking for one file at a time rather than the whole feature, which kept outputs focused and easier to review.
- Treating AI output as a first draft to be read and owned, not copy-pasted directly.

## What I decided differently from AI suggestions

- **No external UI component library.** AI suggested using shadcn/ui. I kept it to plain Tailwind + custom CSS classes in `@layer components`. Fewer dependencies, easier for a reviewer to follow, and no abstraction hiding what the components actually do.
- **No `react-query` for data fetching.** AI suggested it for the profile fetch on the home page. A single `useEffect` with `useState` is sufficient for one endpoint call — adding a caching library would be over-engineering for this scope.
- **`onTouched` validation mode** in react-hook-form instead of the default `onSubmit`. AI defaulted to `onSubmit`, but `onTouched` gives real-time feedback once the user has interacted with a field, which is the better UX pattern for auth forms.
