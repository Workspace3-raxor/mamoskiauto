import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-6 py-2 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-sm active:scale-95",
    secondary: "bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200 shadow-sm",
    danger: "bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-100",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-500 border-transparent hover:text-zinc-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="uppercase text-[9px] tracking-widest font-black">Syncing...</span>
        </div>
      ) : children}
    </button>
  );
};