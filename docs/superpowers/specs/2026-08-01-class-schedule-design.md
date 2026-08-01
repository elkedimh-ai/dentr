# ClassSchedule - System Design Specification

## 1. Executive Summary
**ClassSchedule** is a high-performance web application designed for students and classmates to quickly view their class planning, room locations, professor details, and live countdown to their next course. It supports multiple student groups, accounts for frequently changing schedules, and includes a secure Admin Dashboard for group representatives to make instant updates (cancelling classes, room changes, rescheduled times).

The architecture is designed to be **lightweight, cost-free, and high-throughput**, using React + TypeScript on the frontend, Supabase Edge Functions (Deno) for the serverless backend API, Redis for database query caching, and a short-lived client-side cache to protect database infrastructure.

---

## 2. Core Features & User Workflows

### 2.1 Classmate View (Zero Login Required)
- **Group & Subgroup Selector**: Pick student group (e.g. Group A, Group B) and optional subgroup (e.g. TP1, TD2). Persisted in `localStorage`.
- **"Next Course Up" Hero Banner**: Prominently highlights the upcoming class for the selected group with a live countdown timer (hours, minutes, seconds), room number, professor, and status badges.
- **Interactive Daily & Weekly Schedule Views**:
  - **Daily Agenda**: Vertical timeline for today/selected day with a live progress indicator for ongoing classes.
  - **Weekly Grid Matrix**: Color-coded 5-day / 7-day grid showing all time slots, room locations, and instructor details.
- **Search & Filter**: Instant search by course title, professor name, or room code.
- **Status & Changes Badges**: Eye-catching badges for:
  - 🛑 `Cancelled` (Class cancelled for today)
  - 🔄 `Room Changed` (e.g. Moved to Lab B204)
  - ⏰ `Rescheduled` / `Special Event`
  - 💻 `Online` (with clickable Zoom / Teams link)
- **iCal / Calendar Export**: Quick button to download or add courses to personal calendar apps.
- **Manual Refresh Control**: Button to bypass client cache and pull fresh data immediately.

### 2.2 Admin Dashboard (Password / PIN Protected)
- **Authentication**: Secure PIN or password login to access editing tools.
- **1-Click Quick Status Editor**: Instantly mark any course as Cancelled, change its room number on the fly, or add a custom status note (e.g., "Professor on leave").
- **Course CRUD Suite**: Create, edit, duplicate, or delete weekly recurring courses per group.
- **Group Management**: Add new groups or sub-group tags.
- **Instant Cache Invalidation**: Saving changes in Admin mode automatically flushes the corresponding Redis cache key so classmates receive updated schedule data on their next request.

---

## 3. Technical Architecture & Tech Stack

### 3.1 Technology Stack
- **Frontend Framework**: React 18+ with TypeScript, bundled with **Vite** for fast hot-reloading and UI performance.
- **Styling & UI**: Custom modern CSS design system with HSL variables, glassmorphism UI cards, dark/light theme toggle, and smooth animations.
- **Icons & Visuals**: Lucide Icons for clean visual indicators.
- **Backend API**: Supabase Edge Functions (Deno / TypeScript REST endpoints).
- **Database**: Supabase PostgreSQL database.
- **Backend Cache**: Redis (Upstash Redis or HTTP Redis API) for caching group schedule queries with TTL and cache invalidation on admin edits.
- **Client Cache**: In-memory frontend cache layer (30-60 second TTL) to eliminate redundant network requests during tab/view switching.

---

## 4. Data Schemas

### 4.1 `groups`
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subgroups TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 `courses`
```sql
CREATE TYPE course_status AS ENUM ('normal', 'cancelled', 'room_changed', 'rescheduled', 'online');

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  subgroup TEXT DEFAULT 'All',
  title TEXT NOT NULL,
  code TEXT,
  professor TEXT NOT NULL,
  room TEXT NOT NULL,
  day_of_week INT2 NOT NULL, -- 0 = Monday, 1 = Tuesday ... 6 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status course_status DEFAULT 'normal',
  status_note TEXT,
  online_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. API Endpoints & Caching Workflow

### 5.1 Endpoints Specification
- `GET /api/groups` — List all student groups. Cached in Redis key `schedule:groups` (TTL: 1 hour).
- `GET /api/schedule?group_id={id}&subgroup={tag}` — Fetch courses for group/subgroup.
  - **Cache Key**: `schedule:group:{id}:{subgroup}` (TTL: 10 minutes).
  - **Redis Cache Hit**: Return response in <5ms.
  - **Redis Cache Miss**: Query Postgres DB, store in Redis, return response.
- `POST /api/admin/login` — Verify Admin PIN/Password. Returns token.
- `POST /api/admin/courses` — Add a new course. Invalidates Redis key `schedule:group:{group_id}:*`.
- `PUT /api/admin/courses/:id` — Update course details or status (Cancel, Room Change). Invalidates Redis cache key.
- `DELETE /api/admin/courses/:id` — Delete a course. Invalidates Redis cache key.

### 5.2 Frontend Caching Workflow
- Frontend maintains an in-memory Map of fetched schedule responses with timestamps.
- If a user switches between Daily and Weekly view or toggles back to a previously viewed group within **45 seconds**, the frontend renders from memory without making a network call.
- Clicking "Refresh" clears the local memory cache entry and executes a fresh fetch from the Edge Function.

---

## 6. Project Structure

```
/root/dentr
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── NextCourseHero.tsx
│   │   ├── DailyAgenda.tsx
│   │   ├── WeeklyGrid.tsx
│   │   ├── AdminModal.tsx
│   │   ├── QuickStatusModal.tsx
│   │   └── GroupSelector.tsx
│   ├── services/
│   │   ├── api.ts          # API client with frontend 45s TTL cache
│   │   ├── supabase.ts     # Supabase client setup
│   │   └── redisCache.ts   # Redis cache helper / mock fallback engine
│   ├── types/
│   │   └── schedule.ts     # TypeScript interfaces
│   └── data/
│       └── mockData.ts     # Comprehensive initial sample data for instant local execution
└── supabase/
    └── functions/
        ├── schedule/
        │   └── index.ts    # Deno Edge Function for schedule retrieval & caching
        └── admin-courses/
            └── index.ts    # Deno Edge Function for admin mutations & cache invalidation
```

---

## 7. Error Handling & Resilience
- **Database / Redis Connection Fallback**: If Redis service is unavailable, Edge Function seamlessly degrades to direct Postgres DB query.
- **Local Dev Fallback**: Includes local mock dataset and local storage sync layer so developers or classmates can run and preview the site instantly out-of-the-box without needing live API keys configured upfront.
- **UI Error Boundary**: User-friendly toast notifications and empty-state fallbacks for offline or network error states.
