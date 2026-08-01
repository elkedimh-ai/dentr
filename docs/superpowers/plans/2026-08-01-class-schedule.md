# ClassSchedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-friendly, high-performance web application (React 19 + TypeScript + Vite + Supabase Edge Functions + Redis cache) for student schedule management, featuring a Next-Course countdown hero, Daily Agenda, Weekly Matrix, and PIN-protected Admin Dashboard.

**Architecture:** A Vite + React 19 Single Page Application communicating with serverless Supabase Edge Functions. Includes an in-memory 45-second client cache layer and a Redis database query cache with instant invalidation on admin schedule updates. Fallbacks gracefully to local mock storage so the app is instantly functional out-of-the-box.

**Tech Stack:** React 19, TypeScript 5.7+, Vite, Lucide-React Icons, HSL Vanilla CSS with Design System Tokens, Supabase Edge Functions (Deno), Redis (Upstash).

## Global Constraints
- React 19 + TypeScript.
- Design System tokens defined in `src/index.css` following `DESIGN.md`.
- No classmate login required; group choice saved in `localStorage`.
- PIN/Password authentication for Admin Dashboard (`VITE_ADMIN_PIN` or default `'1234'`).
- 45-second client-side memory cache in `src/services/api.ts`.
- Supabase Edge Functions in `supabase/functions/`.

---

### Task 1: Project Setup & Base Design System Tokens

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx`

**Interfaces:**
- Produces: Base Vite + React 19 application structure with global CSS tokens and typography.

- [ ] **Step 1: Create package.json with React 19 and dependencies**

```json
{
  "name": "class-schedule",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.474.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts and tsconfig.json**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
```

- [ ] **Step 3: Create src/index.css with Design Tokens per DESIGN.md**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --bg-dark: #0B0F17;
  --bg-card: rgba(17, 24, 39, 0.7);
  --bg-card-hover: rgba(31, 41, 55, 0.8);
  --bg-card-border: rgba(255, 255, 255, 0.08);
  
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;

  --accent-hero: linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%);
  --accent-cyan: #06B6D4;
  --accent-blue: #3B82F6;
  
  --status-normal: #10B981;
  --status-cancelled: #F43F5E;
  --status-room-changed: #F59E0B;
  --status-rescheduled: #8B5CF6;
  --status-online: #3B82F6;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 4: Verify build setup**

Run: `npm install`
Expected: Packages installed cleanly without peer dependency conflicts.

---

### Task 2: Data Models, TypeScript Interfaces & Mock Dataset

**Files:**
- Create: `src/types/schedule.ts`
- Create: `src/data/mockData.ts`

**Interfaces:**
- Produces: `Group`, `Course`, `CourseStatus`, `ScheduleFilter` interfaces and default initial mock data for immediate application execution.

- [ ] **Step 1: Create src/types/schedule.ts**

```typescript
export type CourseStatus = 'normal' | 'cancelled' | 'room_changed' | 'rescheduled' | 'online';

export interface Group {
  id: string;
  name: string;
  subgroups: string[];
  color: string;
}

export interface Course {
  id: string;
  groupId: string;
  subgroup: string; // 'All' or specific e.g. 'TP1'
  title: string;
  code: string;
  professor: string;
  room: string;
  dayOfWeek: number; // 0 = Monday, 1 = Tuesday ... 6 = Sunday
  startTime: string; // HH:MM (e.g. '08:30')
  endTime: string;   // HH:MM (e.g. '10:00')
  status: CourseStatus;
  statusNote?: string;
  onlineLink?: string;
}

export interface ScheduleFilter {
  groupId: string;
  subgroup: string;
  searchQuery: string;
}
```

- [ ] **Step 2: Create src/data/mockData.ts**

```typescript
import { Group, Course } from '../types/schedule';

export const INITIAL_GROUPS: Group[] = [
  { id: 'g1', name: 'Computer Science - Year 2', subgroups: ['All', 'TP1', 'TP2', 'TD1'], color: '#06B6D4' },
  { id: 'g2', name: 'Software Engineering - Year 3', subgroups: ['All', 'Group A', 'Group B'], color: '#8B5CF6' },
  { id: 'g3', name: 'Data Science - Year 1', subgroups: ['All', 'Lab 1', 'Lab 2'], color: '#10B981' }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    groupId: 'g1',
    subgroup: 'All',
    title: 'Database Systems & SQL',
    code: 'CS201',
    professor: 'Dr. Sarah Jenkins',
    room: 'Amphi B3',
    dayOfWeek: 0, // Monday
    startTime: '08:30',
    endTime: '10:30',
    status: 'normal'
  },
  {
    id: 'c2',
    groupId: 'g1',
    subgroup: 'TP1',
    title: 'Operating Systems Lab',
    code: 'CS204',
    professor: 'Prof. Alan Turing',
    room: 'Lab 204',
    dayOfWeek: 0, // Monday
    startTime: '10:45',
    endTime: '12:45',
    status: 'room_changed',
    statusNote: 'Moved to Computer Lab B102 for today'
  },
  {
    id: 'c3',
    groupId: 'g1',
    subgroup: 'All',
    title: 'Algorithms & Data Structures',
    code: 'CS202',
    professor: 'Dr. Michael Chen',
    room: 'Amphi A1',
    dayOfWeek: 1, // Tuesday
    startTime: '14:00',
    endTime: '16:00',
    status: 'cancelled',
    statusNote: 'Prof attending conference. Self-study chapter 4.'
  }
];
```

---

### Task 3: Client Cache Engine & API Layer (45s In-Memory TTL)

**Files:**
- Create: `src/services/api.ts`

**Interfaces:**
- Consumes: `Course`, `Group`, `INITIAL_GROUPS`, `INITIAL_COURSES`.
- Produces: `fetchGroups()`, `fetchSchedule(groupId, subgroup)`, `updateCourseStatus(id, status, note)`, `saveCourse(course)`, `deleteCourse(id)`.

- [ ] **Step 1: Create src/services/api.ts with 45s TTL cache & local storage fallback**

```typescript
import { Group, Course, CourseStatus } from '../types/schedule';
import { INITIAL_GROUPS, INITIAL_COURSES } from '../data/mockData';

