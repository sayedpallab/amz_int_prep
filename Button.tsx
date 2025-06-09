import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = "font-sans font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-theme-dark-bg-main transition-all duration-200 ease-in-out inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed";

  // Updated variants to match user's theme
  const variantStyles = {
    primary: "bg-theme-accent-primary hover:bg-opacity-85 text-white focus:ring-theme-accent-primary shadow-sm hover:shadow-md", // User's .add-btn like
    secondary: "bg-theme-border-color hover:bg-opacity-80 text-theme-text-secondary focus:ring-theme-text-secondary dark:bg-theme-dark-border-color dark:hover:bg-opacity-80 dark:text-theme-dark-text-secondary dark:focus:ring-theme-dark-text-secondary shadow-sm hover:shadow-md",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-theme-accent-ai-light dark:hover:bg-theme-dark-accent-ai-light text-theme-text-secondary dark:text-theme-dark-text-secondary focus:ring-theme-accent-primary dark:focus:ring-theme-dark-accent-primary",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400 shadow-sm hover:shadow-md",
    ai: "bg-theme-accent-ai-light hover:bg-theme-accent-ai text-theme-accent-ai hover:text-white dark:bg-theme-dark-accent-ai-light dark:hover:bg-theme-dark-accent-ai dark:text-theme-dark-accent-ai dark:hover:text-white focus:ring-theme-accent-ai border border-transparent hover:border-theme-accent-ai shadow-sm hover:shadow-md"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs", // User's actions-footer buttons are smaller
    md: "px-5 py-2.5 text-sm", // User's add-btn and modal buttons
    lg: "px-7 py-3.5 text-base",
  };
  
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;