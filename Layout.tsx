
import React from 'react';
import Header from './Header';
import { Theme, View } from '../../types';
import Tabs from '../ui/Tabs';
import { BookOpenIcon, ChartBarIcon, CardsIcon, ClipboardCheckIcon, PlusIcon } from '../../constants';
import Button from '../ui/Button';

interface LayoutProps {
  theme: Theme;
  onToggleTheme: () => void;
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  onOpenAddModal: () => void;
  showAddButton: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
    theme, 
    onToggleTheme, 
    children,
    activeView,
    onViewChange,
    onOpenAddModal,
    showAddButton
}) => {
  const tabItems = [
    { label: View.PROGRESS, icon: <ChartBarIcon /> }, 
    { label: View.ALL_QUESTIONS, icon: <BookOpenIcon /> },
    { label: View.INTERVIEW_MODE, icon: <ClipboardCheckIcon /> }, 
    { label: View.FLASHCARDS, icon: <CardsIcon /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-theme-bg-main text-theme-text-primary dark:bg-theme-dark-bg-main dark:text-theme-dark-text-primary selection:bg-theme-accent-primary selection:text-white`}>
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <div className="flex-grow container mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6 p-0 sm:p-1 bg-transparent dark:bg-transparent rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Tabs tabs={tabItems} activeTab={activeView} onTabChange={onViewChange} />
                {showAddButton && (activeView === View.ALL_QUESTIONS || activeView === View.PROGRESS) && (
                    <Button 
                        onClick={onOpenAddModal} 
                        leftIcon={<PlusIcon className="w-4 h-4"/>}
                        className="w-full sm:w-auto mt-4 sm:mt-0 shrink-0"
                        variant="primary"
                        size="md"
                    >
                        Add New Story
                    </Button>
                )}
            </div>
        </div>
        <div className="animate-fade-in">
            {children}
        </div>
      </div>
      <footer className="text-center py-5 text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary border-t border-theme-border-color dark:border-theme-dark-border-color">
        Amazon Area Manager Interview Hub &copy; {new Date().getFullYear()}. Prepare to Lead.
      </footer>
    </div>
  );
};

export default Layout;
