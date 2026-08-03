# Dentr UI/UX Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the UI/UX of Dentr from scratch into a high-speed, mobile-optimized Dentistry School Promotion Hub featuring a 5-preset Tab Directive UI, dual-theme system, reusable UI primitives, clinical metadata, and PIN-protected admin portal.

**Architecture:** Built with React 19 + TypeScript + Vite, using modular CSS design tokens generated via the `ui-ux-pro-max` engine (`Figtree` headings + `Noto Sans` body, OLED midnight dark & daylight medical light themes). Local storage manages offline fallback, active cohort filtering, and admin session state.

**Tech Stack & Required Skills:** React 19, TypeScript 5.7, Vite 6.1, Lucide React icons, CSS variables (`design-tokens.css`).
- **Required UI Skills**: `ui-styling` (for component architecture & accessibility) + `ui-ux-pro-max` (for design system tokens, layout density, and motion).

## Global Constraints

- **Design Engine**: Strict adherence to `ui-ux-pro-max` persisted design system tokens in `design-system/dentr/MASTER.md` and `src/styles/design-tokens.css`.
- **Component Styling Skill**: Apply `ui-styling` patterns for accessible, composable UI primitives.
- **Typography**: Headings use `Figtree`, body text uses `Noto Sans`, countdown clocks use tabular numbers (`font-variant-numeric: tabular-nums`).
- **Icons**: Vector SVG icons only (`lucide-react`), zero emoji structural icons.
- **Interactivity**: All clickable targets MUST have `cursor: pointer`, 150-250ms smooth transition states, and visible focus outlines.

---

### Task 1: Type Definitions & Data Models

**Files:**
- Create: `src/types/dentr.ts`

**Interfaces:**
- Produces: `DentistrySession`, `SessionType`, `SessionStatus`, `RotationGroup`, `StudentGroupId`, `PresetTabId`, `UrgentAlert`, `AdminSessionState`

- [ ] **Step 1: Create `src/types/dentr.ts` with complete domain model**

```typescript
export type PresetTabId = 'overview' | 'daily' | 'weekly' | 'rotations' | 'admin';

export type StudentGroupId = 'all' | 'group-a' | 'group-b' | 'group-c';

export type SessionTypeId = 'lecture' | 'phantom_lab' | 'clinical_practice' | 'exam_viva';

export type SessionStatusId = 'normal' | 'cancelled' | 'chair_changed' | 'rescheduled';

export interface DentistrySession {
  id: string;
  title: string;
  type: SessionTypeId;
  status: SessionStatusId;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  startTime: string; // HH:mm format, e.g. "08:30"
  endTime: string;   // HH:mm format, e.g. "10:30"
  location: string;  // e.g. "Clinic 3 - Chair 14" or "Phantom Lab B"
  instructor: string;
  assignedGroup: 'all' | 'group-a' | 'group-b' | 'group-c';
  equipmentChecklist: string[]; // e.g. ["Typodont", "Rubber Dam", "Extraction Kit"]
  note?: string;
  originalLocation?: string;
}

export interface UrgentAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'urgent' | 'warning' | 'info';
  sessionId?: string;
}

export interface RotationAssignment {
  departmentId: string;
  departmentName: string;
  groupA: { chairRange: string; supervisor: string; preparation: string };
  groupB: { chairRange: string; supervisor: string; preparation: string };
  groupC: { chairRange: string; supervisor: string; preparation: string };
}
```

- [ ] **Step 2: Commit type definitions**

```bash
git add src/types/dentr.ts
git commit -m "feat: add dentistry domain typescript definitions"
```

---

### Task 2: Mock Dataset & Storage Service

**Files:**
- Create: `src/data/mockDentistryData.ts`
- Create: `src/services/dentrStorage.ts`

**Interfaces:**
- Consumes: `DentistrySession`, `UrgentAlert`, `RotationAssignment`, `StudentGroupId`, `PresetTabId`
- Produces: `mockDentistrySessions`, `mockUrgentAlerts`, `mockRotationAssignments`, `dentrStorage` helper object

