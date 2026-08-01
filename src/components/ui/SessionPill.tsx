import React from 'react';
import { SessionTypeId } from '../../types/dentr';

export const SessionPill: React.FC<{ type: SessionTypeId }> = ({ type }) => {
  const map: Record<SessionTypeId, { class: string; text: string }> = {
    lecture: { class: 'session-pill-lecture', text: 'LECTURE' },
    phantom_lab: { class: 'session-pill-phantom', text: 'PHANTOM LAB' },
    clinical_practice: { class: 'session-pill-clinical', text: 'CLINICAL' },
    exam_viva: { class: 'session-pill-exam', text: 'EXAM / VIVA' },
  };
  const item = map[type] || map.lecture;
  return <span className={`session-pill ${item.class}`}>{item.text}</span>;
};
