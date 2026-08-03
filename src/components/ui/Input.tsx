import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>}
      <input
        style={{
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface-secondary)',
          border: error ? '1px solid var(--status-cancelled-border)' : '1px solid var(--color-border)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-cancelled-text)' }}>{error}</span>}
    </div>
  );
};
