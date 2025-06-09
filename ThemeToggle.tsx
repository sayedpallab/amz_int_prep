import React from 'react';
import { Theme } from '../../types';
// Icons can be used inside the slider if desired, or just for aria-label.
// For now, sticking to the visual from user's CSS.

interface ThemeToggleProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';
  return (
    <div className="flex items-center">
      <span className="mr-3 text-sm font-medium text-theme-text-on-sidebar dark:text-theme-dark-text-on-sidebar hidden sm:inline">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <label htmlFor="theme-switch-checkbox" className="relative inline-block w-10 h-5 cursor-pointer">
        <input 
          type="checkbox" 
          id="theme-switch-checkbox"
          className="opacity-0 w-0 h-0"
          checked={isDark}
          onChange={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        />
        <span 
          className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ease-in-out
            ${isDark ? 'bg-theme-accent-secondary dark:bg-theme-dark-accent-secondary' : 'bg-gray-400 dark:bg-theme-dark-border-color'}`}
        >
          <span 
            className={`absolute left-0.5 top-0.5 bg-white dark:bg-theme-dark-bg-card w-4 h-4 rounded-full transition-transform duration-300 ease-in-out
              ${isDark ? 'transform translate-x-5' : ''}`}
          />
        </span>
      </label>
    </div>
  );
};

export default ThemeToggle;