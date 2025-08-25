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
  // Check if the src is a blob URL (temporary, won't work after refresh)
  const isBlobUrl = src.startsWith('blob:');
  
  // Initialize state based on whether it's a blob URL
  const [isLoading, setIsLoading] = useState(!isBlobUrl);
  const [hasError, setHasError] = useState(isBlobUrl);
  
  // If it's a blob URL, set error state and don't show loading state
  useEffect(() => {
    if (isBlobUrl) {
      setIsLoading(false);
      setHasError(true);
      console.log('🔍 Blob URL detected, setting error state');
    } else {
      // Reset state for valid URLs
      setIsLoading(true);
      setHasError(false);
    }
  }, [isBlobUrl, src]);
  
  // Debug logging
  console.log('EventImage component:', { src, alt, hasError, isBlobUrl, shouldShowError: isBlobUrl || hasError });

  // Show error for blob URLs since they're temporary and won't work
  if (isBlobUrl || hasError) {
    console.log('🔍 Showing error state for:', { isBlobUrl, hasError });
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-red-300`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-600">
            {isBlobUrl ? 'Invalid image URL' : 'Image failed to load'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isBlobUrl ? 'This image was not properly uploaded. Please contact an admin.' : `Alt: ${alt}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && !isBlobUrl && (
        <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-blue-300`}>
          <div className="text-center">
            <div className="animate-pulse">
              <ImageIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            </div>
            <p className="text-sm text-blue-600">Loading image...</p>
            <p className="text-xs text-gray-500 mt-1">Alt: {alt}</p>
          </div>
        </div>
      )}
      {!isBlobUrl && (
        <img 
          src={src} 
          alt={alt}
          className={`${className} ${isLoading ? 'hidden' : ''}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}
