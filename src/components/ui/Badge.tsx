import React from 'react';
import { SessionStatusId } from '../../types/dentr';

export const Badge: React.FC<{ status: SessionStatusId; label?: string }> = ({ status, label }) => {
  const map: Record<SessionStatusId, { class: string; text: string }> = {
    normal: { class: 'badge-normal', text: 'Scheduled' },
    cancelled: { class: 'badge-cancelled', text: 'Cancelled' },
    chair_changed: { class: 'badge-chair-changed', text: 'Chair Swap' },
    rescheduled: { class: 'badge-rescheduled', text: 'Rescheduled' },
  };
  const item = map[status] || map.normal;
  return <span className={`badge ${item.class}`}>{label || item.text}</span>;
};
