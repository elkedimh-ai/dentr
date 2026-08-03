# Main Session Hero Card Redesign Spec

## Overview
Redesign the primary session hero card in `MainOverviewTab.tsx` of the `dentr` web application. The new card will provide dental students with an immediate, high-clarity snapshot of their next/live course session, including location changes, instructor notes, full time range, and complete equipment checklist, wrapped in a dynamic status-accented UI.

---

## Key Requirements & Information Architecture

### 1. Dynamic Status-Based Accent Styling
The hero card background and border dynamically adapt according to `nextSession.status`:
- **`normal` / Live**: Dark glassmorphism container (`var(--bg-surface)`) with cyan/indigo accent border and a pulsing `LIVE NEXT UP` / `LIVE NOW` badge.
- **`chair_changed` / `rescheduled`**: Warm amber/gold background tint with amber accent border (`var(--status-rescheduled-border)`).
- **`cancelled`**: Crimson background tint with alert border (`var(--status-cancelled-border)`).

---

### 2. Card Content & Layout Sections

#### Top Header
- **Left**: Badges for:
  - Session Live Status (`LIVE NEXT UP` or `LIVE NOW`)
  - Session Type (`SessionPill` for `phantom_lab`, `clinical_practice`, `lecture`, `exam_viva`)
  - Target Group Badge (`Group A`, `Group B`, `Group C`, or `All Groups`)
- **Right**: Tabular countdown timer (`STARTS IN` or `ENDS IN`) formatted as `HH:MM:SS`.

#### Main Body
- **Session Title**: Prominent bold heading.
- **Time Slot**: `startTime` – `endTime` display with clock icon (e.g., `08:30 – 11:00`).
- **Location & Chair Reassignment Banner**:
  - Primary location (e.g., `Main Clinic 3 - Chair 18`).
  - If `originalLocation` is present (e.g. `Main Clinic 3 - Chair 04`), display an alert banner:  
    `⚠️ Reassigned from Main Clinic 3 - Chair 04 → Main Clinic 3 - Chair 18`.
- **Instructor**: Instructor name with user avatar icon.
- **Session Note / Evaluation Notice**: Styled callout box displaying `nextSession.note` (e.g., `"Class II Amalgam Prep evaluation today."`).

#### Equipment Kit Footer
- **Required Equipment Checklist**: All items from `equipmentChecklist` rendered as clean, high-visibility badge chips at the bottom of the card, fully visible without toggles.

---

## Component Changes

### `MainOverviewTab.tsx`
- Replace existing simple hero card layout with the new status-accented hero card component structure.
- Add time range formatting (`nextSession.startTime` – `nextSession.endTime`).
- Add reassignment banner logic when `nextSession.originalLocation` exists.
- Render `nextSession.note` callout box.
- Update CSS styling / inline tokens to support dynamic status background tints.

---

## Verification Plan
1. Check rendering when `nextSession.status` is `normal`.
2. Check rendering when `nextSession.status` is `chair_changed` (verify amber tint & original location callout).
3. Check rendering when `nextSession.status` is `cancelled` (verify crimson tint).
4. Verify responsive display on mobile and desktop viewports.
