import React from 'react';

interface CardProps {
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, interactive, onClick, style }) => {
  return (
    <div
      onClick={onClick}
      className={`card-glass ${interactive ? 'card-glass-interactive' : ''}`}
      style={{ padding: '1.25rem', ...style }}
    >
      {children}
    </div>
  );
};
