import React from 'react';
import { Activity, Sun, Moon, Shield, ShieldCheck, ChevronDown } from 'lucide-react';
import { StudentGroupId } from '../types/dentr';

interface TopNavbarProps {
  selectedGroup: StudentGroupId;
  onSelectGroup: (group: StudentGroupId) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isAdminAuth: boolean;
  alertCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  selectedGroup,
  onSelectGroup,
  theme,
  onToggleTheme,
  isAdminAuth,
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="logo-badge" style={{ background: 'rgba(8, 145, 178, 0.15)', borderColor: 'var(--color-primary)' }}>
          <Activity className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
        </div>
        <div>
          <h1 className="brand-title" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Dentr
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dentistry Promotion Hub</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            value={selectedGroup}
            onChange={(e) => onSelectGroup(e.target.value as StudentGroupId)}
            style={{
              appearance: 'none',
              padding: '0.45rem 2rem 0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Promotion Groups</option>
            <option value="group-a">Group A (Dental Surgery)</option>
            <option value="group-b">Group B (Prosthodontics)</option>
            <option value="group-c">Group C (Orthodontics)</option>
          </select>
          <ChevronDown className="w-4 h-4" style={{ position: 'absolute', right: '0.65rem', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
        </div>

        <button
          onClick={onToggleTheme}
          title="Toggle Dark / Light Medical Theme"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--color-border)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: '#FBBF24' }} /> : <Moon className="w-4 h-4" style={{ color: '#0284C7' }} />}
        </button>

        <div
          title={isAdminAuth ? 'Admin Authenticated' : 'Admin PIN Locked'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: isAdminAuth ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-secondary)',
            border: `1px solid ${isAdminAuth ? 'rgba(16, 185, 129, 0.3)' : 'var(--color-border)'}`,
            color: isAdminAuth ? '#34D399' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {isAdminAuth ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          <span>{isAdminAuth ? 'Admin Unlocked' : 'PIN Locked'}</span>
        </div>
      </div>
    </header>
  );
};
