
import React from 'react';

interface BookmarkIconProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const BookmarkIcon: React.FC<BookmarkIconProps> = ({ 
  size = 'md', 
  color = 'text-red-500',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-6',
    md: 'w-5 h-8',
    lg: 'w-6 h-10'
  };

  return (
    <div className={`absolute top-0 right-4 z-10 ${className}`}>
      <svg 
        width={size === 'sm' ? '16' : size === 'md' ? '20' : '24'} 
        height={size === 'sm' ? '24' : size === 'md' ? '32' : '40'} 
        viewBox="0 0 20 30" 
        className={`${color} fill-current`}
      >
        <path d="M0 0 L20 0 L20 25 L10 20 L0 25 Z" />
      </svg>
    </div>
  );
};

export default BookmarkIcon;
