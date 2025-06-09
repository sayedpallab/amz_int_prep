import React from 'react';
import { View } from '../../types';

interface TabItem {
  label: View;
  icon: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: View;
  onTabChange: (tab: View) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-theme-border-color dark:border-theme-dark-border-color">
      <nav className="-mb-px flex space-x-1 sm:space-x-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.label)}
            className={`
              group inline-flex items-center py-3 px-2 sm:px-4 border-b-2 font-sans font-semibold text-sm sm:text-base transition-all duration-200 ease-in-out
              rounded-t-md 
              ${
                activeTab === tab.label
                  ? 'border-theme-accent-primary text-theme-accent-primary dark:border-theme-dark-accent-primary dark:text-theme-dark-accent-primary bg-theme-bg-main dark:bg-theme-dark-bg-main shadow-sm'
                  : 'border-transparent text-theme-text-secondary hover:text-theme-accent-primary hover:border-theme-accent-primary dark:text-theme-dark-text-secondary dark:hover:text-theme-dark-accent-primary dark:hover:border-theme-dark-accent-primary'
              }
            `}
            aria-current={activeTab === tab.label ? 'page' : undefined}
          >
            <span className={`mr-2 w-5 h-5 transition-colors duration-200 ease-in-out ${activeTab === tab.label ? 'text-theme-accent-primary dark:text-theme-dark-accent-primary' : 'text-theme-text-secondary group-hover:text-theme-accent-primary dark:text-theme-dark-text-secondary dark:group-hover:text-theme-dark-accent-primary'}`}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;