- [ ] **Step 1: Create `src/data/mockDentistryData.ts`**

```typescript
import { DentistrySession, UrgentAlert, RotationAssignment } from '../types/dentr';

export const mockDentistrySessions: DentistrySession[] = [
  {
    id: 's1',
    title: 'Operative Dentistry & Cavity Prep',
    type: 'phantom_lab',
    status: 'normal',
    day: 'monday',
    startTime: '08:30',
    endTime: '11:00',
    location: 'Phantom Lab B - Unit 12',
    instructor: 'Prof. Sarah Jenkins',
    assignedGroup: 'group-a',
    equipmentChecklist: ['Typodont Jaw', 'High-Speed Handpiece', 'Bur Kit #2', 'Rubber Dam Kit'],
    note: 'Class II Amalgam Prep evaluation today.'
  },
  {
    id: 's2',
    title: 'Prosthodontics Clinical Patient Session',
    type: 'clinical_practice',
    status: 'chair_changed',
    day: 'monday',
    startTime: '11:15',
    endTime: '13:45',
    location: 'Main Clinic 3 - Chair 18',
    originalLocation: 'Main Clinic 3 - Chair 04',
    instructor: 'Dr. Michael Vance',
    assignedGroup: 'group-b',
    equipmentChecklist: ['Impression Trays', 'Alginate & Bowl', 'Bite Registration Wax', 'Facebow'],
    note: 'Chair changed due to unit maintenance.'
  },
  {
    id: 's3',
    title: 'Oral & Maxillofacial Pathology Lecture',
    type: 'lecture',
    status: 'normal',
    day: 'monday',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Amphitheater 1',
    instructor: 'Dr. Robert Chen',
    assignedGroup: 'all',
    equipmentChecklist: ['Lecture Slides', 'Notebook'],
    note: 'Midterm review chapter 5 & 6.'
  },
  {
    id: 's4',
    title: 'Periodontics Scaling & Root Planing',
    type: 'clinical_practice',
    status: 'cancelled',
    day: 'tuesday',
    startTime: '09:00',
    endTime: '12:00',
    location: 'Perio Clinic - Chair 08',
    instructor: 'Dr. Elena Rostova',
    assignedGroup: 'group-c',
    equipmentChecklist: ['Graceycurettes 1/2, 11/12, 13/14', 'Ultrasonic Scaler Tip'],
    note: 'Cancelled due to faculty emergency. Reschedule pending.'
  },
  {
    id: 's5',
    title: 'Endodontics Root Canal Viva & Exam',
    type: 'exam_viva',
    status: 'normal',
    day: 'wednesday',
    startTime: '10:00',
    endTime: '12:30',
    location: 'Endo Spec Lab A',
    instructor: 'Prof. Harrison Ford',
    assignedGroup: 'group-a',
    equipmentChecklist: ['Extracted Tooth Block', 'K-Files #15-40', 'Sodium Hypochlorite', 'Apex Locator'],
    note: 'Practical exam under stereomicroscope.'
  }
];

export const mockUrgentAlerts: UrgentAlert[] = [
  {
    id: 'a1',
    title: 'Chair Reassignment: Group B Prostho',
    message: 'Group B clinical practice moved from Chair 04 to Chair 18 due to compressor failure.',
    timestamp: '10 mins ago',
    severity: 'urgent',
    sessionId: 's2'
  },
  {
    id: 'a2',
    title: 'Periodontics Cancellation Notice',
    message: 'Tuesday 09:00 Periodontics Clinic for Group C is cancelled.',
    timestamp: '1 hour ago',
    severity: 'warning',
    sessionId: 's4'
  }
];

export const mockRotationAssignments: RotationAssignment[] = [
  {
    departmentId: 'operative',
    departmentName: 'Operative Dentistry Clinic',
    groupA: { chairRange: 'Chairs 01–08', supervisor: 'Prof. Jenkins', preparation: 'Class II Matrix & Wedge setup' },
    groupB: { chairRange: 'Chairs 09–16', supervisor: 'Dr. Miller', preparation: 'Composite Shade Matching' },
    groupC: { chairRange: 'Chairs 17–24', supervisor: 'Dr. Al-Mansoor', preparation: 'Rubber Dam Isolation' }
  },
  {
    departmentId: 'prostho',
    departmentName: 'Prosthodontics Clinic',
    groupA: { chairRange: 'Chairs 10–14', supervisor: 'Dr. Vance', preparation: 'Secondary Impression Trays' },
    groupB: { chairRange: 'Chairs 15–20', supervisor: 'Dr. Zhao', preparation: 'Gothic Arch Tracer' },
    groupC: { chairRange: 'Chairs 01–06', supervisor: 'Prof. Vance', preparation: 'Crown Prep Diamond Burs' }
  }
];
```

