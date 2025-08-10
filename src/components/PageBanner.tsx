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
  '/homepagehero.jpg',
  '/naturelandscape.jpg',
  '/personworking.jpg',
];

export default function PageBanner({ title, subtitle, imageUrl, imageAlt }: PageBannerProps) {
  // Deterministic image selection to avoid hydration issues and ensure reliability on mobile
  const indexFromTitle = (() => {
    if (!title) return 0;
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
    }
    return hash % defaultImages.length;
  })();
  const src = imageUrl || defaultImages[indexFromTitle];

  return (
    <section className="relative overflow-hidden">
        <div className="relative h-[260px] sm:h-[320px] md:h-[400px]">
        <Image
          src={src}
          alt={imageAlt || title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
          className="object-cover object-center brightness-[0.85] will-change-transform"
          quality={85}
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

        <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-16 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl w-full"
          >
            <div className="inline-flex items-center mb-4">
              <span className="inline-block h-0.5 w-10 bg-green-300 mr-3"></span>
              <span className="uppercase text-green-200 tracking-wider text-sm font-medium">The Giving Tree</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-tight drop-shadow-lg">
              {title}
            </h1>
            
            {subtitle && (
              <p className="mt-4 text-base sm:text-lg md:text-xl text-green-50/95 max-w-2xl leading-relaxed drop-shadow-lg">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
        
        {/* Bottom decorative wave - positioned below content, hidden on mobile */}
        <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden pointer-events-none hidden sm:block">
          <svg className="absolute bottom-0 w-full h-12 text-white" 
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


