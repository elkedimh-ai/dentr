# Main Session Hero Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the primary session hero card in `MainOverviewTab.tsx` to provide dental students with an immediate, high-clarity snapshot of their next/live course session, status accent shift, chair reassignment alerts, instructor evaluation notes, and equipment kit chips.

**Architecture:** Update `MainOverviewTab.tsx` to render a dynamic status-accented container (`normal`, `chair_changed`, `cancelled`) with clear visual hierarchy for session status, live countdown, group assignment, location reassignment banner, instructor, time slot, session notes, and equipment kit.

**Tech Stack:** React, TypeScript, Lucide React icons, Tailwind CSS / Vanilla CSS variables.

## Global Constraints
- Must preserve existing `DentistrySession` data structure from `src/types/dentr.ts`.
- Must support dynamic status background accent shifts (`normal`, `chair_changed`, `cancelled`).
- Must render full equipment checklist chips without hiding them behind interactive drawers.
- Must execute Impeccable design evaluation upon completion.

---

### Task 1: Redesign `MainOverviewTab.tsx` Session Hero Card

**Files:**
- Modify: `src/components/MainOverviewTab.tsx:38-80`

**Interfaces:**
- Consumes: `DentistrySession`, `UrgentAlert`, `PresetTabId`, `StudentGroupId` from `src/types/dentr.ts`
- Produces: Redesigned hero card component rendered within `MainOverviewTab`

- [ ] **Step 1: Replace hero card structure in `MainOverviewTab.tsx`**

Implement dynamic status tint styling based on `nextSession.status` (`normal`, `chair_changed`, `cancelled`), add time slot display (`startTime` – `endTime`), add reassignment alert banner if `originalLocation` is set, display `nextSession.note`, and render equipment checklist chips cleanly.

```tsx
const getStatusStyles = (status: SessionStatusId) => {
  switch (status) {
    case 'chair_changed':
    case 'rescheduled':
      return {
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid var(--status-rescheduled-border)',
        badgeStatus: 'warning' as const,
        badgeLabel: 'CHAIR REASSIGNED'
      };
    case 'cancelled':
      return {
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid var(--status-cancelled-border)',
        badgeStatus: 'urgent' as const,
        badgeLabel: 'CANCELLED'
      };
    default:
      return {
        background: 'var(--bg-surface)',
        border: '1px solid var(--color-border)',
        badgeStatus: 'normal' as const,
        badgeLabel: 'LIVE NEXT UP'
      };
  }
};
```

- [ ] **Step 2: Verify Vite build / compilation**

Run: `npm run build`
Expected: Build succeeds with 0 TypeScript errors.

- [ ] **Step 3: Commit Task 1**

```bash
git add src/components/MainOverviewTab.tsx
git commit -m "feat: redesign main session hero card with dynamic status accents"
```

---

### Task 2: Evaluate Redesign with Impeccable & Verify UI Quality

**Files:**
- Touch: `.impeccable/critique/`

- [ ] **Step 1: Run build verification**

Run: `npm run build`
Expected: Clean compilation.

- [ ] **Step 2: Conduct Impeccable Design Evaluation**

Inspect layout, contrast, spacing, typography, and status accent contrast for visual perfection.

- [ ] **Step 3: Commit final plan completion**

```bash
git add .
git commit -m "chore: complete main session hero card redesign verification"
```
