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
