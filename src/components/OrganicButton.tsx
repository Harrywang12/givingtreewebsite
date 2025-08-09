'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

type OrganicButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  iconPosition?: 'left' | 'right' | 'none';
  icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function OrganicButton({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  iconPosition = 'none',
  icon,
  ...props
}: OrganicButtonProps) {
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/20',
    secondary: 'bg-white text-green-700 border border-green-200 hover:bg-green-50 hover:border-green-300',
    outline: 'bg-transparent text-green-700 border-2 border-green-500 hover:bg-green-50',
    text: 'bg-transparent text-green-700 hover:bg-green-50 hover:underline shadow-none',
  };

  // Size classes
  const sizeClasses = {
    small: 'text-sm px-4 py-2',
    medium: 'px-6 py-3',
    large: 'text-lg px-8 py-4',
  };

  // Width classes
  const widthClass = fullWidth ? 'w-full' : '';

  // Icon position classes
  const getIconPosition = () => {
    if (iconPosition === 'left') return 'mr-2';
    if (iconPosition === 'right') return 'ml-2';
    return '';
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className={`
        btn relative overflow-hidden font-medium rounded-xl flex items-center justify-center
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `}
      {...props}
    >
      {/* Background ripple effect */}
      <span className="absolute inset-0 w-full h-full bg-white/10 transform -translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
      
      {/* Icon and content layout */}
      {iconPosition === 'left' && icon && <span className={getIconPosition()}>{icon}</span>}
      <span className="relative z-10">{children}</span>
      {iconPosition === 'right' && icon && <span className={getIconPosition()}>{icon}</span>}

      {/* Bottom accent */}
      <span className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-green-400/50 to-green-600/50"></span>
    </motion.button>
  );
}
