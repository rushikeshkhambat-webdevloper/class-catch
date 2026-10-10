import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle({ variant = 'default' }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggleTheme}
        className="!bg-transparent !text-slate-400 w-full !justify-center !px-3 hover:!bg-white/5 hover:!text-white"
        style={{ border: '1px solid var(--sidebar-border)' }}
      >
        <span className="text-[14px] leading-none">
          {theme === 'dark' ? '☀️' : '🌙'}
        </span>
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="!bg-[var(--bg-card)] !text-[var(--text-primary)] !p-2.5 hover:!bg-[var(--bg-secondary)]"
      style={{ border: '1px solid var(--border)' }}
      title="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}