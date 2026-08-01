# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

University & college students, classmates, and group representatives. Classmates need immediate, zero-friction access to their daily/weekly schedule and live countdown to the next class on mobile and desktop devices. Group reps (Admins) need a quick PIN-protected tool to cancel classes, change room locations, and announce schedule updates on the fly.

## Product Purpose

ClassSchedule eliminates the chaos of frequently changing university timetables across multiple student groups by serving as a central, high-speed, mobile-friendly schedule hub.

## Positioning

Combines a hero "Next Course Up" countdown widget with interactive Daily Agenda and Weekly Matrix views, instant group filtering, clear status badges (*Cancelled*, *Room Changed*, *Rescheduled*), and a super-fast backend cached with Redis and client-side short-lived memory caching.

## Operating Context

Web application built with React 19, TypeScript, Vite, Supabase Edge Functions, and Redis database caching. Classmates check it on their phones while walking to class or on laptops during lectures.

## Capabilities and Constraints

- React 19 + TypeScript UI.
- No classmate login required; group choice remembered in `localStorage`.
- PIN/Password authentication for Admin Dashboard.
- 45s client-side memory cache + Redis DB cache.
- Full offline / local mock data fallback for immediate out-of-the-box execution.

## Product Principles

1. **Instant Clarity & Speed**: Deliver the next class time, room number, and status in under 2 seconds of opening the app.
2. **Scanability & High Contrast**: Visual hierarchy and eye-catching status badges (*Cancelled*, *Room Changed*) so information is readable at a glance.
3. **Frictionless Experience**: No logins, no passwords for students. Admin tools are 1-click away for group reps.
4. **Resilient Architecture**: Multi-tier caching (Client + Redis) so database performance remains smooth even with high concurrent student traffic.
