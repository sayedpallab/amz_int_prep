import React from 'react';
import { SearchIcon } from '../../constants';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange, placeholder = "Search by LP, question, or keyword..." }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="text-theme-text-secondary dark:text-theme-dark-text-secondary w-5 h-5" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full font-sans pl-12 pr-4 py-3 border border-theme-border-color dark:border-theme-dark-border-color rounded-md leading-5 bg-theme-bg-card dark:bg-theme-dark-bg-card text-theme-text-primary dark:text-theme-dark-text-primary placeholder-theme-text-secondary dark:placeholder-theme-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-theme-accent-primary dark:focus:ring-theme-dark-accent-primary focus:border-theme-accent-primary dark:focus:border-theme-dark-accent-primary sm:text-sm shadow-sm"
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;