'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const defaultImages = [
  'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526250854212-6852f9d64ac2?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
];

export default function PageBanner({ title, subtitle, imageUrl, imageAlt }: PageBannerProps) {
  const src = imageUrl || defaultImages[Math.floor(Math.random() * defaultImages.length)];

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[280px] sm:h-[320px] md:h-[400px]">
        <Image
          src={src}
          alt={imageAlt || title}
          fill
          priority
          className="object-cover object-center brightness-[0.85]"
        />
        
        {/* Organic tint and texture overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/60 via-green-900/50 to-green-800/40" />
        
        {/* Subtle leaf pattern */}
        <div className="absolute inset-0 opacity-30" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0C19 0 5.3 12.5 0 30c5.3 17.5 19 30 30 30s24.7-12.5 30-30C54.7 12.5 41 0 30 0zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z' fill='%234caf50' fill-opacity='.07'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center mb-4">
              <span className="inline-block h-0.5 w-10 bg-green-300 mr-3"></span>
              <span className="uppercase text-green-200 tracking-wider text-sm font-medium">The Giving Tree</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-serif">
              {title}
            </h1>
            
            {subtitle && (
              <p className="mt-4 text-lg sm:text-xl text-green-50/95 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
        
        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-16 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none">
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="currentColor">
            </path>
          </svg>
        </div>
      </div>
    </section>
  );
}


