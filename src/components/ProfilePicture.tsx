'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, User } from 'lucide-react';

interface ProfilePictureProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onUpload?: (file: File) => void;
  isLoading?: boolean;
}

export default function ProfilePicture({
  src,
  alt = 'Profile Picture',
  size = 'md',
  editable = false,
  onUpload,
  isLoading = false,
}: ProfilePictureProps) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Determine size classes based on the size prop
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-10 h-10';
      case 'md':
        return 'w-16 h-16';
      case 'lg':
        return 'w-24 h-24';
      case 'xl':
        return 'w-32 h-32';
      default:
        return 'w-16 h-16';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }
      
      if (onUpload) {
        onUpload(file);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gray-100 ${getSizeClasses()}`}
      onMouseEnter={() => editable && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`(max-width: 768px) 100vw, ${getSizeClasses().split(' ')[0].replace('w-', '')}rem`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-green-100">
          <User className="text-green-600 w-1/2 h-1/2" />
        </div>
      )}

      {editable && (
        <>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
              isHovering || isLoading ? 'opacity-100' : 'opacity-0'
            } cursor-pointer`}
            onClick={triggerFileInput}
            title="Click to upload new profile picture"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="text-center">
                <Upload className="text-white w-1/3 h-1/3 mx-auto mb-1" />
                <p className="text-white text-xs">Upload</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
