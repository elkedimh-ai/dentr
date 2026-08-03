import React from 'react';
import { motion } from 'framer-motion';
import { PresetTabId } from '../types/dentr';

interface PresetTabBarProps {
  activeTab: PresetTabId;
  onTabChange: (tab: PresetTabId) => void;
  urgentAlertCount?: number;
}

export const PresetTabBar: React.FC<PresetTabBarProps> = ({
  activeTab,
  onTabChange,
  urgentAlertCount = 0,
}) => {
  const tabs: { id: PresetTabId; label: string }[] = [
    { id: 'overview', label: 'Main Overview' },
    { id: 'daily', label: 'Daily Agenda' },
    { id: 'weekly', label: 'Weekly Matrix' },
    { id: 'rotations', label: 'Rotation Groups' },
    { id: 'admin', label: 'Admin Portal' },
  ];

  return (
    <nav className="preset-tab-nav" role="tablist" aria-label="Desktop Preset Navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`preset-tab-btn ${isActive ? 'active' : ''}`}
            role="tab"
            aria-selected={isActive}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="preset-tab-active-bg"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            <span style={{ position: 'relative', zIndex: 3 }}>{tab.label}</span>

            {tab.id === 'overview' && urgentAlertCount > 0 && (
              <span
                aria-label={`${urgentAlertCount} urgent schedule alert${urgentAlertCount > 1 ? 's' : ''}`}
                title={`${urgentAlertCount} urgent schedule alert${urgentAlertCount > 1 ? 's' : ''}`}
                style={{
                  position: 'relative',
                  zIndex: 3,
                  background: 'var(--status-cancelled-bg)',
                  color: 'var(--status-cancelled-text)',
                  border: '1px solid var(--status-cancelled-border)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.1rem 0.45rem',
                  marginLeft: '0.35rem',
                }}
              >
                {urgentAlertCount}
              </span>
            )}

            {isActive && (
              <motion.div
                layoutId="activeTabLine"
                className="preset-tab-light-bar"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};