const CACHE_TTL_MS = 45 * 1000; // 45 seconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

// Initialize local storage if needed
function getStoredCourses(): Course[] {
  const local = localStorage.getItem('class_schedule_courses');
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem('class_schedule_courses', JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
}

function getStoredGroups(): Group[] {
  const local = localStorage.getItem('class_schedule_groups');
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem('class_schedule_groups', JSON.stringify(INITIAL_GROUPS));
  return INITIAL_GROUPS;
}

export function clearClientCache() {
  memoryCache.clear();
}

export async function fetchGroups(): Promise<Group[]> {
  const cacheKey = 'groups_list';
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  
  const groups = getStoredGroups();
  memoryCache.set(cacheKey, { data: groups, timestamp: Date.now() });
  return groups;
}

export async function fetchSchedule(groupId: string, subgroup: string = 'All'): Promise<Course[]> {
  const cacheKey = `schedule_${groupId}_${subgroup}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const allCourses = getStoredCourses();
  const filtered = allCourses.filter(c => 
    c.groupId === groupId && (subgroup === 'All' || c.subgroup === 'All' || c.subgroup === subgroup)
  );

  memoryCache.set(cacheKey, { data: filtered, timestamp: Date.now() });
  return filtered;
}

export async function updateCourse(updatedCourse: Course): Promise<void> {
  const courses = getStoredCourses();
  const idx = courses.findIndex(c => c.id === updatedCourse.id);
  if (idx !== -1) {
    courses[idx] = updatedCourse;
  } else {
    courses.push(updatedCourse);
  }
  localStorage.setItem('class_schedule_courses', JSON.stringify(courses));
  clearClientCache(); // Invalidate frontend memory cache on edit
}

export async function deleteCourse(courseId: string): Promise<void> {
  const courses = getStoredCourses().filter(c => c.id !== courseId);
  localStorage.setItem('class_schedule_courses', JSON.stringify(courses));
  clearClientCache();
}
```

---

### Task 4: Navbar, Header & Controls Component

**Files:**
- Create: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `Group`, `ScheduleFilter`.
- Produces: Header bar with group selector dropdown, subgroup selector, search bar, refresh button, and admin login trigger button.

- [ ] **Step 1: Create src/components/Navbar.tsx**

```tsx
import React from 'react';
import { Calendar, RefreshCw, Lock, Search } from 'lucide-react';
import { Group, ScheduleFilter } from '../types/schedule';

interface NavbarProps {
  groups: Group[];
  filter: ScheduleFilter;
  onFilterChange: (newFilter: ScheduleFilter) => void;
  onRefresh: () => void;
  onOpenAdmin: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  groups,
  filter,
  onFilterChange,
  onRefresh,
  onOpenAdmin,
  isLoading
}) => {
  const currentGroup = groups.find(g => g.id === filter.groupId) || groups[0];

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="logo-badge">
          <Calendar className="w-5 h-5 text-cyan-400" />
        </div>
        <span className="brand-title">ClassSchedule</span>
      </div>

      <div className="navbar-controls">
        {/* Group Selector */}
        <select
          value={filter.groupId}
          onChange={e => onFilterChange({ ...filter, groupId: e.target.value, subgroup: 'All' })}
          className="select-input group-select"
        >
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Subgroup Selector */}
        {currentGroup && currentGroup.subgroups.length > 1 && (
          <select
            value={filter.subgroup}
            onChange={e => onFilterChange({ ...filter, subgroup: e.target.value })}
            className="select-input subgroup-select"
          >
            {currentGroup.subgroups.map(sg => (
              <option key={sg} value={sg}>{sg}</option>
            ))}
          </select>
        )}

        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search course, professor, room..."
            value={filter.searchQuery}
            onChange={e => onFilterChange({ ...filter, searchQuery: e.target.value })}
            className="search-input"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="icon-button"
          title="Refresh schedule data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'spin' : ''}`} />
        </button>

        {/* Admin Login Button */}
        <button onClick={onOpenAdmin} className="admin-button">
          <Lock className="w-4 h-4 mr-1.5" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
```

---

### Task 5: "Next Course Up" Hero Card Component with Live Countdown

**Files:**
- Create: `src/components/NextCourseHero.tsx`

**Interfaces:**
- Consumes: `Course[]`.
- Produces: Hero card computing the next upcoming course today/this week and displaying a live ticking countdown timer with room & status badges.

- [ ] **Step 1: Create src/components/NextCourseHero.tsx**

```tsx
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, AlertCircle, Video } from 'lucide-react';
import { Course } from '../types/schedule';

