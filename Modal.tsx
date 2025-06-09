import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'; // Added more sizes
  footer?: React.ReactNode; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = '2xl', footer }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl', // Default, matches user's max-width: 800px approx
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 sm:p-5 z-50 animate-fade-in"
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-theme-bg-card dark:bg-theme-dark-bg-card rounded-lg shadow-lg dark:shadow-dark-lg flex flex-col w-full ${sizeClasses[size]} animate-modal-open max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-theme-border-color dark:border-theme-dark-border-color">
          <h2 id="modal-title" className="font-serif text-xl sm:text-2xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-theme-text-secondary dark:text-theme-dark-text-secondary hover:text-theme-accent-primary dark:hover:text-theme-dark-accent-primary p-1 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow">
            {children}
        </div>
        {footer && (
            <div className="p-5 sm:p-6 border-t border-theme-border-color dark:border-theme-dark-border-color bg-theme-bg-main dark:bg-theme-dark-bg-main rounded-b-lg">
                {footer}
            </div>
        )}
      </div>
    </div>
  );
};

export default Modal;