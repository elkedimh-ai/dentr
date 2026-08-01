import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Grid, Layers } from 'lucide-react';
import { Group, Course, ScheduleFilter } from './types/schedule';
import { fetchGroups, fetchSchedule, saveCourse, deleteCourse } from './services/api';

import { Navbar } from './components/Navbar';
import { NextCourseHero } from './components/NextCourseHero';
import { DailyAgenda } from './components/DailyAgenda';
import { WeeklyGrid } from './components/WeeklyGrid';
import { AdminModal } from './components/AdminModal';

export const App: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filter, setFilter] = useState<ScheduleFilter>({
    groupId: '',
    subgroup: 'All',
    searchQuery: ''
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const today = new Date().getDay();
    // Convert 0=Sunday..6=Saturday to 0=Monday..6=Sunday
    return (today + 6) % 7;
  });
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial groups
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const loadedGroups = await fetchGroups();
        setGroups(loadedGroups);
        if (loadedGroups.length > 0) {
          setFilter(prev => ({
            ...prev,
            groupId: loadedGroups[0].id,
            subgroup: loadedGroups[0].subgroups[0] || 'All'
          }));
        }
      } catch (err) {
        console.error('Failed to load groups:', err);
      }
    };
    loadGroups();
  }, []);

  // Load schedule whenever group or subgroup changes
  const loadSchedule = useCallback(async (groupId: string, subgroup: string) => {
    if (!groupId) return;
    setIsLoading(true);
    try {
      const data = await fetchSchedule(groupId, subgroup);
      setCourses(data);
    } catch (err) {
      console.error('Failed to load schedule:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filter.groupId) {
      loadSchedule(filter.groupId, filter.subgroup);
    }
  }, [filter.groupId, filter.subgroup, loadSchedule]);

  const handleRefresh = useCallback(() => {
    if (filter.groupId) {
      loadSchedule(filter.groupId, filter.subgroup);
    }
  }, [filter.groupId, filter.subgroup, loadSchedule]);

  const handleSaveCourse = useCallback(async (courseToSave: Course) => {
    await saveCourse(courseToSave);
    if (filter.groupId) {
      await loadSchedule(filter.groupId, filter.subgroup);
    }
  }, [filter.groupId, filter.subgroup, loadSchedule]);

  const handleDeleteCourse = useCallback(async (courseId: string) => {
    await deleteCourse(courseId);
    if (filter.groupId) {
      await loadSchedule(filter.groupId, filter.subgroup);
    }
  }, [filter.groupId, filter.subgroup, loadSchedule]);

  // Filter courses by search query
  const filteredCourses = useMemo(() => {
    if (!filter.searchQuery.trim()) return courses;
    const query = filter.searchQuery.toLowerCase().trim();
    return courses.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.professor.toLowerCase().includes(query) ||
      c.room.toLowerCase().includes(query)
    );
  }, [courses, filter.searchQuery]);

  const activeGroup = groups.find(g => g.id === filter.groupId);

  return (
    <div className="app-wrapper">
      <Navbar
        groups={groups}
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={handleRefresh}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isLoading={isLoading}
      />

      <main className="main-content">
        <NextCourseHero courses={courses} />

        <div className="view-header">
          <div className="view-title-group">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="view-title">
              {activeGroup ? `${activeGroup.name} Schedule` : 'Class Schedule'}
            </h2>
            {filter.searchQuery && (
              <span className="badge-subgroup" style={{ marginLeft: '0.5rem' }}>
                Filtered: "{filter.searchQuery}"
              </span>
            )}
          </div>

          <div className="view-switcher">
            <button
              className={`view-switch-btn ${viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => setViewMode('daily')}
              title="Switch to Daily Agenda View"
            >
              <Calendar className="w-4 h-4" />
              <span>Daily Agenda</span>
            </button>
            <button
              className={`view-switch-btn ${viewMode === 'weekly' ? 'active' : ''}`}
              onClick={() => setViewMode('weekly')}
              title="Switch to Weekly Timetable Grid"
            >
              <Grid className="w-4 h-4" />
              <span>Weekly Grid</span>
            </button>
          </div>
        </div>

        {viewMode === 'daily' ? (
          <DailyAgenda
            courses={filteredCourses}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
        ) : (
          <WeeklyGrid courses={filteredCourses} />
        )}
      </main>

      <footer className="app-footer">
        <div className="app-footer-content">
          <span>© 2026 ClassSchedule Platform • Real-time Academic Timetables</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <span className="hero-label-pulse" />
            <span>
              Group: <strong>{activeGroup?.name || 'Loading...'}</strong> ({filter.subgroup})
            </span>
          </div>
        </div>
      </footer>

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        courses={courses}
        groups={groups}
        onSaveCourse={handleSaveCourse}
        onDeleteCourse={handleDeleteCourse}
      />
    </div>
  );
};

export default App;

