import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { DentistrySession, SessionStatusId } from '../types/dentr';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';

interface AdminManagementTabProps {
  isAdminAuth: boolean;
  onAuthenticate: (pin: string) => boolean;
  sessions: DentistrySession[];
  onToggleStatus: (sessionId: string, newStatus: SessionStatusId) => void;
}

export const AdminManagementTab: React.FC<AdminManagementTabProps> = ({
  isAdminAuth,
  onAuthenticate,
  sessions,
  onToggleStatus,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAuthenticate(pin)) {
      setError('');
    } else {
      setError('Invalid 4-Digit PIN. Try 1234.');
    }
  };

  if (!isAdminAuth) {
    return (
      <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'rgba(8, 145, 178, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Lock className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Admin PIN Verification</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enter class representative PIN to manage schedules & alerts.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              error={error}
              style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.25rem' }}
            />
            <Button type="submit" variant="primary" style={{ width: '100%' }}>
              Unlock Admin Portal
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Unlock className="w-5 h-5" style={{ color: '#10B981' }} /> Class Rep Admin Management
        </h3>
        <Badge status="normal" label="AUTHENTICATED" />
      </div>

      <Card style={{ padding: '1.25rem' }}>
        <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Quick Session Status Controller</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sessions.map((s) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({s.location})</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Button size="sm" variant={s.status === 'normal' ? 'primary' : 'secondary'} onClick={() => onToggleStatus(s.id, 'normal')}>Scheduled</Button>
                <Button size="sm" variant={s.status === 'cancelled' ? 'danger' : 'secondary'} onClick={() => onToggleStatus(s.id, 'cancelled')}>Cancel</Button>
                <Button size="sm" variant={s.status === 'chair_changed' ? 'outline' : 'secondary'} onClick={() => onToggleStatus(s.id, 'chair_changed')}>Chair Swap</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
