# Design Specification: Dentr UI/UX Rebuild (Dentistry School Promotion Hub)

## Overview
Rebuilding the UI/UX of **Dentr** from scratch as a high-speed, mobile-friendly academic and clinical hub tailored exclusively for dentistry school promotions. 

The application utilizes a **Preset Tab Directive UI Architecture** featuring 5 fixed top navigation tabs, a **Dual-Theme System** (Dark Glassmorphism default + 1-Click Medical Light Mode), full clinical metadata (session types, chair numbers, equipment checklists), and a dedicated **Admin Management Tab** for class representatives.

---

## 1. UI Architecture & Navigation Model

### Top Bar & Control Controls
- **Brand Logo & Title**: `Dentr` | Dentistry School Promotion
- **Group Selector**: Filter views by `All Groups`, `Group A`, `Group B`, or `Group C`.
- **Theme Switcher**: 1-Click toggle between Dark Glassmorphism and Daylight Medical Light Mode.
- **Admin Status Indicator**: Shows lock status (🔒 Locked / 🔓 Admin Authenticated).

### Preset Navigation Tabs
1. **Main Overview & Orchestrator Tab (`/overview`)**
   - Hero "Next Up" Live Countdown clock (updates every second) displaying next session type, title, room/chair #, required equipment, and professor.
   - Urgent Alert Center: High-visibility banners for cancelled sessions or chair changes.
   - All-Group Today Summary: Side-by-side card overview of Group A, Group B, and Group C today.
   - Quick Admin Action Bar: Fast-access link to Admin Management or PIN entry.

2. **Daily Agenda Tab (`/daily`)**
   - Vertical timeline view with hour markers.
   - Live progress indicator bar for ongoing sessions.
   - Clinical metadata cards:
     - Session Type Pill (*Lecture*, *Phantom Lab*, *Clinical Practice*, *Exam/Viva*)
     - Location (*e.g., Clinic 3 - Chair 14*, *Phantom Lab B*)
     - Required Equipment Tags (*Typodont, Rubber Dam, Extraction Kit, Cavit*)
     - Instructor / Professor name
     - Status Badge (*Normal*, *Cancelled*, *Chair Changed*, *Rescheduled*)

3. **Weekly Matrix Tab (`/weekly`)**
   - 5-Day Monday–Friday interactive timetable grid.
   - Session blocks color-coded by Session Type.
   - Click card to open detail modal with equipment checklist and room directions.

4. **Rotation Groups Tab (`/rotations`)**
   - Clinical & Lab Rotation Matrix across dentistry departments:
     - *Operative Dentistry Clinic*
     - *Prosthodontics Clinic*
     - *Periodontics Clinic*
     - *Endodontics Phantom Lab*
     - *Oral Surgery Clinic*
     - *Pediatric Dentistry*
   - Displays assigned Group (A/B/C), Chair/Unit ranges, supervising faculty, and required preparation notes.

5. **Admin Management Tab (`/admin`)**
   - 4-Digit PIN Authentication Lock Screen.
   - Once authenticated:
     - **Session Form Editor**: Add, edit, or delete schedule items.
     - **Quick Status Switches**: 1-click toggle to Cancel session, Change Room/Chair, or Reschedule.
     - **Equipment List Manager**: Edit required clinical kits per session.
     - **Urgent Announcement Broadcaster**: Send promotion-wide alert banner.
     - **Rotation Group Re-assigner**: Update group clinic rotations.

---

## 2. Visual Design & Theme Tokens

### Dark Glassmorphism (Default)
- Background: `#0B0F17` (Deep Midnight Dark)
- Card Containers: `rgba(17, 24, 39, 0.75)` with `rgba(255, 255, 255, 0.1)` border and `backdrop-filter: blur(12px)`
- Text: Primary `#F9FAFB`, Secondary `#9CA3AF`
- Accents: Clinical Teal `#06B6D4`, Emerald `#10B981`, Royal Blue `#3B82F6`

### Medical Light Mode
- Background: `#F8FAFC` (Sterile Daylight Light)
- Card Containers: `#FFFFFF` with `#E2E8F0` border and soft shadow
- Text: Primary `#0F172A`, Secondary `#475569`
- Accents: Cobalt `#0891B2`, Deep Blue `#2563EB`

---

## 3. Data & State Management

- **Local Storage State**: Saves user's preferred group choice, active tab, custom theme setting, and admin PIN session token.
- **Mock Data Layer**: Built-in dentistry promotion dataset for 5 weekdays, 3 student groups, 6 clinic departments, and rich equipment checklists.
- **Dynamic Live Countdown**: Real-time timer calculation against current device clock to pinpoint active or upcoming classes.

---

## 4. Technical Stack

- **Framework**: React 19 + TypeScript + Vite
- **Icons**: Lucide-React
- **Styling**: Pure Modular CSS Variables & Tokens (No heavy external frameworks)
- **Deployment & Speed**: Built for zero-latency mobile rendering.
