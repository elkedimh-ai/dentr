import React from 'react';
import { Activity } from 'lucide-react';
import { mockRotationAssignments } from '../data/mockDentistryData';
import { Card } from './ui/Card';

export const RotationGroupsTab: React.FC = () => {
  return (
    <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Clinical Department Rotations & Chair Allocations
      </h3>
      {mockRotationAssignments.map((rot) => (
        <Card key={rot.departmentId} style={{ padding: '1.25rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity className="w-5 h-5" /> {rot.departmentName}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--status-normal-text)' }}>Group A</h5>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{rot.groupA.chairRange}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Supervisor: {rot.groupA.supervisor}</p>
            </div>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-secondary)' }}>Group B</h5>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{rot.groupB.chairRange}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Supervisor: {rot.groupB.supervisor}</p>
            </div>
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <h5 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--status-chair-changed-text)' }}>Group C</h5>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{rot.groupC.chairRange}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Supervisor: {rot.groupC.supervisor}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