- [ ] **Step 2: Create `src/services/dentrStorage.ts`**

```typescript
import { StudentGroupId, PresetTabId } from '../types/dentr';

const STORAGE_KEYS = {
  GROUP: 'dentr_selected_group',
  THEME: 'dentr_theme',
  ACTIVE_TAB: 'dentr_active_tab',
  ADMIN_AUTH: 'dentr_admin_authenticated',
};

export const dentrStorage = {
  getSelectedGroup: (): StudentGroupId => {
    return (localStorage.getItem(STORAGE_KEYS.GROUP) as StudentGroupId) || 'all';
  },
  setSelectedGroup: (group: StudentGroupId): void => {
    localStorage.setItem(STORAGE_KEYS.GROUP, group);
  },

  getTheme: (): 'dark' | 'light' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  },
  setTheme: (theme: 'dark' | 'light'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  getActiveTab: (): PresetTabId => {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as PresetTabId) || 'overview';
  },
  setActiveTab: (tab: PresetTabId): void => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  },

  isAdminAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },
  setAdminAuthenticated: (auth: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, auth ? 'true' : 'false');
  }
};
```

- [ ] **Step 3: Commit dataset & storage service**

```bash
git add src/data/mockDentistryData.ts src/services/dentrStorage.ts
git commit -m "feat: add dentistry mock dataset and localStorage storage service"
```

---

### Task 3: Reusable UI Component Library (`src/components/ui/`) via `ui-styling` + `ui-ux-pro-max`

