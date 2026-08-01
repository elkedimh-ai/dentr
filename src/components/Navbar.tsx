import React from 'react';
import { Calendar, RefreshCw, Lock, Search } from 'lucide-react';
import { Group, ScheduleFilter } from '../types/schedule';

interface NavbarProps {
  groups: Group[];
  filter: ScheduleFilter;
  onFilterChange: (newFilter: ScheduleFilter) => void;
  onRefresh: () => void;
  onOpenAdmin: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  groups,
  filter,
  onFilterChange,
  onRefresh,
  onOpenAdmin,
  isLoading
}) => {
  const currentGroup = groups.find(g => g.id === filter.groupId) || groups[0];

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="logo-badge">
          <Calendar className="w-5 h-5 text-cyan-400" />
        </div>
        <span className="brand-title">ClassSchedule</span>
      </div>

      <div className="navbar-controls">
        {/* Group Selector */}
        <select
          value={filter.groupId}
          onChange={e => onFilterChange({ ...filter, groupId: e.target.value, subgroup: 'All' })}
          className="select-input group-select"
        >
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Subgroup Selector */}
        {currentGroup && currentGroup.subgroups.length > 1 && (
          <select
            value={filter.subgroup}
            onChange={e => onFilterChange({ ...filter, subgroup: e.target.value })}
            className="select-input subgroup-select"
          >
            {currentGroup.subgroups.map(sg => (
              <option key={sg} value={sg}>{sg}</option>
            ))}
          </select>
        )}

        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search course, professor, room..."
            value={filter.searchQuery}
            onChange={e => onFilterChange({ ...filter, searchQuery: e.target.value })}
            className="search-input"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="icon-button"
          title="Refresh schedule data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'spin' : ''}`} />
        </button>

        {/* Admin Login Button */}
        <button onClick={onOpenAdmin} className="admin-button">
          <Lock className="w-4 h-4 mr-1.5" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
