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

  useEffect(() => {
    console.log('EventImage: Processing src:', src);
    
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
    
    // Check for empty or invalid src
    if (!src || src.trim() === '' || src === 'null' || src === 'undefined') {
      console.log('EventImage: Invalid src, setting error');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Process the URL
    let processedSrc = src.trim();
    
    // If it's a Supabase URL, add optimization parameters
    if (processedSrc.includes('supabase.co')) {
      const baseUrl = processedSrc.split('?')[0];
      processedSrc = `${baseUrl}?quality=80&format=webp&width=800`;
      console.log('EventImage: Supabase URL processed:', processedSrc);
    }
    
    console.log('EventImage: Final processed src:', processedSrc);
    setImageSrc(processedSrc);
  }, [src]);

  const handleImageError = () => {
    console.error('EventImage: Image failed to load:', imageSrc);
    setIsLoading(false);
    setHasError(true);
  };

  const handleImageLoad = () => {
    console.log('EventImage: Image loaded successfully:', imageSrc);
    setIsLoading(false);
  };

  // Show fallback if no valid src or error
  if (hasError || !src || src.trim() === '' || src === 'null' || src === 'undefined') {
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

  // Don't render img element if we don't have a valid imageSrc
  if (!imageSrc || imageSrc.trim() === '') {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Processing image...</p>
          <p className="text-xs text-gray-500 mt-1">Alt: {alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading placeholder */}
      {isLoading && (
        <div className={`${className} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-pulse">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            </div>
            <p className="text-sm text-gray-600">Loading image...</p>
          </div>
        </div>
      )}
      
      {/* Only render img element if we have a valid imageSrc */}
      {imageSrc && imageSrc.trim() !== '' && (
        <img 
          src={imageSrc} 
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      )}
    </div>
  );
}
