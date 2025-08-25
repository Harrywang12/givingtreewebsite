'use client';

import { useState } from 'react';
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

  // Debug logging
  console.log('EventImage component:', { src, alt, hasError });

  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-red-300`}>
        <div className="text-center">
          <ImageIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-600">Image failed to load</p>
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
            <p className="text-sm text-blue-600">Loading image...</p>
            <p className="text-xs text-gray-500 mt-1">Alt: {alt}</p>
          </div>
        </div>
      )}
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
    </div>
  );
}
