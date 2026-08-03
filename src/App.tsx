import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { MobileBottomNavbar } from './components/MobileBottomNavbar';
import { MainOverviewTab } from './components/MainOverviewTab';
import { DailyAgendaTab } from './components/DailyAgendaTab';
import { WeeklyMatrixTab } from './components/WeeklyMatrixTab';
import { RotationGroupsTab } from './components/RotationGroupsTab';
import { AdminManagementTab } from './components/AdminManagementTab';
import { dentrStorage } from './services/dentrStorage';
import { mockDentistrySessions, mockUrgentAlerts } from './data/mockDentistryData';
import { PresetTabId, StudentGroupId, DentistrySession } from './types/dentr';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PresetTabId>(() => dentrStorage.getActiveTab());
  const [selectedGroup] = useState<StudentGroupId>(() => dentrStorage.getSelectedGroup());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => dentrStorage.getTheme());
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => dentrStorage.isAdminAuthenticated());
  const [sessions, setSessions] = useState<DentistrySession[]>(mockDentistrySessions);

  useEffect(() => {
    dentrStorage.setTheme(theme);
  }, [theme]);

  const handleTabChange = (t: PresetTabId) => {
    setActiveTab(t);
    dentrStorage.setActiveTab(t);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAuthenticateAdmin = (pin: string): boolean => {
    if (pin === '1234') {
      setIsAdminAuth(true);
      dentrStorage.setAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleToggleSessionStatus = (sessionId: string, newStatus: any) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <TopNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        urgentAlertCount={mockUrgentAlerts.length}
      />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.5rem 3rem' }}>
        {activeTab === 'overview' && (
          <MainOverviewTab
            sessions={sessions}
            alerts={mockUrgentAlerts}
            selectedGroup={selectedGroup}
            onNavigateTab={handleTabChange}
          />
        )}
        {activeTab === 'daily' && (
          <DailyAgendaTab sessions={sessions} selectedGroup={selectedGroup} />
        )}
        {activeTab === 'weekly' && (
          <WeeklyMatrixTab sessions={sessions} selectedGroup={selectedGroup} />
        )}
        {activeTab === 'rotations' && (
          <RotationGroupsTab />
        )}
        {activeTab === 'admin' && (
          <AdminManagementTab
            isAdminAuth={isAdminAuth}
            onAuthenticate={handleAuthenticateAdmin}
            sessions={sessions}
            onToggleStatus={handleToggleSessionStatus}
          />
        )}
      </main>
      <MobileBottomNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        urgentAlertCount={mockUrgentAlerts.length}
      />
    </div>
  );
};

export default App;
