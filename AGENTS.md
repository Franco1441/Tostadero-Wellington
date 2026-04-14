# Tostadero Wellington Agent Guide

## What This Workspace Is
This repository is an existing Next.js 16 application with real product code already in place.
Treat it as a live app, not as an empty starter template.

## Safe Default For Website Cloning
When cloning external sites into this workspace, do not overwrite the existing homepage or shared design system unless the user explicitly asks for that.

Default output locations:
- Route: `app/clones/<slug>/page.tsx`
- Components: `components/clones/<slug>/`
- Assets: `public/clones/<slug>/`
- Research notes: `docs/research/<slug>/`
- Screenshots: `docs/design-references/<slug>/`

Only replace `app/page.tsx`, `app/globals.css`, or shared components if the user clearly says the clone should become the main site.

## Tech Stack
- Framework: Next.js 16 App Router
- Language: TypeScript strict
- Styling: Tailwind CSS v4
- UI primitives: shadcn/ui + Radix
- Animation: Framer Motion is already available

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript check
- `npm run check` - Lint + typecheck + build

## Project Structure
- `app/` - App Router routes, layout, global CSS, server actions
- `components/` - Shared app components
- `components/ui/` - shadcn/ui primitives
- `components/clones/` - Clone-specific components should go here
- `public/` - Static assets
- `public/clones/` - Clone-specific downloaded assets
- `docs/research/` - Reverse-engineering notes, behaviors, specs
- `docs/design-references/` - Screenshots and visual references
- `lib/` - Shared utilities and data

## Clone Workflow Rules
1. Browser automation is required for serious cloning work. If no browser tool is available, stop and ask for one instead of pretending the clone is exact.
2. Keep clone styling scoped by default. Prefer clone-local components, route-local wrappers, and clone-specific assets over changing app-wide tokens.
3. Do not update `app/layout.tsx` or `app/globals.css` for a clone unless the user explicitly wants the clone to replace the current app experience.
4. Write auditable research artifacts before building complex sections:
   - `docs/research/<slug>/BEHAVIORS.md`
   - `docs/research/<slug>/PAGE_TOPOLOGY.md`
   - `docs/research/<slug>/components/*.spec.md`
5. Use real assets and real text from the target site when legally appropriate. Do not invent copy unless the source content is clearly dynamic.
6. Verify changes with `npm run check` before calling the clone complete.

## Existing App Protection
- Never delete or rewrite the current Tostadero experience without explicit approval.
- Prefer adding a new route under `app/clones/` first.
- If a clone needs custom fonts or tokens, keep them local to that route whenever possible.
