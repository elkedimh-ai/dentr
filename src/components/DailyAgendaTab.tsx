import React from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import { DentistrySession, StudentGroupId } from '../types/dentr';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { SessionPill } from './ui/SessionPill';

interface DailyAgendaTabProps {
  sessions: DentistrySession[];
  selectedGroup: StudentGroupId;
}

export const DailyAgendaTab: React.FC<DailyAgendaTabProps> = ({ sessions, selectedGroup }) => {
  const filtered = sessions.filter(s => selectedGroup === 'all' || s.assignedGroup === 'all' || s.assignedGroup === selectedGroup);

  return (
    <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Daily Session Timeline
      </h3>
      {filtered.map((session) => (
        <Card key={session.id} style={{ borderLeft: `4px solid var(--session-${session.type === 'phantom_lab' ? 'phantom' : session.type})` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <SessionPill type={session.type} />
                <Badge status={session.status} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>{session.title}</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-secondary)' }}>
              <Clock className="w-4 h-4" /> {session.startTime} - {session.endTime}
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> {session.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User className="w-4 h-4" /> {session.instructor}
            </span>
          </div>

          {session.equipmentChecklist.length > 0 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Equipment:</span>
              {session.equipmentChecklist.map((eq, i) => (
                <span key={i} className="equipment-tag">{eq}</span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
