---
name: Dentr
description: Dentistry Promotion Academic & Clinical Hub
colors:
  primary: "#0891B2"
  secondary: "#22D3EE"
  accent: "#10B981"
  background: "#020617"
  foreground: "#F8FAFC"
  muted: "#1E293B"
  session-lecture: "#3B82F6"
  session-phantom-lab: "#0891B2"
  session-clinical: "#10B981"
  session-exam: "#EC4899"
typography:
  display:
    fontFamily: "Figtree, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Figtree, sans-serif"
    fontSize: "1.0rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-glass:
    backgroundColor: "rgba(15, 23, 42, 0.8)"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Dentr

## Overview

**Creative North Star: "The Clinical Sanctuary"**

Dentr operates in **Operate Mode** (high scanability, rapid task completion under tight clinical deadlines). It implements a **Dual Theme System** designed specifically for dentistry students moving between dim lecture halls, phantom labs, and bright outdoor clinics:
1. **Dark Glassmorphism OLED Default**: Deep midnight background (`#020617`), translucent glass containers (`rgba(15, 23, 42, 0.8)`) with 12px backdrop blur, clinical teal (`#0891B2`), cyan (`#22D3EE`), and emerald (`#10B981`) accents.
2. **Medical Daylight Light Mode**: Sterile daylight background (`#F0FDFA`), crisp teal headers (`#134E4A`), and high-contrast borders for outdoor visibility.

**Key Characteristics:**
- **Tabular Live Countdown**: 44px bold Figtree numbers for live session countdowns.
- **Dense Dashboard Scale**: 8pt/4pt compact grid density tailored for quick glanceability.
- **Clinical Session Type Pill System**: Color-coded badges for Lectures (Blue), Phantom Labs (Teal), Clinical Practice (Emerald), and Exams (Pink).

## Colors

The color palette is engineered for clinical precision and high legibility across low-light and bright daylight environments.

