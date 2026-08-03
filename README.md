<div align="center">

# 🦷 Dentr

**Central Academic & Clinical Rotation Hub for Dentistry School Promotions**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

*Eliminating the chaos of shifting clinical rotations, phantom lab split-schedules, and last-minute chair or room reassignments.*

---

</div>

## 🌟 Overview

**Dentr** is a high-performance, mobile-optimized academic schedule and clinical rotation management platform designed specifically for dentistry school cohorts, clinical rotation groups (Groups A, B, C), and class representatives.

Built for fast-paced clinical environments where students move rapidly between lecture halls, phantom labs, and outpatient clinic floors, Dentr delivers instant, zero-friction access to schedules, chair allocations, required material checklists, and urgent broadcast announcements.

---

## ✨ Key Features

### ⏱️ Live Overview & Orchestrator
- **"Next Up" Live Countdown**: Real-time tabular timer updating continuously until the next course or clinic session.
- **Urgent Alert Center**: Immediate notification banner for session cancellations, room changes, or clinic chair swaps.
- **All-Group Today Summary**: Side-by-side snapshot comparing schedule timelines across Group A, Group B, and Group C.

### 📅 Daily Agenda & Equipment Checklists
- **Timeline View**: Hour-by-hour schedule with active session indicators (*Lecture*, *Phantom Lab*, *Clinical Practice*, *Exam/Viva*).
- **Clinical Metadata**: Room/Chair numbers, professor/supervisor names, and interactive required equipment tags (*Typodont, Rubber Dam, Surgical Kit, Endodontic Files, etc.*).

### 🗓️ Interactive Weekly Matrix
- **5-Day Visual Grid**: Clean Monday–Friday grid layout with color-coded status badges.
- **Detailed Session Modals**: Click any course block to reveal complete clinical requirements and notes.

### 👥 Rotation Groups Hub
- **Group Assignment Matrix**: Clear breakdown of clinic chairs, assigned departments (Prosthodontics, Periodontics, Endodontics, Oral Surgery), and supervising faculty for each cohort.

### 🔐 PIN-Protected Admin Management Portal
- **Secure Access**: 4-digit PIN authentication guarding administrative operations for class representatives.
- **Schedule Management**: Create, edit, cancel sessions, or swap clinic chairs on the fly.
- **Broadcast Announcements**: Send urgent promotion notifications visible to all students instantly.

### 🎨 Dual Theme System
- **Clinical Dark Glassmorphic (Default)**: Deep OLED background (`#020617`), frosted glass containers (`rgba(15, 23, 42, 0.8)` with `12px` backdrop blur), and clinical cyan/teal accents (`#0891B2`).
- **Medical Daylight Light Mode**: Sterile high-contrast daylight theme (`#F0FDFA`) engineered for outdoor visibility between clinic buildings.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 | UI components with modern hooks |
| **Language** | TypeScript 5 | Full type safety across models and components |
| **Build Tool & Server** | Vite 6 | Lightning-fast HMR and bundle optimization |
| **Animations** | Framer Motion 12 | Smooth micro-interactions and tab transitions |
| **Icons** | Lucide React | Modern clinical icon set |
| **Backend & Sync** | LocalStorage & Supabase Ready | Instant client caching with edge service compatibility |

---

## 📁 Project Structure

```
dentr/
├── design-system/          # Design token specifications & documentation
│   └── dentr/
│       └── MASTER.md       # Master design token source of truth
├── docs/                   # Product & design specifications
├── src/
│   ├── components/         # React UI components & view tabs
│   │   ├── ui/             # Reusable design system primitives (Buttons, Cards, Badges)
│   │   ├── AdminManagementTab.tsx
│   │   ├── AdminModal.tsx
│   │   ├── DailyAgendaTab.tsx
│   │   ├── MainOverviewTab.tsx
│   │   ├── MobileBottomNavbar.tsx
│   │   ├── NextCourseHero.tsx
│   │   ├── PresetTabBar.tsx
│   │   ├── RotationGroupsTab.tsx
│   │   └── WeeklyMatrixTab.tsx
│   ├── data/               # Mock dentistry promotion data & schedules
│   │   └── mockDentistryData.ts
│   ├── services/           # Storage, local caching & API abstractions
│   ├── styles/             # CSS design tokens & global stylesheets
│   ├── types/              # TypeScript interface definitions
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # Application entry point
├── supabase/               # Edge functions & database backend setup
├── DESIGN.md               # Visual identity & UX rules
├── PRODUCT.md              # Product strategy & user personas
├── package.json            # Package scripts & dependencies
└── vite.config.ts          # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0 or higher) and **npm** installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/dentr.git
   cd dentr
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to launch Dentr.

### Build & Production Preview

To build the static production bundle and preview it locally:

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 Navigation & User Interface

Dentr features an ergonomic dual navigation system tailored for both mobile smartphones and desktop monitors:

- **Desktop View**: Top header with logo, group selector, theme switcher, and sticky 5-tab preset bar (`Overview`, `Daily Agenda`, `Weekly Matrix`, `Rotation Groups`, `Admin Management`).
- **Mobile View**: Fixed top brand bar paired with a glassmorphic bottom navigation bar for quick one-thumb switching between views on smartphones.

---

## 🎨 Design Principles

1. **Instant Clinical Clarity**: Essential details (next clinic time, room/chair #, required equipment) displayed in under 2 seconds.
2. **Scanability & High Contrast**: Built for low-light lecture halls and bright outdoor environments alike.
3. **Tabular Precision**: Live countdowns and time markers use `tabular-nums` typography to prevent layout jittering.
4. **Frictionless Student Access**: Zero login requirements for students; persistent group preferences saved in `localStorage`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
