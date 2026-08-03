import React from 'react';
import { DentistrySession, StudentGroupId } from '../types/dentr';
import { Card } from './ui/Card';
import { SessionPill } from './ui/SessionPill';

interface WeeklyMatrixTabProps {
  sessions: DentistrySession[];
  selectedGroup: StudentGroupId;
}

export const WeeklyMatrixTab: React.FC<WeeklyMatrixTabProps> = ({ sessions, selectedGroup }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
        Weekly Timetable Matrix
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {days.map((day) => {
          const daySessions = sessions.filter(s => s.day === day && (selectedGroup === 'all' || s.assignedGroup === 'all' || s.assignedGroup === selectedGroup));
          return (
            <Card key={day} style={{ padding: '1rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                {day}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {daySessions.length === 0 ? (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>No sessions scheduled</p>
                ) : (
                  daySessions.map(s => (
                    <div key={s.id} style={{ background: 'var(--bg-surface-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <SessionPill type={s.type} />
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)' }}>{s.startTime}</span>
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{s.location}</div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
