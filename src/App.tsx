import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Calendar style={{ color: 'var(--accent-cyan)' }} size={32} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--accent-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ClassSchedule
        </h1>
      </header>

      <main>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--bg-card-border)',
          borderRadius: '1rem',
          padding: '2rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>
            <Sparkles size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Base Setup Complete
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Dynamic Class Schedule Platform</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Design system tokens, React 19, Vite, Lucide icons, and base project structure initialized.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Clock size={16} />
            <span>Ready for data models & state implementation</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
