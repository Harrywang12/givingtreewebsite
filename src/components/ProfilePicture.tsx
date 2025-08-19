'use client';

import { useState } from 'react';
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
  const fileInputRef = useState<HTMLInputElement | null>(null)[1];

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
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef) {
      fileInputRef.click();
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
            ref={(input) => fileInputRef = input}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
              isHovering || isLoading ? 'opacity-100' : 'opacity-0'
            } cursor-pointer`}
            onClick={triggerFileInput}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="text-white w-1/4 h-1/4" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
