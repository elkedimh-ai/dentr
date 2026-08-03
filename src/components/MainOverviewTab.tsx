import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowRight, Shield, MapPin, User, Package, Clock } from 'lucide-react';
import { DentistrySession, UrgentAlert, StudentGroupId, PresetTabId, SessionStatusId } from '../types/dentr';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { SessionPill } from './ui/SessionPill';

interface MainOverviewTabProps {
  sessions: DentistrySession[];
  alerts: UrgentAlert[];
  selectedGroup: StudentGroupId;
  onNavigateTab: (tab: PresetTabId) => void;
}

const getStatusStyles = (status: SessionStatusId) => {
  switch (status) {
    case 'chair_changed':
    case 'rescheduled':
      return {
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid var(--status-rescheduled-border)',
        badgeStatus: status as SessionStatusId,
        badgeLabel: 'CHAIR REASSIGNED'
      };
    case 'cancelled':
      return {
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid var(--status-cancelled-border)',
        badgeStatus: 'cancelled' as SessionStatusId,
        badgeLabel: 'CANCELLED'
      };
    default:
      return {
        background: 'var(--bg-surface)',
        border: '1px solid var(--color-border)',
        badgeStatus: 'normal' as SessionStatusId,
        badgeLabel: 'LIVE NEXT UP'
      };
  }
};

export const MainOverviewTab: React.FC<MainOverviewTabProps> = ({
  sessions,
  alerts,
  selectedGroup,
  onNavigateTab,
}) => {
  void selectedGroup;
  const [countdown, setCountdown] = useState({ hours: '01', mins: '24', secs: '45' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const secs = String(59 - now.getSeconds()).padStart(2, '0');
      const mins = String(59 - now.getMinutes()).padStart(2, '0');
      setCountdown({ hours: '00', mins, secs });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextSession = sessions[0] || null;
  const statusStyles = nextSession ? getStatusStyles(nextSession.status) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 0' }}>
      {nextSession && statusStyles && (
        <Card style={{ padding: '1.75rem', background: statusStyles.background, border: statusStyles.border }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Badge status={statusStyles.badgeStatus} label={statusStyles.badgeLabel} />
                <SessionPill type={nextSession.type} />
                {nextSession.assignedGroup && (
                  <span style={{
                    background: 'var(--bg-surface-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase'
                  }}>
                    {nextSession.assignedGroup.replace('-', ' ')}
                  </span>
                )}
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                {nextSession.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  {nextSession.startTime} – {nextSession.endTime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  {nextSession.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User className="w-4 h-4" />
                  {nextSession.instructor}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STARTS IN</span>
              <div className="tabular-nums" style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--color-secondary)' }}>
                {countdown.hours}:{countdown.mins}:{countdown.secs}
              </div>
            </div>
          </div>

          {nextSession.originalLocation && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid var(--status-rescheduled-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: 'var(--text-sm)',
              color: 'var(--status-rescheduled-text)',
              fontWeight: 600
            }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Reassigned: Moved from {nextSession.originalLocation} → {nextSession.location}</span>
            </div>
          )}

          {nextSession.note && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: 'var(--bg-surface-secondary)',
              borderLeft: '4px solid var(--color-primary)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Note: </strong>
              {nextSession.note}
            </div>
          )}

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Package className="w-3.5 h-3.5" /> Required Kit:
            </span>
            {nextSession.equipmentChecklist.map((item, idx) => (
              <span key={idx} style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                {item}
              </span>
            ))}
          </div>
        </Card>
      )}

      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--status-cancelled-text)' }} /> Urgent Promotion Alerts
          </h3>
          {alerts.map((alert) => (
            <Card key={alert.id} style={{ border: '1px solid var(--status-cancelled-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--status-cancelled-text)' }}>{alert.title}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{alert.message}</p>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{alert.timestamp}</span>
            </Card>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <Card interactive onClick={() => onNavigateTab('daily')}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Daily Agenda <ArrowRight className="w-4 h-4" />
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>View today's live hour-by-hour session timeline & equipment checklists.</p>
        </Card>

        <Card interactive onClick={() => onNavigateTab('rotations')}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Clinical Rotations <ArrowRight className="w-4 h-4" />
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Check clinical chair allocations & supervisor prep notes for Groups A, B, C.</p>
        </Card>

        <Card interactive onClick={() => onNavigateTab('admin')}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Admin Portal <Shield className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1-click session cancellations, chair swaps, and alert broadcasts.</p>
        </Card>
      </div>
    </div>
  );
};

