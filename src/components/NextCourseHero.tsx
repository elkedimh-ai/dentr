import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, AlertCircle, Video, Sparkles } from 'lucide-react';
import { Course, CourseStatus } from '../types/schedule';

interface NextCourseHeroProps {
  courses: Course[];
}

export const NextCourseHero: React.FC<NextCourseHeroProps> = ({ courses }) => {
  const [nextCourse, setNextCourse] = useState<Course | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isOngoing, setIsOngoing] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      if (!courses || courses.length === 0) {
        setNextCourse(null);
        setTimeRemaining('');
        setIsOngoing(false);
        return;
      }

      const now = new Date();
      const currentDay = (now.getDay() + 6) % 7; // Convert 0=Sun to 0=Mon format (0..6)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Filter non-cancelled courses if available, otherwise search all
      const activeCourses = courses.filter(c => c.status !== 'cancelled');
      const pool = activeCourses.length > 0 ? activeCourses : courses;

      const mapped = pool.map(c => {
        const [sh, sm] = c.startTime.split(':').map(Number);
        const [eh, em] = c.endTime.split(':').map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        let daysDiff = c.dayOfWeek - currentDay;
        let ongoing = false;

        if (daysDiff === 0 && currentMinutes >= startMin && currentMinutes < endMin) {
          ongoing = true;
        } else if (daysDiff < 0 || (daysDiff === 0 && currentMinutes >= endMin)) {
          daysDiff += 7; // Next week
        }

        return { course: c, startMin, daysDiff, ongoing };
      });

      const upcoming = mapped.sort((a, b) => {
        if (a.ongoing !== b.ongoing) return a.ongoing ? -1 : 1;
        if (a.daysDiff !== b.daysDiff) return a.daysDiff - b.daysDiff;
        return a.startMin - b.startMin;
      })[0];

      if (!upcoming) {
        setNextCourse(null);
        setTimeRemaining('');
        setIsOngoing(false);
        return;
      }

      setNextCourse(upcoming.course);
      setIsOngoing(upcoming.ongoing);

      if (upcoming.ongoing) {
        // Target is class end time
        const target = new Date();
        const [eh, em] = upcoming.course.endTime.split(':').map(Number);
        target.setHours(eh, em, 0, 0);

        const diffSec = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
        const hours = Math.floor(diffSec / 3600);
        const mins = Math.floor((diffSec % 3600) / 60);
        const secs = diffSec % 60;

        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      } else {
        // Target is class start time
        const target = new Date();
        target.setDate(target.getDate() + upcoming.daysDiff);
        const [sh, sm] = upcoming.course.startTime.split(':').map(Number);
        target.setHours(sh, sm, 0, 0);

        const diffSec = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
        const hours = Math.floor(diffSec / 3600);
        const mins = Math.floor((diffSec % 3600) / 60);
        const secs = diffSec % 60;

        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [courses]);

  const renderStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case 'cancelled':
        return <span className="status-badge badge-cancelled">CANCELLED</span>;
      case 'room_changed':
        return <span className="status-badge badge-room-changed">ROOM CHANGED</span>;
      case 'rescheduled':
        return <span className="status-badge badge-rescheduled">RESCHEDULED</span>;
      case 'online':
        return <span className="status-badge badge-online">ONLINE</span>;
      default:
        return <span className="status-badge badge-normal">SCHEDULED</span>;
    }
  };

  if (!nextCourse) {
    return (
      <div className="hero-card empty">
        <div className="hero-empty-content">
          <Sparkles className="w-8 h-8 text-cyan-400 opacity-60 mb-2" />
          <h3>No Upcoming Courses Scheduled</h3>
          <p>Enjoy your break! Check back later for your next class.</p>
        </div>
      </div>
    );
  }

  const statusClass = nextCourse.status.replace('_', '-');

  return (
    <div className="hero-card">
      <div className="hero-header">
        <div className="hero-label-group">
          <span className="hero-label-pulse" />
          <span className="hero-label">
            {isOngoing ? 'LIVE NOW • CLASS IN PROGRESS' : 'NEXT COURSE UP'}
          </span>
        </div>
        <div className="countdown-container">
          <span className="countdown-subtext">
            {isOngoing ? 'Ends in' : 'Starts in'}
          </span>
          <div className="countdown-timer tabular-nums">{timeRemaining}</div>
        </div>
      </div>

      <div className="hero-body">
        <div className="course-main-info">
          <div className="title-row">
            <h2 className="course-title">{nextCourse.title}</h2>
            {renderStatusBadge(nextCourse.status)}
          </div>
          <span className="course-code">{nextCourse.code}</span>
        </div>

        <div className="meta-grid">
          <div className="meta-item">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              Room: <strong className="room-highlight">{nextCourse.room}</strong>
            </span>
          </div>
          <div className="meta-item">
            <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{nextCourse.professor}</span>
          </div>
          <div className="meta-item">
            <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {nextCourse.startTime} - {nextCourse.endTime}
            </span>
          </div>
        </div>

        {nextCourse.statusNote && (
          <div className={`status-banner status-${statusClass}`}>
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{nextCourse.statusNote}</span>
          </div>
        )}

        {nextCourse.onlineLink && (
          <a
            href={nextCourse.onlineLink}
            target="_blank"
            rel="noreferrer"
            className="online-link-btn"
          >
            <Video className="w-4 h-4 mr-2" />
            Join Live Lecture Room
          </a>
        )}
      </div>
    </div>
  );
};