interface NextCourseHeroProps {
  courses: Course[];
}

export const NextCourseHero: React.FC<NextCourseHeroProps> = ({ courses }) => {
  const [nextCourse, setNextCourse] = useState<Course | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentDay = (now.getDay() + 6) % 7; // Convert 0=Sun to 0=Mon format (0..6)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Find upcoming or ongoing course
      const upcoming = courses
        .filter(c => c.status !== 'cancelled')
        .map(c => {
          const [sh, sm] = c.startTime.split(':').map(Number);
          const startMin = sh * 60 + sm;
          let daysDiff = c.dayOfWeek - currentDay;
          if (daysDiff < 0 || (daysDiff === 0 && startMin < currentMinutes)) {
            daysDiff += 7; // Next week
          }
          return { course: c, startMin, daysDiff };
        })
        .sort((a, b) => a.daysDiff - b.daysDiff || a.startMin - b.startMin)[0];

      if (!upcoming) {
        setNextCourse(null);
        return;
      }

      setNextCourse(upcoming.course);

      // Compute exact seconds difference
      const target = new Date();
      target.setDate(target.getDate() + upcoming.daysDiff);
      const [sh, sm] = upcoming.course.startTime.split(':').map(Number);
      target.setHours(sh, sm, 0, 0);

      const diffSec = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
      const hours = Math.floor(diffSec / 3600);
      const mins = Math.floor((diffSec % 3600) / 60);
      const secs = diffSec % 60;

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [courses]);

  if (!nextCourse) {
    return (
      <div className="hero-card empty">
        <h3>No Upcoming Courses Scheduled</h3>
        <p>Enjoy your break! Check back later for your next class.</p>
      </div>
    );
  }

  return (
    <div className="hero-card">
      <div className="hero-header">
        <span className="hero-label">NEXT COURSE UP</span>
        <div className="countdown-timer tabular-nums">{timeRemaining}</div>
      </div>

      <div className="hero-body">
        <div className="course-main-info">
          <h2 className="course-title">{nextCourse.title}</h2>
          <span className="course-code">{nextCourse.code}</span>
        </div>

        <div className="meta-grid">
          <div className="meta-item">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Room: <strong>{nextCourse.room}</strong></span>
          </div>
          <div className="meta-item">
            <User className="w-4 h-4 text-blue-400" />
            <span>{nextCourse.professor}</span>
          </div>
          <div className="meta-item">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{nextCourse.startTime} - {nextCourse.endTime}</span>
          </div>
        </div>

        {nextCourse.statusNote && (
          <div className={`status-banner status-${nextCourse.status}`}>
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{nextCourse.statusNote}</span>
          </div>
        )}

        {nextCourse.onlineLink && (
          <a href={nextCourse.onlineLink} target="_blank" rel="noreferrer" className="online-link-btn">
            <Video className="w-4 h-4 mr-2" />
            Join Live Lecture Room
          </a>
        )}
      </div>
    </div>
  );
};
```

---

### Task 6: Daily Agenda & Weekly Matrix View Components

**Files:**
- Create: `src/components/DailyAgenda.tsx`
- Create: `src/components/WeeklyGrid.tsx`

**Interfaces:**
- Consumes: `Course[]`.
- Produces: Daily timeline agenda view and 5/7-day weekly schedule matrix view.

- [ ] **Step 1: Create src/components/DailyAgenda.tsx**

```tsx
import React from 'react';
import { Course } from '../types/schedule';
import { MapPin, User, Clock, AlertTriangle } from 'lucide-react';

