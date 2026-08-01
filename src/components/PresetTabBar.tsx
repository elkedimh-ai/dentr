import React from 'react';
import { LayoutDashboard, Calendar, Grid, Users, ShieldAlert } from 'lucide-react';
import { PresetTabId } from '../types/dentr';

interface PresetTabBarProps {
  activeTab: PresetTabId;
  onTabChange: (tab: PresetTabId) => void;
  urgentAlertCount: number;
}

export const PresetTabBar: React.FC<PresetTabBarProps> = ({
  activeTab,
  onTabChange,
  urgentAlertCount,
}) => {
  const tabs = [
    { id: 'overview' as PresetTabId, label: 'Main Overview', icon: LayoutDashboard },
    { id: 'daily' as PresetTabId, label: 'Daily Agenda', icon: Calendar },
    { id: 'weekly' as PresetTabId, label: 'Weekly Matrix', icon: Grid },
    { id: 'rotations' as PresetTabId, label: 'Rotation Groups', icon: Users },
    { id: 'admin' as PresetTabId, label: 'Admin Portal', icon: ShieldAlert },
  ];

  return (
    <nav style={{ padding: '0.75rem 1.5rem 0', background: 'var(--bg-app)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-heading)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                background: isActive ? 'rgba(8, 145, 178, 0.15)' : 'transparent',
                color: isActive ? 'var(--color-secondary)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 200ms ease',
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'overview' && urgentAlertCount > 0 && (
                <span
                  style={{
                    background: '#EF4444',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    padding: '0.1rem 0.45rem',
                    marginLeft: '0.25rem',
                  }}
                >
                  {urgentAlertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
