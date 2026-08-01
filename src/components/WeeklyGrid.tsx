import React from 'react';
import { Course } from '../types/schedule';
import { MapPin, User, Clock } from 'lucide-react';

interface WeeklyGridProps {
  courses: Course[];
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({ courses }) => {
  // Show weekend columns if any course falls on Saturday (5) or Sunday (6)
  const hasWeekendCourses = courses.some(c => c.dayOfWeek >= 5);
  const displayDays = hasWeekendCourses ? ALL_DAYS : ALL_DAYS.slice(0, 5);

  return (
    <div className="weekly-grid-container">
      <div className={`grid-header cols-${displayDays.length}`}>
        {displayDays.map(d => (
          <div key={d} className="grid-day-col-title">{d}</div>
        ))}
      </div>
      <div className={`grid-body cols-${displayDays.length}`}>
        {displayDays.map((_, dayIdx) => {
          const colCourses = courses
            .filter(c => c.dayOfWeek === dayIdx)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={dayIdx} className="grid-day-col">
              {colCourses.length === 0 ? (
                <div className="grid-empty-col">No classes</div>
              ) : (
                colCourses.map(c => (
                  <div key={c.id} className={`grid-course-card status-${c.status} status-${c.status.replace('_', '-')}`}>
                    <div className="grid-card-top">
                      <span className="time tabular-nums">
                        <Clock className="w-3 h-3 inline mr-1 opacity-70" />
                        {c.startTime} - {c.endTime}
                      </span>
                      {c.subgroup && c.subgroup !== 'All' && (
                        <span className="grid-subgroup">{c.subgroup}</span>
                      )}
                    </div>
                    <span className="title">{c.title}</span>
                    <div className="grid-card-meta">
                      <span className="room">
                        <MapPin className="w-3 h-3 inline mr-1 text-cyan-400" />
                        {c.room}
                      </span>
                      {c.professor && (
                        <span className="professor">
                          <User className="w-3 h-3 inline mr-1 text-blue-400" />
                          {c.professor}
                        </span>
                      )}
                    </div>
                    {c.status !== 'normal' && (
                      <span className="status-tag">{c.status.replace('_', ' ')}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
