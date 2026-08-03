import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    border: '1px solid transparent',
    outline: 'none',
    padding: size === 'sm' ? '0.35rem 0.65rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem',
    fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' },
    secondary: { background: 'var(--bg-surface-secondary)', color: 'var(--text-primary)', borderColor: 'var(--color-border)' },
    outline: { background: 'transparent', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', borderColor: 'transparent' },
    danger: { background: 'var(--status-cancelled-bg)', color: 'var(--status-cancelled-text)', borderColor: 'var(--status-cancelled-border)' },
  };

  return (
    <button style={{ ...baseStyle, ...variantStyles[variant], ...style }} {...props}>
      {icon}
      {children}
    </button>
  );
};
