'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';

type OrganicCardProps = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'natural' | 'feature';
  decorationPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none';
  decorationSize?: 'small' | 'medium' | 'large';
  hoverEffect?: boolean;
};

export default function OrganicCard({
  children,
  className = '',
  variant = 'default',
  decorationPosition = 'bottom-right',
  decorationSize = 'medium',
  hoverEffect = true,
}: OrganicCardProps) {
  // Decoration sizes
  const sizeMap = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-64 h-64',
  };

  // Position classes
  const positionMap = {
    'top-left': '-top-8 -left-8',
    'top-right': '-top-8 -right-8',
    'bottom-left': '-bottom-8 -left-8',
    'bottom-right': '-bottom-8 -right-8',
    'none': 'hidden',
  };

  // Card style variants
  const variantClasses = {
    default: 'bg-white',
    highlight: 'bg-white before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-green-400 before:to-green-600',
    natural: 'bg-gradient-to-br from-green-50 to-white',
    feature: 'bg-white border-2 border-green-200',
  };

  // Hover animation properties
  const hoverAnimation = hoverEffect ? {
    whileHover: { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    transition: { type: "spring", stiffness: 300 }
  } : {};

  return (
    <motion.div 
      className={`card relative overflow-hidden ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      {...hoverAnimation}
    >
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Organic decoration */}
      {decorationPosition !== 'none' && (
        <div className={`absolute ${positionMap[decorationPosition]} ${sizeMap[decorationSize]} rounded-full bg-green-50 opacity-70 z-0`}>
          <div className="absolute inset-0 opacity-30">
            <Image 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234caf50'%3E%3Cpath d='M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C16 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z'/%3E%3C/svg%3E"
              width={160}
              height={160}
              alt=""
            />
          </div>
        </div>
      )}

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%234caf50' fill-opacity='.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}>
      </div>
    </motion.div>
  );
}