### Primary
- **Clinical Cyan-Teal** (#0891B2): Primary interactive actions, active tab indicators, and hero brand accents.

### Secondary
- **Vibrant Cyan** (#22D3EE): Highlight borders, secondary buttons, and active session glows.

### Accent
- **Health Emerald** (#10B981): On-time session indicators, clinical practice badges, and success states.

### Neutral
- **Midnight OLED** (#020617): Deep dark mode app background.
- **Surface Dark Glass** (rgba(15, 23, 42, 0.8)): Translucent card containers.
- **Pure Slate White** (#F8FAFC): Primary high-contrast typography.

### Named Rules
**The Single Accent Dominance Rule.** The primary clinical teal accent is used on ≤15% of any given screen. Its rarity guarantees instant optical focus on upcoming course schedules.

## Typography

**Display Font:** Figtree (with sans-serif fallback)
**Body Font:** Noto Sans (with sans-serif fallback)
**Mono Font:** JetBrains Mono, Consolas, monospace

**Character:** Technical, crisp, and highly readable. Figtree provides geometric structure for headings and countdown clocks; Noto Sans ensures maximum clarity for clinical equipment lists and room numbers.

### Hierarchy
- **Display** (700 Bold, 2.75rem / 44px, line-height 1.1): Live "Next Up" session countdown timer with `font-variant-numeric: tabular-nums`.
- **Headline** (600 Semi-Bold, 1.25rem / 20px, line-height 1.3): Section headers and preset navigation tab labels.
- **Title** (600 Semi-Bold, 1.0rem / 16px, line-height 1.4): Course names and rotation department titles.
- **Body** (400 Regular, 0.875rem / 14px, line-height 1.5): Equipment checklists, professor notes, and schedule details.
- **Label** (700 Bold uppercase, 0.75rem / 12px, letter-spacing 0.05em): Session type pills and status badges.

### Named Rules
**The Tabular Number Rule.** All countdown timers, hour markers, and room/chair numbers must use tabular numbers to eliminate layout shifts during live updates.

## Layout

Dentr uses a dense 8pt/4pt dashboard spatial model (`--space-xs: 4px` to `--space-3xl: 64px`) optimized for compact clinical data display. Max container width is constrained to `1200px` centered, ensuring zero horizontal scrolling on mobile smartphones while scaling elegantly on desktop monitors.

## Elevation & Depth

Surfaces use a hybrid approach combining 12px backdrop blur glassmorphism with layered elevation shadows:
- **Default Card**: `background: rgba(15, 23, 42, 0.8)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255, 255, 255, 0.1)`.
- **Interactive Card Hover**: Border transitions to `--color-secondary` (`#22D3EE`), `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(8, 145, 178, 0.15)`, `transform: translateY(-2px)`.

### Named Rules
**The Glass Blur Invariant Rule.** Translucent containers must maintain a 12px backdrop blur in dark mode and 8px in light mode to preserve background contrast behind scrolling cards.

## Shapes

Forms and containers feature soft organic corner radii (`--radius-sm: 6px`, `--radius-md: 8px`, `--radius-lg: 12px`, `--radius-xl: 16px`, `--radius-full: 9999px`). Buttons and input fields use `--radius-md` (8px), card containers use `--radius-lg` (12px), and status badges use pill radii (`9999px`).

## Components

### Buttons
- **Shape:** Soft rounded corners (8px radius).
- **Primary:** Background `#0891B2`, text `#FFFFFF`, padding `8px 16px`.
- **Hover / Focus:** Hover background `#06B6D4`, translateY(-1px), active scale `0.98`. Focus ring `#0891B2` with 2px offset.
- **Secondary / Outline / Ghost:** Translucent backgrounds with border `#0891B2` or ghost transparent.

### Badges
- **Style:** Pill shape (`9999px` radius), uppercase tracked 12px Figtree font (`letter-spacing: 0.05em`).
- **Normal:** Background `rgba(16, 185, 129, 0.15)`, text `#34D399`, border `rgba(16, 185, 129, 0.3)`.
- **Cancelled:** Background `rgba(239, 68, 68, 0.15)`, text `#FCA5A5`, border `rgba(239, 68, 68, 0.3)`.
- **Chair Changed:** Background `rgba(245, 158, 11, 0.15)`, text `#FDE047`, border `rgba(245, 158, 11, 0.3)`.

### Cards / Containers
- **Corner Style:** 12px radius.
- **Background:** `rgba(15, 23, 42, 0.8)` in dark mode, `#FFFFFF` in light mode.
- **Shadow Strategy:** Subtle elevation shadow with cyan glow on hover.

### Inputs / Fields
- **Style:** Translucent background, 1px solid `rgba(255, 255, 255, 0.1)`, 8px radius.
- **Focus:** Border shifts to `#0891B2` with 3px glowing focus ring.

### Navigation
- **Top Header Bar**: Fixed top glass bar with logo, group selector dropdown, theme toggle, and admin status badge.
- **Preset Tab Bar**: Sticky top navigation bar featuring 5 preset tabs (`Overview`, `Daily Agenda`, `Weekly Matrix`, `Rotation Groups`, `Admin Management`) with active indicator line.

## Do's and Don'ts

### Do:
- **Do** use `font-variant-numeric: tabular-nums` on all countdown clocks and timers.
- **Do** maintain a minimum 4.5:1 text contrast ratio in both Dark Glassmorphism and Daylight Light Mode.
- **Do** display required equipment lists as pill tags on clinical practice and phantom lab session cards.

### Don't:
- **Don't** obscure session status with color alone; always pair status colors with descriptive text badges (*Scheduled*, *Cancelled*, *Chair Swap*).
- **Don't** use raw unstyled browser inputs; always apply `Input` or `Button` design primitives.
- **Don't** allow horizontal scrollbars on mobile viewport screens.