> **Design & Component Skills**: Built using `ui-styling` component composition rules + `ui-ux-pro-max` design tokens.

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/SessionPill.tsx`
- Create: `src/components/ui/Input.tsx`

**Interfaces:**
- Produces: `Button`, `Card`, `Badge`, `SessionPill`, `Input` primitives with full type safety and accessible focus/active states.

- [ ] **Step 1: Create `src/components/ui/Button.tsx`**

```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    border: '1px solid transparent',
    outline: 'none',
    padding: size === 'sm' ? '0.35rem 0.65rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem',
    fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' },
    secondary: { background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', borderColor: 'var(--color-border)' },
    outline: { background: 'transparent', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', borderColor: 'transparent' },
    danger: { background: '#EF4444', color: 'white', borderColor: '#EF4444' },
  };

  return (
    <button style={{ ...baseStyle, ...variantStyles[variant], ...style }} {...props}>
      {icon}
      {children}
    </button>
  );
};
```

- [ ] **Step 2: Create `src/components/ui/Card.tsx`**

```tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, interactive, onClick, style }) => {
  return (
    <div
      onClick={onClick}
      className={`card-glass ${interactive ? 'card-glass-interactive' : ''}`}
      style={{ padding: '1.25rem', ...style }}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 3: Create `src/components/ui/Badge.tsx` and `SessionPill.tsx`**

```tsx
import React from 'react';
import { SessionStatusId, SessionTypeId } from '../../types/dentr';

export const Badge: React.FC<{ status: SessionStatusId; label?: string }> = ({ status, label }) => {
  const map: Record<SessionStatusId, { class: string; text: string }> = {
    normal: { class: 'badge-normal', text: 'Scheduled' },
    cancelled: { class: 'badge-cancelled', text: 'Cancelled' },
    chair_changed: { class: 'badge-chair-changed', text: 'Chair Swap' },
    rescheduled: { class: 'badge-rescheduled', text: 'Rescheduled' },
  };
  const item = map[status] || map.normal;
  return <span className={`badge ${item.class}`}>{label || item.text}</span>;
};

export const SessionPill: React.FC<{ type: SessionTypeId }> = ({ type }) => {
  const map: Record<SessionTypeId, { class: string; text: string }> = {
    lecture: { class: 'session-pill-lecture', text: 'LECTURE' },
    phantom_lab: { class: 'session-pill-phantom', text: 'PHANTOM LAB' },
    clinical_practice: { class: 'session-pill-clinical', text: 'CLINICAL' },
    exam_viva: { class: 'session-pill-exam', text: 'EXAM / VIVA' },
  };
  const item = map[type] || map.lecture;
  return <span className={`session-pill ${item.class}`}>{item.text}</span>;
};
```

- [ ] **Step 4: Create `src/components/ui/Input.tsx`**

```tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>}
      <input
        style={{
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface-secondary)',
          border: error ? '1px solid #EF4444' : '1px solid var(--color-border)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>{error}</span>}
    </div>
  );
};
```

- [ ] **Step 5: Commit Reusable UI Components**

```bash
git add src/components/ui/
git commit -m "feat: build reusable UI primitives via ui-styling and ui-ux-pro-max skills"
```

---

### Task 4: Top Navigation Bar Component

**Files:**
- Create: `src/components/TopNavbar.tsx`

**Interfaces:**
- Consumes: `StudentGroupId`, `dentrStorage`
- Props: `selectedGroup: StudentGroupId`, `onSelectGroup: (g: StudentGroupId) => void`, `theme: 'dark' | 'light'`, `onToggleTheme: () => void`, `isAdminAuth: boolean`, `alertCount: number`

- [ ] **Step 1: Build `src/components/TopNavbar.tsx`**

```tsx
import React from 'react';
import { Activity, Sun, Moon, Shield, ShieldCheck, ChevronDown } from 'lucide-react';
import { StudentGroupId } from '../types/dentr';

interface TopNavbarProps {
  selectedGroup: StudentGroupId;
  onSelectGroup: (group: StudentGroupId) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isAdminAuth: boolean;
  alertCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  selectedGroup,
  onSelectGroup,
  theme,
  onToggleTheme,
  isAdminAuth,
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="logo-badge" style={{ background: 'rgba(8, 145, 178, 0.15)', borderColor: 'var(--color-primary)' }}>
          <Activity className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
        </div>
        <div>
          <h1 className="brand-title" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Dentr
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dentistry Promotion Hub</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            value={selectedGroup}
            onChange={(e) => onSelectGroup(e.target.value as StudentGroupId)}
            style={{
              appearance: 'none',
              padding: '0.45rem 2rem 0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Promotion Groups</option>
            <option value="group-a">Group A (Dental Surgery)</option>
            <option value="group-b">Group B (Prosthodontics)</option>
            <option value="group-c">Group C (Orthodontics)</option>
          </select>
          <ChevronDown className="w-4 h-4" style={{ position: 'absolute', right: '0.65rem', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
        </div>

        <button
          onClick={onToggleTheme}
          title="Toggle Dark / Light Medical Theme"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: '#FBBF24' }} /> : <Moon className="w-4 h-4" style={{ color: '#0284C7' }} />}
        </button>

        <div
          title={isAdminAuth ? 'Admin Authenticated' : 'Admin PIN Locked'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: isAdminAuth ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-secondary)',
            border: `1px solid ${isAdminAuth ? 'rgba(16, 185, 129, 0.3)' : 'var(--color-border)'}`,
            color: isAdminAuth ? '#34D399' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {isAdminAuth ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          <span>{isAdminAuth ? 'Admin Unlocked' : 'PIN Locked'}</span>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 2: Commit TopNavbar component**

```bash
git add src/components/TopNavbar.tsx
git commit -m "feat: build TopNavbar header with group selector, theme toggle, and admin badge"
```

---

### Task 5: Preset Tab Bar Navigation Component

**Files:**
- Create: `src/components/PresetTabBar.tsx`

**Interfaces:**
- Consumes: `PresetTabId`
- Props: `activeTab: PresetTabId`, `onTabChange: (tab: PresetTabId) => void`, `urgentAlertCount: number`

- [ ] **Step 1: Build `src/components/PresetTabBar.tsx`**

```tsx
import React from 'react';
import { LayoutDashboard, Calendar, Grid, Users, ShieldAlert } from 'lucide-react';
import { PresetTabId } from '../types/dentr';

interface PresetTabBarProps {
  activeTab: PresetTabId;
  onTabChange: (tab: PresetTabId) => void;
  urgentAlertCount: number;
}

export const PresetTabBar: React.FC<PresetTabBarProps> = ({
  activeTab,
  onTabChange,
  urgentAlertCount,
}) => {
  const tabs = [
    { id: 'overview' as PresetTabId, label: 'Main Overview', icon: LayoutDashboard },
    { id: 'daily' as PresetTabId, label: 'Daily Agenda', icon: Calendar },
    { id: 'weekly' as PresetTabId, label: 'Weekly Matrix', icon: Grid },
    { id: 'rotations' as PresetTabId, label: 'Rotation Groups', icon: Users },
    { id: 'admin' as PresetTabId, label: 'Admin Portal', icon: ShieldAlert },
  ];

  return (
    <nav style={{ padding: '0.75rem 1.5rem 0', background: 'var(--bg-app)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                background: isActive ? 'rgba(8, 145, 178, 0.15)' : 'transparent',
                color: isActive ? 'var(--color-secondary)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 200ms ease',
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'overview' && urgentAlertCount > 0 && (
                <span
                  style={{
                    background: '#EF4444',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    padding: '0.1rem 0.45rem',
                    marginLeft: '0.25rem',
                  }}
                >
                  {urgentAlertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```

- [ ] **Step 2: Commit PresetTabBar component**

```bash
git add src/components/PresetTabBar.tsx
git commit -m "feat: build PresetTabBar navigation with active indicator and alert badges"
```

---

### Task 6: Main Overview & Orchestrator Tab View

**Files:**
- Create: `src/components/MainOverviewTab.tsx`

**Interfaces:**
- Consumes: `DentistrySession`, `UrgentAlert`, `StudentGroupId`, `PresetTabId`, `Card`, `Badge`, `SessionPill`
- Props: `sessions: DentistrySession[]`, `alerts: UrgentAlert[]`, `selectedGroup: StudentGroupId`, `onNavigateTab: (tab: PresetTabId) => void`

- [ ] **Step 1: Build `src/components/MainOverviewTab.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, Shield, MapPin, User, Package } from 'lucide-react';
import { DentistrySession, UrgentAlert, StudentGroupId, PresetTabId } from '../types/dentr';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { SessionPill } from './ui/SessionPill';

interface MainOverviewTabProps {
  sessions: DentistrySession[];
  alerts: UrgentAlert[];
  selectedGroup: StudentGroupId;
  onNavigateTab: (tab: PresetTabId) => void;
}

export const MainOverviewTab: React.FC<MainOverviewTabProps> = ({
  sessions,
  alerts,
  selectedGroup,
  onNavigateTab,
}) => {
  const [countdown, setCountdown] = useState({ hours: '01', mins: '24', secs: '45' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const secs = String(59 - now.getSeconds()).padStart(2, '0');
      const mins = String(59 - now.getMinutes()).padStart(2, '0');
      setCountdown({ hours: '00', mins, secs });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextSession = sessions[0] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      {nextSession && (
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Badge status="normal" label="LIVE NEXT UP" />
                <SessionPill type={nextSession.type} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {nextSession.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  {nextSession.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User className="w-4 h-4" />
                  {nextSession.instructor}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STARTS IN</span>
              <div className="tabular-nums" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
                {countdown.hours}:{countdown.mins}:{countdown.secs}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Package className="w-3.5 h-3.5" /> Required Kit:
            </span>
            {nextSession.equipmentChecklist.map((item, idx) => (
              <span key={idx} style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                {item}
              </span>
            ))}
          </div>
        </Card>
      )}

      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} /> Urgent Promotion Alerts
          </h3>
          {alerts.map((alert) => (
            <Card key={alert.id} style={{ borderLeft: '4px solid #EF4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FCA5A5' }}>{alert.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{alert.message}</p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{alert.timestamp}</span>
            </Card>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <Card interactive onClick={() => onNavigateTab('daily')}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Daily Agenda <ArrowRight className="w-4 h-4" />
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>View today's live hour-by-hour session timeline & equipment checklists.</p>
        </Card>

        <Card interactive onClick={() => onNavigateTab('rotations')}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Clinical Rotations <ArrowRight className="w-4 h-4" />
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Check clinical chair allocations & supervisor prep notes for Groups A, B, C.</p>
        </Card>

        <Card interactive onClick={() => onNavigateTab('admin')}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Admin Portal <Shield className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1-click session cancellations, chair swaps, and alert broadcasts.</p>
        </Card>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit MainOverviewTab component**

```bash
git add src/components/MainOverviewTab.tsx
git commit -m "feat: build MainOverviewTab orchestrator with live countdown and alert center"
```

---

### Task 7: Daily Agenda & Weekly Matrix Tab Views

**Files:**
- Create: `src/components/DailyAgendaTab.tsx`
- Create: `src/components/WeeklyMatrixTab.tsx`

**Interfaces:**
- Consumes: `DentistrySession`, `StudentGroupId`, `Card`, `Badge`, `SessionPill`

- [ ] **Step 1: Build `src/components/DailyAgendaTab.tsx`**

```tsx
import React from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import { DentistrySession, StudentGroupId } from '../types/dentr';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { SessionPill } from './ui/SessionPill';

interface DailyAgendaTabProps {
  sessions: DentistrySession[];
  selectedGroup: StudentGroupId;
}

export const DailyAgendaTab: React.FC<DailyAgendaTabProps> = ({ sessions, selectedGroup }) => {
  const filtered = sessions.filter(s => selectedGroup === 'all' || s.assignedGroup === 'all' || s.assignedGroup === selectedGroup);

  return (
    <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Daily Session Timeline
      </h3>
      {filtered.map((session) => (
        <Card key={session.id} style={{ borderLeft: `4px solid var(--session-${session.type === 'phantom_lab' ? 'phantom' : session.type})` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <SessionPill type={session.type} />
                <Badge status={session.status} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>{session.title}</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-secondary)' }}>
              <Clock className="w-4 h-4" /> {session.startTime} - {session.endTime}
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> {session.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User className="w-4 h-4" /> {session.instructor}
            </span>
          </div>

          {session.equipmentChecklist.length > 0 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Equipment:</span>
              {session.equipmentChecklist.map((eq, i) => (
                <span key={i} className="equipment-tag">{eq}</span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Build `src/components/WeeklyMatrixTab.tsx`**

```tsx
import React from 'react';
import { DentistrySession, StudentGroupId } from '../types/dentr';
import { Card } from './ui/Card';

interface WeeklyMatrixTabProps {
  sessions: DentistrySession[];
  selectedGroup: StudentGroupId;
}

export const WeeklyMatrixTab: React.FC<WeeklyMatrixTabProps> = ({ sessions, selectedGroup }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
        Weekly Timetable Matrix
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {days.map((day) => {
          const daySessions = sessions.filter(s => s.day === day && (selectedGroup === 'all' || s.assignedGroup === 'all' || s.assignedGroup === selectedGroup));
          return (
            <Card key={day} style={{ padding: '1rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                {day}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {daySessions.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>No sessions scheduled</p>
                ) : (
                  daySessions.map(s => (
                    <div key={s.id} style={{ background: 'var(--bg-surface-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid var(--session-${s.type === 'phantom_lab' ? 'phantom' : s.type})` }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{s.startTime} - {s.endTime}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{s.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.location}</div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Commit DailyAgendaTab & WeeklyMatrixTab**

```bash
git add src/components/DailyAgendaTab.tsx src/components/WeeklyMatrixTab.tsx
git commit -m "feat: build DailyAgendaTab and WeeklyMatrixTab timetable views"
```

---

### Task 8: Rotation Groups & Admin Management Tab Views

**Files:**
- Create: `src/components/RotationGroupsTab.tsx`
- Create: `src/components/AdminManagementTab.tsx`

**Interfaces:**
- Consumes: `RotationAssignment`, `DentistrySession`, `dentrStorage`, `Card`, `Button`, `Input`

- [ ] **Step 1: Build `src/components/RotationGroupsTab.tsx`**

```tsx
import React from 'react';
import { Activity } from 'lucide-react';
import { mockRotationAssignments } from '../data/mockDentistryData';
import { Card } from './ui/Card';

export const RotationGroupsTab: React.FC = () => {
  return (
    <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Clinical Department Rotations & Chair Allocations
      </h3>
      {mockRotationAssignments.map((rot) => (
        <Card key={rot.departmentId} style={{ padding: '1.25rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity className="w-5 h-5" /> {rot.departmentName}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#34D399' }}>Group A</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{rot.groupA.chairRange}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Supervisor: {rot.groupA.supervisor}</p>
            </div>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#60A5FA' }}>Group B</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{rot.groupB.chairRange}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Supervisor: {rot.groupB.supervisor}</p>
            </div>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#FBBF24' }}>Group C</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{rot.groupC.chairRange}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Supervisor: {rot.groupC.supervisor}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Build `src/components/AdminManagementTab.tsx` using Button & Input primitives**

```tsx
import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { DentistrySession } from '../types/dentr';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';

interface AdminManagementTabProps {
  isAdminAuth: boolean;
  onAuthenticate: (pin: string) => boolean;
  sessions: DentistrySession[];
  onToggleStatus: (sessionId: string, newStatus: any) => void;
}

export const AdminManagementTab: React.FC<AdminManagementTabProps> = ({
  isAdminAuth,
  onAuthenticate,
  sessions,
  onToggleStatus,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAuthenticate(pin)) {
      setError('');
    } else {
      setError('Invalid 4-Digit PIN. Try 1234.');
    }
  };

  if (!isAdminAuth) {
    return (
      <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'rgba(8, 145, 178, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Admin PIN Verification</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enter class representative PIN to manage schedules & alerts.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              error={error}
              style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem' }}
            />
            <Button type="submit" variant="primary" style={{ width: '100%' }}>
              Unlock Admin Portal
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Unlock className="w-5 h-5" style={{ color: '#10B981' }} /> Class Rep Admin Management
        </h3>
        <Badge status="normal" label="AUTHENTICATED" />
      </div>

      <Card style={{ padding: '1.25rem' }}>
        <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Quick Session Status Controller</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sessions.map((s) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({s.location})</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Button size="sm" variant={s.status === 'normal' ? 'primary' : 'secondary'} onClick={() => onToggleStatus(s.id, 'normal')}>Scheduled</Button>
                <Button size="sm" variant={s.status === 'cancelled' ? 'danger' : 'secondary'} onClick={() => onToggleStatus(s.id, 'cancelled')}>Cancel</Button>
                <Button size="sm" variant={s.status === 'chair_changed' ? 'outline' : 'secondary'} onClick={() => onToggleStatus(s.id, 'chair_changed')}>Chair Swap</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
```

- [ ] **Step 3: Commit RotationGroupsTab & AdminManagementTab**

```bash
git add src/components/RotationGroupsTab.tsx src/components/AdminManagementTab.tsx
git commit -m "feat: build RotationGroupsTab and PIN-protected AdminManagementTab"
```

---

### Task 9: Integration & Main App Wireup

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Wire all components and tabs in `src/App.tsx`**

```tsx
import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { PresetTabBar } from './components/PresetTabBar';
import { MainOverviewTab } from './components/MainOverviewTab';
import { DailyAgendaTab } from './components/DailyAgendaTab';
import { WeeklyMatrixTab } from './components/WeeklyMatrixTab';
import { RotationGroupsTab } from './components/RotationGroupsTab';
import { AdminManagementTab } from './components/AdminManagementTab';
import { dentrStorage } from './services/dentrStorage';
import { mockDentistrySessions, mockUrgentAlerts } from './data/mockDentistryData';
import { PresetTabId, StudentGroupId, DentistrySession } from './types/dentr';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PresetTabId>(() => dentrStorage.getActiveTab());
  const [selectedGroup, setSelectedGroup] = useState<StudentGroupId>(() => dentrStorage.getSelectedGroup());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => dentrStorage.getTheme());
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => dentrStorage.isAdminAuthenticated());
  const [sessions, setSessions] = useState<DentistrySession[]>(mockDentistrySessions);

  useEffect(() => {
    dentrStorage.setTheme(theme);
  }, [theme]);

  const handleSelectGroup = (g: StudentGroupId) => {
    setSelectedGroup(g);
    dentrStorage.setSelectedGroup(g);
  };

  const handleTabChange = (t: PresetTabId) => {
    setActiveTab(t);
    dentrStorage.setActiveTab(t);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAuthenticateAdmin = (pin: string): boolean => {
    if (pin === '1234') {
      setIsAdminAuth(true);
      dentrStorage.setAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleToggleSessionStatus = (sessionId: string, newStatus: any) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <TopNavbar
        selectedGroup={selectedGroup}
        onSelectGroup={handleSelectGroup}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isAdminAuth={isAdminAuth}
        alertCount={mockUrgentAlerts.length}
      />
      <PresetTabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        urgentAlertCount={mockUrgentAlerts.length}
      />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        {activeTab === 'overview' && (
          <MainOverviewTab
            sessions={sessions}
            alerts={mockUrgentAlerts}
            selectedGroup={selectedGroup}
            onNavigateTab={handleTabChange}
          />
        )}
        {activeTab === 'daily' && (
          <DailyAgendaTab sessions={sessions} selectedGroup={selectedGroup} />
        )}
        {activeTab === 'weekly' && (
          <WeeklyMatrixTab sessions={sessions} selectedGroup={selectedGroup} />
        )}
        {activeTab === 'rotations' && (
          <RotationGroupsTab />
        )}
        {activeTab === 'admin' && (
          <AdminManagementTab
            isAdminAuth={isAdminAuth}
            onAuthenticate={handleAuthenticateAdmin}
            sessions={sessions}
            onToggleStatus={handleToggleSessionStatus}
          />
        )}
      </main>
    </div>
  );
};

export default App;
```

- [ ] **Step 2: Run verification build**

Run: `npm run build`
Expected: Production build succeeds with 0 errors.

- [ ] **Step 3: Commit final integration**

```bash
git add src/App.tsx
git commit -m "feat: complete Dentr UI/UX rebuild integration with reusable components and preset tabs"
```

---

## Execution Handoff

Plan updated and saved to `docs/superpowers/plans/2026-08-01-dentr-ui-rebuild.md`. Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using `executing-plans`, batch execution with checkpoints
