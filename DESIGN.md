# Design System Specification

<!-- impeccable:design-schema 1 -->

## Visual Authority & Theme
**ClassSchedule** operates in **Operate Mode** (high scanability, rapid task completion). It utilizes a sleek, dark-first glassmorphism design system engineered for high contrast in low-light lecture halls and bright outdoor sunlight.

## Color Palette & Token Architecture

```css
:root {
  /* Surface colors */
  --bg-dark: #0B0F17;
  --bg-card: rgba(17, 24, 39, 0.7);
  --bg-card-hover: rgba(31, 41, 55, 0.8);
  --bg-card-border: rgba(255, 255, 255, 0.08);
  
  /* Text colors */
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;

  /* Accent Gradients & Status Colors */
  --accent-hero: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%);
  --accent-cyan: #06B6D4;
  --accent-blue: #3B82F6;
  
  /* Status Badges */
  --status-normal: #10B981;       /* Emerald */
  --status-cancelled: #F43F5E;    /* Rose */
  --status-room-changed: #F59E0B; /* Amber */
  --status-rescheduled: #8B5CF6;  /* Violet */
  --status-online: #3B82F6;       /* Blue */
}
```

## Typography Hierarchy
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Hero Countdown Number**: 2.75rem / 700 bold, tabular numbers (`font-variant-numeric: tabular-nums`).
- **Section Headers**: 1.25rem / 600 semi-bold.
- **Course Titles**: 1rem / 600 semi-bold.
- **Badges & Micro-Labels**: 0.75rem / 700 uppercase, tracked (`letter-spacing: 0.05em`).

## Key Layouts & Component Topography

1. **Top Navigation & Control Bar**:
   - Left: Brand Icon + Title ("ClassSchedule").
   - Center/Right: Group & Subgroup Pills Dropdown, Search Input, Refresh Button, Theme Toggle, Admin PIN Login Button.

2. **Hero "Next Course Up" Card**:
   - Full-width glassmorphism container with animated subtle gradient border.
   - Large live countdown clock (`01:24:15 until Database Systems`).
   - Meta details: Room Code (pill tag), Professor Name, Time range, Direct status note.

3. **Schedule View Selector**:
   - Segmented Pill Toggle: `Daily Agenda` | `Weekly Grid Matrix`.

4. **Daily Agenda View**:
   - Timeline cards with time markers on the left.
   - Active ongoing class features an animated pulsing green indicator line.

5. **Weekly Grid View**:
   - 5-Day (Mon-Fri) or 7-Day grid layout with time slot rows.
   - Course cards colored by status, with hover zoom & modal details.

6. **Admin Drawer / Modal**:
   - Password/PIN prompt.
   - Quick-toggle status panel: 1-click room changer & cancellation switch.