interface DailyAgendaProps {
  courses: Course[];
  selectedDay: number; // 0 = Mon, 6 = Sun
  onDaySelect: (day: number) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DailyAgenda: React.FC<DailyAgendaProps> = ({ courses, selectedDay, onDaySelect }) => {
  const dayCourses = courses
    .filter(c => c.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="daily-agenda-container">
      {/* Day Selector Tabs */}
      <div className="day-tabs">
        {DAYS.map((day, idx) => (
          <button
            key={day}
            onClick={() => onDaySelect(idx)}
            className={`day-tab ${selectedDay === idx ? 'active' : ''}`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Agenda Timeline */}
      <div className="agenda-timeline">
        {dayCourses.length === 0 ? (
          <div className="empty-day-state">No courses scheduled for {DAYS[selectedDay]}.</div>
        ) : (
          dayCourses.map(course => (
            <div key={course.id} className={`agenda-card status-${course.status}`}>
              <div className="time-pill">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{course.startTime} - {course.endTime}</span>
              </div>
              
              <div className="agenda-details">
                <div className="agenda-header">
                  <h4>{course.title}</h4>
                  <span className="badge-subgroup">{course.subgroup}</span>
                </div>
                <div className="agenda-meta">
                  <span><MapPin className="w-3.5 h-3.5 inline mr-1" />{course.room}</span>
                  <span><User className="w-3.5 h-3.5 inline mr-1 ml-3" />{course.professor}</span>
                </div>
                {course.statusNote && (
                  <div className="agenda-note">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400 inline" />
                    {course.statusNote}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Create src/components/WeeklyGrid.tsx**

```tsx
import React from 'react';
import { Course } from '../types/schedule';

interface WeeklyGridProps {
  courses: Course[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({ courses }) => {
  return (
    <div className="weekly-grid-container">
      <div className="grid-header">
        {DAYS.map(d => (
          <div key={d} className="grid-day-col-title">{d}</div>
        ))}
      </div>
      <div className="grid-body">
        {DAYS.map((_, dayIdx) => {
          const colCourses = courses
            .filter(c => c.dayOfWeek === dayIdx)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={dayIdx} className="grid-day-col">
              {colCourses.map(c => (
                <div key={c.id} className={`grid-course-card status-${c.status}`}>
                  <span className="time">{c.startTime} - {c.endTime}</span>
                  <span className="title">{c.title}</span>
                  <span className="room">📌 {c.room}</span>
                  {c.status !== 'normal' && (
                    <span className="status-tag">{c.status.replace('_', ' ')}</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

---

### Task 7: Admin Dashboard & Quick Status Modal

**Files:**
- Create: `src/components/AdminModal.tsx`

**Interfaces:**
- Consumes: `Course[]`, `Group[]`.
- Produces: PIN authentication and Admin CRUD editor for editing room numbers, cancelling classes, or adding new courses.

- [ ] **Step 1: Create src/components/AdminModal.tsx**

```tsx
import React, { useState } from 'react';
import { X, Lock, CheckCircle, Plus, Trash2, Edit } from 'lucide-react';
import { Course, Group, CourseStatus } from '../types/schedule';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  groups: Group[];
  onSaveCourse: (course: Course) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  courses,
  groups,
  onSaveCourse,
  onDeleteCourse
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === (import.meta.env.VITE_ADMIN_PIN || '1234')) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleQuickStatusChange = async (course: Course, newStatus: CourseStatus, note?: string) => {
    await onSaveCourse({ ...course, status: newStatus, statusNote: note ?? course.statusNote });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Admin Control Center</h3>
          <button onClick={onClose} className="close-btn"><X className="w-5 h-5" /></button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="pin-form">
            <Lock className="w-8 h-8 text-cyan-400 mb-2 mx-auto" />
            <p>Enter Admin Security PIN (Default: 1234)</p>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="PIN Code"
              className="pin-input"
              autoFocus
            />
            {pinError && <p className="error-text">Incorrect PIN Code</p>}
            <button type="submit" className="submit-btn">Unlock Admin Tools</button>
          </form>
        ) : (
          <div className="admin-body">
            <div className="admin-actions">
              <h4>Manage Class Schedules</h4>
            </div>

            <div className="course-admin-list">
              {courses.map(course => (
                <div key={course.id} className="admin-course-row">
                  <div className="row-info">
                    <strong>{course.title}</strong>
                    <span>{course.room} | {course.professor}</span>
                  </div>

                  <div className="quick-status-buttons">
                    <button
                      onClick={() => handleQuickStatusChange(course, 'normal', '')}
                      className={`status-btn normal ${course.status === 'normal' ? 'active' : ''}`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => {
                        const note = prompt('Enter cancellation note:', 'Class cancelled today');
                        if (note !== null) handleQuickStatusChange(course, 'cancelled', note);
                      }}
                      className={`status-btn cancel ${course.status === 'cancelled' ? 'active' : ''}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const newRoom = prompt('Enter new room number:', course.room);
                        if (newRoom) handleQuickStatusChange(course, 'room_changed', `Moved to ${newRoom}`);
                      }}
                      className={`status-btn room ${course.status === 'room_changed' ? 'active' : ''}`}
                    >
                      Change Room
                    </button>
                    <button onClick={() => onDeleteCourse(course.id)} className="delete-btn">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

### Task 8: Supabase Edge Functions & Redis Caching Layer Setup

**Files:**
- Create: `supabase/functions/schedule/index.ts`
- Create: `supabase/functions/admin-courses/index.ts`

**Interfaces:**
- Produces: Edge Functions for Deno runtime with Upstash Redis HTTP caching.

- [ ] **Step 1: Create supabase/functions/schedule/index.ts**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");

serve(async (req) => {
  const url = new URL(req.url);
  const groupId = url.searchParams.get("groupId") || "g1";
  const subgroup = url.searchParams.get("subgroup") || "All";
  const cacheKey = `schedule:${groupId}:${subgroup}`;

  // Check Redis Cache if environment variables are available
  if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${cacheKey}`, {
        headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
      });
      const cacheData = await res.json();
      if (cacheData.result) {
        return new Response(cacheData.result, {
          headers: { "Content-Type": "application/json", "X-Cache": "HIT" },
        });
      }
    } catch (e) {
      console.error("Redis Cache Error:", e);
    }
  }

  return new Response(
    JSON.stringify({ status: "ok", message: "Edge Function active" }),
    { headers: { "Content-Type": "application/json", "X-Cache": "MISS" } }
  );
});
```

---

### Task 9: Assemble Main App & Execute Build Verification

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Connect Navbar, Hero, Agenda, Grid and Admin in App.tsx**

- [ ] **Step 2: Build verification**

Run: `npm run build`
Expected: Production bundle compiled cleanly without TypeScript errors or missing variables.

---
