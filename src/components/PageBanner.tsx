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
      <div className="relative h-[220px] sm:h-[260px] md:h-[320px]">
        <Image
          src={src}
          alt={imageAlt || title}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Organic tint and texture overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/55 via-emerald-800/45 to-emerald-700/35" />
        <div className="absolute inset-0 texture-leaf opacity-70" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-base sm:text-lg text-emerald-50/95">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


