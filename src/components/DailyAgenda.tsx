import React from 'react';
import { Course } from '../types/schedule';
import { MapPin, User, Clock, AlertTriangle } from 'lucide-react';

interface DailyAgendaProps {
  courses: Course[];
  selectedDay: number; // 0 = Mon, 6 = Sun
  onDaySelect: (day: number) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DailyAgenda: React.FC<DailyAgendaProps> = ({ courses, selectedDay, onDaySelect }) => {
  const dayCourses = courses
    .filter(c => c.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="daily-agenda-container">
      {/* Day Selector Tabs */}
      <div className="day-tabs">
        {DAYS.map((day, idx) => (
          <button
            key={day}
            onClick={() => onDaySelect(idx)}
            className={`day-tab ${selectedDay === idx ? 'active' : ''}`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Agenda Timeline */}
      <div className="agenda-timeline">
        {dayCourses.length === 0 ? (
          <div className="empty-day-state">No courses scheduled for {DAYS[selectedDay]}.</div>
        ) : (
          dayCourses.map(course => (
            <div key={course.id} className={`agenda-card status-${course.status} status-${course.status.replace('_', '-')}`}>
              <div className="time-pill">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{course.startTime} - {course.endTime}</span>
              </div>
              
              <div className="agenda-details">
                <div className="agenda-header">
                  <h4>{course.title}</h4>
                  <span className="badge-subgroup">{course.subgroup}</span>
                </div>
                <div className="agenda-meta">
                  <span><MapPin className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />{course.room}</span>
                  <span><User className="w-3.5 h-3.5 inline mr-1 ml-3 text-blue-400" />{course.professor}</span>
                </div>
                {course.statusNote && (
                  <div className="agenda-note">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400 inline flex-shrink-0" />
                    <span>{course.statusNote}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
