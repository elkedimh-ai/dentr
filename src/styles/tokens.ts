/**
 * Dentr Design System Tokens - TypeScript Definitions
 * Generated via UI-UX-PRO-MAX Engine
 * Source of Truth: /root/dentr/design-system/dentr/MASTER.md
 */

export const DESIGN_SYSTEM_META = {
  name: 'Dentr',
  engine: 'ui-ux-pro-max',
  version: '2.0.0',
  style: 'Dark Mode (OLED) + Medical Light Mode',
  motionDial: 5,
  densityDial: 8,
  headingFont: 'Figtree',
  bodyFont: 'Noto Sans',
} as const;

export const SESSION_TYPES = {
  LECTURE: {
    id: 'lecture',
    label: 'Theoretical Lecture',
    badgeClass: 'session-pill-lecture',
    color: '#3B82F6',
  },
  PHANTOM_LAB: {
    id: 'phantom_lab',
    label: 'Phantom Simulation Lab',
    badgeClass: 'session-pill-phantom',
    color: '#0891B2',
  },
  CLINICAL_PRACTICE: {
    id: 'clinical_practice',
    label: 'Clinical Patient Practice',
    badgeClass: 'session-pill-clinical',
    color: '#10B981',
  },
  EXAM_VIVA: {
    id: 'exam_viva',
    label: 'Exam & Viva Session',
    badgeClass: 'session-pill-exam',
    color: '#EC4899',
  },
} as const;

export type SessionTypeId = keyof typeof SESSION_TYPES;

export const SESSION_STATUSES = {
  NORMAL: {
    id: 'normal',
    label: 'Scheduled',
    badgeClass: 'badge-normal',
  },
  CANCELLED: {
    id: 'cancelled',
    label: 'Cancelled',
    badgeClass: 'badge-cancelled',
  },
  CHAIR_CHANGED: {
    id: 'chair_changed',
    label: 'Chair / Room Changed',
    badgeClass: 'badge-chair-changed',
  },
  RESCHEDULED: {
    id: 'rescheduled',
    label: 'Rescheduled',
    badgeClass: 'badge-rescheduled',
  },
} as const;

export type SessionStatusId = keyof typeof SESSION_STATUSES;

export const ROTATION_DEPARTMENTS = [
  { id: 'operative', name: 'Operative Dentistry Clinic', icon: 'Sparkles' },
  { id: 'prostho', name: 'Prosthodontics Clinic', icon: 'Smile' },
  { id: 'perio', name: 'Periodontics & Hygiene Clinic', icon: 'Activity' },
  { id: 'endo', name: 'Endodontics Phantom Lab', icon: 'Zap' },
  { id: 'surgery', name: 'Oral & Maxillofacial Surgery', icon: 'Scissors' },
  { id: 'pedodontics', name: 'Pediatric Dentistry Clinic', icon: 'Heart' },
] as const;
