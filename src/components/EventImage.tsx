'use client';

import { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export default function EventImage({ 
  src, 
  alt, 
  className = "w-full h-48 object-cover rounded-lg shadow-md",
  fallbackIcon = <ImageIcon className="w-8 h-8 text-gray-400" />
}: EventImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const maxRetries = 2;

  // Check if we can use Next.js Image optimization
  const canUseNextImage = src && (src.startsWith('/') || src.includes('localhost'));

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    setIsLoaded(false);
    
    if (!src || src.trim() === '') {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Optimize the URL for faster loading
    let processedSrc = src;
    
    // If it's a relative URL, make it absolute
    if (src.startsWith('/')) {
      processedSrc = `${window.location.origin}${src}`;
    }
    
    // If it's a Supabase URL, add optimization parameters
    if (src.includes('supabase.co')) {
      const baseUrl = src.split('?')[0];
      // Add optimization parameters for faster loading
      processedSrc = `${baseUrl}?quality=80&format=webp&width=800`;
    }
    
    setImageSrc(processedSrc);
  }, [src, isInView]);

  const handleImageError = () => {
    console.error('Image failed to load:', imageSrc);
    
    if (retryCount < maxRetries) {
      // Retry with different optimization parameters
      setRetryCount(prev => prev + 1);
      const baseUrl = imageSrc.split('?')[0];
      const newSrc = `${baseUrl}?quality=70&format=jpeg&width=600&retry=${retryCount + 1}`;
      setImageSrc(newSrc);
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setIsLoaded(true);
  };

  if (hasError || !src || src.trim() === '') {
    return (
      <div ref={imageRef} className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No image available</p>
          <p className="text-xs text-gray-500 mt-1">Alt: {alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imageRef} className="relative">
      {/* Loading placeholder with skeleton animation */}
      {isLoading && (
        <div className={`${className} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-pulse">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            </div>
            <p className="text-sm text-gray-600">
              {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading image...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Use Next.js Image for local images, regular img for external */}
      {isInView && (
        canUseNextImage ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={`${className} transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        ) : (
          <img 
            src={imageSrc} 
            alt={alt}
            className={`${className} transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        )
      )}
    </div>
  );
}
