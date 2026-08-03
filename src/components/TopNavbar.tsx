import React from 'react';
import { Activity, Sun, Moon } from 'lucide-react';
import { PresetTabId } from '../types/dentr';
import { PresetTabBar } from './PresetTabBar';

interface TopNavbarProps {
  activeTab: PresetTabId;
  onTabChange: (tab: PresetTabId) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  urgentAlertCount?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  urgentAlertCount = 0,
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="logo-badge" style={{ background: 'rgba(8, 145, 178, 0.15)', borderColor: 'var(--color-primary)' }}>
          <Activity className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
        </div>
        <div>
          <h1 className="brand-title">
            Dentr
          </h1>
          <p className="brand-subtitle">Dentistry Promotion Hub</p>
        </div>
      </div>

      <div className="navbar-desktop-tabs">
        <PresetTabBar
          activeTab={activeTab}
          onTabChange={onTabChange}
          urgentAlertCount={urgentAlertCount}
        />
      </div>

      <div className="navbar-actions">
        <button
          onClick={onToggleTheme}
          title="Toggle Dark / Light Medical Theme"
          aria-label={theme === 'dark' ? 'Switch to Daylight Light Mode' : 'Switch to OLED Dark Mode'}
          className="theme-toggle-btn"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: 'var(--status-chair-changed-text)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />}
        </button>
      </div>
    </header>
  );
};

