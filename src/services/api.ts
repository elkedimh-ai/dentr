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
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_COURSES;
  }
  const local = localStorage.getItem('class_schedule_courses');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Failed to parse stored courses from localStorage', e);
    }
  }
  localStorage.setItem('class_schedule_courses', JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
}

function getStoredGroups(): Group[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_GROUPS;
  }
  const local = localStorage.getItem('class_schedule_groups');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error('Failed to parse stored groups from localStorage', e);
    }
  }
  localStorage.setItem('class_schedule_groups', JSON.stringify(INITIAL_GROUPS));
  return INITIAL_GROUPS;
}

export function clearClientCache(): void {
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
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('class_schedule_courses', JSON.stringify(courses));
  }
  clearClientCache(); // Invalidate frontend memory cache on edit
}

export async function saveCourse(course: Course): Promise<void> {
  return updateCourse(course);
}

export async function updateCourseStatus(id: string, status: CourseStatus, statusNote?: string): Promise<void> {
  const courses = getStoredCourses();
  const idx = courses.findIndex(c => c.id === id);
  if (idx !== -1) {
    courses[idx] = { ...courses[idx], status, statusNote };
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('class_schedule_courses', JSON.stringify(courses));
    }
    clearClientCache();
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  const courses = getStoredCourses().filter(c => c.id !== courseId);
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('class_schedule_courses', JSON.stringify(courses));
  }
  clearClientCache();
}
