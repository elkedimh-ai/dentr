export type PresetTabId = 'overview' | 'daily' | 'weekly' | 'rotations' | 'admin';

export type StudentGroupId = 'all' | 'group-a' | 'group-b' | 'group-c';

export type SessionTypeId = 'lecture' | 'phantom_lab' | 'clinical_practice' | 'exam_viva';
export type SessionType = SessionTypeId;

export type SessionStatusId = 'normal' | 'cancelled' | 'chair_changed' | 'rescheduled';
export type SessionStatus = SessionStatusId;

export type RotationGroup = 'group-a' | 'group-b' | 'group-c';

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

export interface AdminSessionState {
  sessions: DentistrySession[];
  alerts: UrgentAlert[];
}
