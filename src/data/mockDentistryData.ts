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
