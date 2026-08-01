import React, { useState } from 'react';
import { X, Lock, Plus, Trash2, Edit, Check, AlertCircle } from 'lucide-react';
import { Course, Group, CourseStatus } from '../types/schedule';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  groups: Group[];
  onSaveCourse: (course: Course) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  courses,
  groups,
  onSaveCourse,
  onDeleteCourse
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPin = import.meta.env.VITE_ADMIN_PIN || '1234';
    if (pin === '1234' || pin === adminPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleClose = () => {
    setEditingCourse(null);
    setIsAddingNew(false);
    onClose();
  };

  const handleQuickStatusChange = async (course: Course, newStatus: CourseStatus, note?: string) => {
    await onSaveCourse({
      ...course,
      status: newStatus,
      statusNote: note !== undefined ? note : course.statusNote
    });
  };

  const handleStartAdd = () => {
    const defaultGroup = groups[0]?.id || '';
    const defaultSubgroup = groups[0]?.subgroups[0] || 'All';
    setEditingCourse({
      id: `c-${Date.now()}`,
      title: '',
      code: '',
      groupId: defaultGroup,
      subgroup: defaultSubgroup,
      professor: '',
      room: '',
      dayOfWeek: 0,
      startTime: '08:30',
      endTime: '10:00',
      status: 'normal',
      statusNote: '',
      onlineLink: ''
    });
    setIsAddingNew(true);
  };

  const handleStartEdit = (course: Course) => {
    setEditingCourse({ ...course });
    setIsAddingNew(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title || !editingCourse.groupId) return;

    const courseToSave: Course = {
      id: editingCourse.id || `c-${Date.now()}`,
      groupId: editingCourse.groupId || groups[0]?.id || '',
      subgroup: editingCourse.subgroup || 'All',
      title: editingCourse.title || '',
      code: editingCourse.code || '',
      professor: editingCourse.professor || '',
      room: editingCourse.room || '',
      dayOfWeek: editingCourse.dayOfWeek ?? 0,
      startTime: editingCourse.startTime || '08:30',
      endTime: editingCourse.endTime || '10:00',
      status: editingCourse.status || 'normal',
      statusNote: editingCourse.statusNote || undefined,
      onlineLink: editingCourse.onlineLink || undefined
    };

    await onSaveCourse(courseToSave);
    setEditingCourse(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete course "${title}"?`)) {
      await onDeleteCourse(id);
    }
  };

  const selectedGroupObj = groups.find(g => g.id === editingCourse?.groupId);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h3>Admin Control Center</h3>
          </div>
          <button onClick={handleClose} className="close-btn" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="pin-form">
            <div className="pin-icon-wrapper">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            <h4>Security Verification</h4>
            <p>Enter Admin Security PIN (Default: 1234)</p>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="PIN Code"
              className="pin-input"
              autoFocus
            />
            {pinError && (
              <div className="error-text">
                <AlertCircle className="w-4 h-4 mr-1.5 inline" />
                Incorrect PIN Code
              </div>
            )}
            <button type="submit" className="submit-btn">Unlock Admin Tools</button>
          </form>
        ) : (
          <div className="admin-body">
            <div className="admin-actions">
              <div>
                <h4>Manage Class Schedules</h4>
                <p className="admin-subtitle">Quick status updates, edit course info, or create new entries</p>
              </div>
              {!editingCourse && (
                <button onClick={handleStartAdd} className="add-course-btn">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Course
                </button>
              )}
            </div>

            {editingCourse ? (
              <form onSubmit={handleFormSubmit} className="admin-form">
                <div className="form-header">
                  <h5>{isAddingNew ? 'Create New Course' : 'Edit Course'}</h5>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Course Title *</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.title || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      placeholder="e.g. Database Systems"
                    />
                  </div>

                  <div className="form-group">
                    <label>Course Code</label>
                    <input
                      type="text"
                      value={editingCourse.code || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, code: e.target.value })}
                      placeholder="e.g. CS-301"
                    />
                  </div>

                  <div className="form-group">
                    <label>Group *</label>
                    <select
                      value={editingCourse.groupId || ''}
                      onChange={e => {
                        const newGrpId = e.target.value;
                        const newGrp = groups.find(g => g.id === newGrpId);
                        setEditingCourse({
                          ...editingCourse,
                          groupId: newGrpId,
                          subgroup: newGrp?.subgroups[0] || 'All'
                        });
                      }}
                    >
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Subgroup</label>
                    <select
                      value={editingCourse.subgroup || 'All'}
                      onChange={e => setEditingCourse({ ...editingCourse, subgroup: e.target.value })}
                    >
                      {selectedGroupObj ? (
                        selectedGroupObj.subgroups.map(sg => (
                          <option key={sg} value={sg}>{sg}</option>
                        ))
                      ) : (
                        <option value="All">All</option>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Professor</label>
                    <input
                      type="text"
                      value={editingCourse.professor || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, professor: e.target.value })}
                      placeholder="e.g. Dr. Alan Turing"
                    />
                  </div>

                  <div className="form-group">
                    <label>Room</label>
                    <input
                      type="text"
                      value={editingCourse.room || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, room: e.target.value })}
                      placeholder="e.g. Lab 102"
                    />
                  </div>

                  <div className="form-group">
                    <label>Day of Week</label>
                    <select
                      value={editingCourse.dayOfWeek ?? 0}
                      onChange={e => setEditingCourse({ ...editingCourse, dayOfWeek: parseInt(e.target.value, 10) })}
                    >
                      {DAYS_OF_WEEK.map((day, idx) => (
                        <option key={day} value={idx}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={editingCourse.startTime || '08:30'}
                        onChange={e => setEditingCourse({ ...editingCourse, startTime: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={editingCourse.endTime || '10:00'}
                        onChange={e => setEditingCourse({ ...editingCourse, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editingCourse.status || 'normal'}
                      onChange={e => setEditingCourse({ ...editingCourse, status: e.target.value as CourseStatus })}
                    >
                      <option value="normal">Normal</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="room_changed">Room Changed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status Note</label>
                    <input
                      type="text"
                      value={editingCourse.statusNote || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, statusNote: e.target.value })}
                      placeholder="e.g. Room moved to Amphitheater B"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Online Link (Optional)</label>
                    <input
                      type="url"
                      value={editingCourse.onlineLink || ''}
                      onChange={e => setEditingCourse({ ...editingCourse, onlineLink: e.target.value })}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setEditingCourse(null)} className="cancel-form-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-form-btn">
                    <Check className="w-4 h-4 mr-1.5" />
                    Save Course
                  </button>
                </div>
              </form>
            ) : (
              <div className="course-admin-list">
                {courses.length === 0 ? (
                  <div className="no-courses">No courses currently configured.</div>
                ) : (
                  courses.map(course => (
                    <div key={course.id} className="admin-course-row">
                      <div className="row-info">
                        <div className="row-title-bar">
                          <strong>{course.title}</strong>
                          {course.code && <span className="course-code-pill">{course.code}</span>}
                          <span className="subgroup-pill">{course.subgroup}</span>
                        </div>
                        <div className="row-subinfo">
                          <span>{DAYS_OF_WEEK[course.dayOfWeek]} {course.startTime}-{course.endTime}</span>
                          <span className="dot-divider">•</span>
                          <span>Room: <strong>{course.room}</strong></span>
                          <span className="dot-divider">•</span>
                          <span>{course.professor}</span>
                        </div>
                        {course.statusNote && (
                          <div className="row-note-text">
                            Note: {course.statusNote}
                          </div>
                        )}
                      </div>

                      <div className="row-controls">
                        <div className="quick-status-buttons">
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(course, 'normal', '')}
                            className={`status-btn normal ${course.status === 'normal' ? 'active' : ''}`}
                            title="Set status to Normal"
                          >
                            Normal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const note = prompt('Enter cancellation note:', course.statusNote || 'Class cancelled today');
                              if (note !== null) handleQuickStatusChange(course, 'cancelled', note);
                            }}
                            className={`status-btn cancel ${course.status === 'cancelled' ? 'active' : ''}`}
                            title="Cancel class with note"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newRoom = prompt('Enter new room number:', course.room);
                              if (newRoom) handleQuickStatusChange(course, 'room_changed', `Moved to ${newRoom}`);
                            }}
                            className={`status-btn room ${course.status === 'room_changed' ? 'active' : ''}`}
                            title="Change room number"
                          >
                            Room Change
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const note = prompt('Enter rescheduled note:', course.statusNote || 'Rescheduled to another time slot');
                              if (note !== null) handleQuickStatusChange(course, 'rescheduled', note);
                            }}
                            className={`status-btn reschedule ${course.status === 'rescheduled' ? 'active' : ''}`}
                            title="Reschedule class"
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const note = prompt('Enter online meeting note or link:', course.onlineLink || course.statusNote || 'Online session via Teams');
                              if (note !== null) handleQuickStatusChange(course, 'online', note);
                            }}
                            className={`status-btn online ${course.status === 'online' ? 'active' : ''}`}
                            title="Set to Online mode"
                          >
                            Online
                          </button>
                        </div>

                        <div className="action-buttons-group">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(course)}
                            className="edit-btn"
                            title="Edit full course details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(course.id, course.title)}
                            className="delete-btn"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
