
import React from 'react';
import { Theme } from '../../types';
import ThemeToggle from '../ui/ThemeToggle';
import { AppLogo } from '../../constants'; // Changed from AmazonLogo to AppLogo

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="bg-theme-bg-sidebar dark:bg-theme-dark-bg-sidebar shadow-md sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <AppLogo className="h-auto" /> {/* Using the new AppLogo */}
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
};

export default Header;
