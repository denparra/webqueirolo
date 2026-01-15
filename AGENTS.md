# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Next.js App Router pages, layouts, and route-level UI.
- `components/` holds reusable UI components shared across pages.
- `lib/` is for helper functions, data utilities, and shared logic.
- `public/` stores static assets served at the site root (images, icons).
- `tailwind.config.ts`, `postcss.config.js`, and `tsconfig.json` define styling and TypeScript behavior.
- `.next/` is the build output and should not be edited manually.

## Build, Test, and Development Commands
- `npm install` installs dependencies from `package.json` and `package-lock.json`.
- `npm run dev` starts the local Next.js dev server with hot reloading.
- `npm run build` creates an optimized production build in `.next/`.
- `npm run start` serves the production build locally.
- `npm run lint` runs the Next.js ESLint rules.

## Coding Style & Naming Conventions
- Use TypeScript/TSX and follow existing file naming (`PascalCase` for React components, `kebab-case` for route folders).
- Keep indentation at 2 spaces (default Prettier/Next.js style).
- Prefer Tailwind utility classes for styling; centralized styles belong in `tailwind.config.ts`.
- Avoid unused exports; keep helpers colocated in `lib/` or near the component that uses them.

## Testing Guidelines
- No automated test framework is currently configured.
- If adding tests, prefer `*.test.tsx` or `*.spec.ts` and place them alongside the component or under a `__tests__/` folder.
- Keep tests focused on UI behavior and data helpers; document any new test command in `package.json`.

## Commit & Pull Request Guidelines
- No Git history is present in this folder, so no commit message convention is enforced.
- Recommended: use Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`) for clarity.
- PRs should include a short summary, screenshots for UI changes, and a note on any new dependencies or scripts.

## Security & Configuration Tips
- Store local secrets in `.env.local` (not committed).
- Review any public asset changes under `public/` to avoid leaking sensitive content.
