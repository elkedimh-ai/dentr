# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dentistry school promotion students, clinical rotation group members (Groups A, B, and C), phantom lab cohorts, and promotion class representatives (Admins).

Students need immediate, zero-friction access on smartphones and laptops to their daily schedule, phantom lab assignments, clinical rotation chair allocations, required material checklists, and live countdowns to the next course.

Class Representatives (Admins) need a dedicated, PIN-protected admin portal to manage timetables, cancel sessions, reassign clinic chairs/rooms, update required equipment lists, and broadcast urgent promotion announcements.

## Product Purpose

**Dentr** serves as the central, high-speed, mobile-optimized schedule and rotation hub for dentistry school promotions, eliminating the chaos of shifting clinical rotations, phantom lab split-schedules, and last-minute chair or room changes.

## Positioning

A specialized Tab-Directive Academic & Clinical Hub featuring a persistent 5-Tab Preset Navigation Bar:
1. **Main Overview & Orchestrator**: Live "Next Up" Session Countdown, Urgent Alert Center (Cancellations, Chair Swaps), All-Group Today Summary (Group A/B/C side-by-side overview), and Quick Admin Action bar.
2. **Daily Agenda**: Live timeline view with active session indicators, session types (*Lecture*, *Phantom Lab*, *Clinical Practice*, *Exam/Viva*), room/chair numbers, and required equipment checklists.
3. **Weekly Matrix**: Interactive 5-day grid schedule with color-coded status badges and detailed session modals.
4. **Rotation Groups**: Dedicated matrix showing clinical & lab rotation assignments for all groups (Chair numbers, departments, clinical supervisors).
5. **Admin Management**: Dedicated PIN-protected management portal with structured controllers to edit sessions, reassign rotation groups/chairs, post announcements, and configure app settings.

## Operating Context

Web application built with React 19, TypeScript, Vite, local storage caching, and instant mock fallback. Used by dentistry students on smartphones while moving between clinic departments or on laptops during lectures.

## Capabilities and Constraints

- **Preset Navigation Tabs**: Main Overview, Daily Agenda, Weekly Matrix, Rotation Groups, Admin Management.
- **Rich Clinical Metadata**: Session Type (*Lecture*, *Phantom Lab*, *Clinical Practice*, *Exam/Viva*), Room/Chair #, Professor, and Required Equipment Checklist (*Typodont, Rubber Dam, Surgical Kit, etc.*).
- **Dual Theme System**: Clinical Dark Glassmorphism default + 1-Click Medical Daylight Light Mode.
- **Frictionless Student Access**: No account login required; group preferences saved in `localStorage`.
- **Dedicated Admin Portal**: 4-digit PIN authentication guarding session edits, group reassignments, and broadcast alerts.

## Brand Commitments

- **Name**: Dentr (Dentistry Promotion Hub).
- **Aesthetic**: Clinical Dark Glassmorphism default (`#0B0F17`, frosted glass containers, clinical teal `#0891B2`, mint emerald `#10B981`) with 1-Click Daylight Medical Light Mode (`#F8FAFC`).
- **Typography**: Figtree for headings and tabular countdowns; Noto Sans for body text and clinical checklists.

## Evidence on Hand

- **Built Codebase**: Complete React 19 + TypeScript + Vite app in `src/` with mock dentistry dataset in `src/data/mockDentistryData.ts`.
- **Design Tokens**: `design-system/dentr/MASTER.md`, `src/styles/design-tokens.css`, and `src/styles/tokens.ts`.
- **Spec Documents**: `PRODUCT.md`, `DESIGN.md`, and `docs/superpowers/specs/2026-08-01-dentr-ui-rebuild-design.md`.

## Product Principles

1. **Instant Clinical Clarity**: Display next course/clinic time, chair/room number, and required equipment in under 2 seconds.
2. **Scanability & High Contrast**: Visual hierarchy engineered for low-light lecture halls and bright outdoor clinic environments.
3. **Frictionless Experience**: Zero logins for students; full administrative control for class reps in one click.
4. **Resilient & Fast**: Local storage caching and zero-dependency mock state for instant startup and offline capability.

## Accessibility & Inclusion

- High contrast text ratio (≥4.5:1 for body, ≥3:1 for large display text).
- Keyboard navigable controls with visible focus rings (`--color-ring`).
- Respects `prefers-reduced-motion` and clear non-color-only status indicators.
