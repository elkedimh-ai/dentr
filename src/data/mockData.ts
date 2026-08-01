import { Group, Course } from '../types/schedule';

export const INITIAL_GROUPS: Group[] = [
  { id: 'g1', name: 'Computer Science - Year 2', subgroups: ['All', 'TP1', 'TP2', 'TD1'], color: '#06B6D4' },
  { id: 'g2', name: 'Software Engineering - Year 3', subgroups: ['All', 'Group A', 'Group B'], color: '#8B5CF6' },
  { id: 'g3', name: 'Data Science - Year 1', subgroups: ['All', 'Lab 1', 'Lab 2'], color: '#10B981' }
];

export const INITIAL_COURSES: Course[] = [
  // Group 1: Computer Science - Year 2
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
  },
  {
    id: 'c4',
    groupId: 'g1',
    subgroup: 'TP2',
    title: 'Web Development Workshop',
    code: 'CS205',
    professor: 'Dr. Elena Rostova',
    room: 'Online / Room 101',
    dayOfWeek: 2, // Wednesday
    startTime: '09:00',
    endTime: '11:00',
    status: 'online',
    statusNote: 'Live Interactive Session',
    onlineLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'c5',
    groupId: 'g1',
    subgroup: 'All',
    title: 'Linear Algebra & Discrete Math',
    code: 'CS203',
    professor: 'Prof. Robert Vance',
    room: 'Room C201',
    dayOfWeek: 3, // Thursday
    startTime: '11:00',
    endTime: '13:00',
    status: 'rescheduled',
    statusNote: 'Rescheduled from Tuesday 09:00'
  },

  // Group 2: Software Engineering - Year 3
  {
    id: 'c6',
    groupId: 'g2',
    subgroup: 'All',
    title: 'Microservices & Cloud Architecture',
    code: 'SE301',
    professor: 'Dr. Marcus Brody',
    room: 'Amphi C',
    dayOfWeek: 0, // Monday
    startTime: '14:00',
    endTime: '16:00',
    status: 'normal'
  },
  {
    id: 'c7',
    groupId: 'g2',
    subgroup: 'Group A',
    title: 'Software Testing & QA',
    code: 'SE302',
    professor: 'Prof. Grace Hopper',
    room: 'Online',
    dayOfWeek: 1, // Tuesday
    startTime: '10:00',
    endTime: '12:00',
    status: 'online',
    statusNote: 'Remote Q&A session',
    onlineLink: 'https://zoom.us/j/987654321'
  },
  {
    id: 'c8',
    groupId: 'g2',
    subgroup: 'Group B',
    title: 'DevOps & CI/CD Pipeline',
    code: 'SE303',
    professor: 'Eng. David Kim',
    room: 'Lab 308',
    dayOfWeek: 2, // Wednesday
    startTime: '13:30',
    endTime: '15:30',
    status: 'room_changed',
    statusNote: 'Moved to Server Room Lab 310'
  },
  {
    id: 'c9',
    groupId: 'g2',
    subgroup: 'All',
    title: 'Agile Methodologies',
    code: 'SE304',
    professor: 'Dr. Sarah Jenkins',
    room: 'Room B12',
    dayOfWeek: 3, // Thursday
    startTime: '15:00',
    endTime: '17:00',
    status: 'cancelled',
    statusNote: 'Guest speaker session postponed'
  },
  {
    id: 'c10',
    groupId: 'g2',
    subgroup: 'All',
    title: 'Capstone Project Workshop',
    code: 'SE399',
    professor: 'Prof. Alan Turing',
    room: 'Main Hall',
    dayOfWeek: 4, // Friday
    startTime: '09:00',
    endTime: '12:00',
    status: 'rescheduled',
    statusNote: 'Pushed back 1 hour from original 08:00 start'
  },

  // Group 3: Data Science - Year 1
  {
    id: 'c11',
    groupId: 'g3',
    subgroup: 'All',
    title: 'Introduction to Python & Data Analysis',
    code: 'DS101',
    professor: 'Dr. Michael Chen',
    room: 'Lab 101',
    dayOfWeek: 0, // Monday
    startTime: '11:00',
    endTime: '13:00',
    status: 'normal'
  },
  {
    id: 'c12',
    groupId: 'g3',
    subgroup: 'All',
    title: 'Probability & Statistics for AI',
    code: 'DS102',
    professor: 'Prof. Robert Vance',
    room: 'Amphi B1',
    dayOfWeek: 1, // Tuesday
    startTime: '08:30',
    endTime: '10:30',
    status: 'normal'
  },
  {
    id: 'c13',
    groupId: 'g3',
    subgroup: 'Lab 1',
    title: 'Machine Learning Fundamentals',
    code: 'DS103',
    professor: 'Dr. Elena Rostova',
    room: 'Lab 102',
    dayOfWeek: 2, // Wednesday
    startTime: '14:00',
    endTime: '16:00',
    status: 'online',
    statusNote: 'Kaggle Competition Walkthrough',
    onlineLink: 'https://teams.microsoft.com/l/meetup-join/ds103'
  }
];
