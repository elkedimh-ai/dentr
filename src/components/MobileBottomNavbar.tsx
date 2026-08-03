import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Grid, Users, ShieldAlert } from 'lucide-react';
import { PresetTabId } from '../types/dentr';

interface MobileBottomNavbarProps {
  activeTab: PresetTabId;
  onTabChange: (tab: PresetTabId) => void;
  urgentAlertCount?: number;
}

export const MobileBottomNavbar: React.FC<MobileBottomNavbarProps> = ({
  activeTab,
  onTabChange,
  urgentAlertCount = 0,
}) => {
  const tabs = [
    { id: 'overview' as PresetTabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'daily' as PresetTabId, label: 'Daily', icon: Calendar },
    { id: 'weekly' as PresetTabId, label: 'Weekly', icon: Grid },
    { id: 'rotations' as PresetTabId, label: 'Rotations', icon: Users },
    { id: 'admin' as PresetTabId, label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-container" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="mobileActiveTopLine"
                    className="mobile-tab-top-line"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                    }}
                  />
                  <motion.div
                    layoutId="mobileActiveTabPill"
                    className="mobile-tab-active-bg"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                    }}
                  />
                </>
              )}

              <motion.div
                className="mobile-tab-icon-wrapper"
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 24,
                }}
              >
                <Icon className="w-5 h-5 mobile-tab-icon" />
                {tab.id === 'overview' && urgentAlertCount > 0 && (
                  <motion.span
                    className="mobile-tab-badge"
                    aria-label={`${urgentAlertCount} urgent schedule alert${urgentAlertCount > 1 ? 's' : ''}`}
                    title={`${urgentAlertCount} urgent schedule alert${urgentAlertCount > 1 ? 's' : ''}`}
                    animate={{ scale: [1, 1.18, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    {urgentAlertCount}
                  </motion.span>
                )}
              </motion.div>

              <motion.span
                className="mobile-tab-label"
                animate={{
                  scale: isActive ? 1.05 : 1,
                  fontWeight: isActive ? 700 : 500,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 28,
                }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
