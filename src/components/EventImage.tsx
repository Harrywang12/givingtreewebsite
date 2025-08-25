'use client';

import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

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
  const maxRetries = 2;

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    
    if (!src || src.trim() === '') {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Ensure the URL is properly formatted
    let processedSrc = src;
    
    // If it's a relative URL, make it absolute
    if (src.startsWith('/')) {
      processedSrc = `${window.location.origin}${src}`;
    }
    
    // If it's a Supabase URL, ensure it has the correct format
    if (src.includes('supabase.co')) {
      // Add cache busting parameter for Supabase URLs
      const separator = src.includes('?') ? '&' : '?';
      processedSrc = `${src}${separator}v=${Date.now()}`;
    }
    
    setImageSrc(processedSrc);
  }, [src]);

  const handleImageError = () => {
    console.error('Image failed to load:', imageSrc);
    
    if (retryCount < maxRetries) {
      // Retry with a different cache busting parameter
      setRetryCount(prev => prev + 1);
      const newSrc = imageSrc.includes('?') 
        ? `${imageSrc.split('?')[0]}?v=${Date.now()}&retry=${retryCount + 1}`
        : `${imageSrc}?v=${Date.now()}&retry=${retryCount + 1}`;
      setImageSrc(newSrc);
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  if (hasError || !src || src.trim() === '') {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No image available</p>
          <p className="text-xs text-gray-500 mt-1">Alt: {alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-blue-300`}>
          <div className="text-center">
            <div className="animate-pulse">
              <ImageIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            </div>
            <p className="text-sm text-blue-600">
              {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Loading image...'}
            </p>
          </div>
        </div>
      )}
      <img 
        src={imageSrc} 
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
        loading="lazy"
        crossOrigin="anonymous"
      />
    </div>
  );
}
