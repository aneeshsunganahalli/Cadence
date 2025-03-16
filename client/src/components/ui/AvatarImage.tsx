import React from 'react';
import Image from 'next/image';

interface AvatarImageProps {
  src: string | null | undefined;
  alt?: string;
  className?: string;
}

const AvatarImage: React.FC<AvatarImageProps> = ({ 
  src, 
  alt = "Profile", 
  className = "w-full h-full object-cover" 
}) => {
  // If no src provided, render initials or default image
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-700 text-white ${className}`}>
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  // For external URLs, use img element
  if (src.startsWith('http')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  // For internal images, use Next.js Image
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={className}
    />
  );
};

export default AvatarImage;