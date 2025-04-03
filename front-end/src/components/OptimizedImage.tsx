'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UnsplashImage } from '@/lib/unsplash/client';
import { formatImageUrl } from '@/hooks/useUnsplash';

interface OptimizedImageProps {
  image: UnsplashImage;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function OptimizedImage({
  image,
  width,
  height,
  priority = false,
  className = '',
  onClick
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);

  // Generate blur placeholder
  useEffect(() => {
    if (image.blur_hash) {
      // If we have a blur_hash, we'll use it directly
      setBlurDataUrl(`data:image/jpeg;base64,${image.blur_hash}`);
    } else {
      // Otherwise, use a tiny version of the image
      setBlurDataUrl(formatImageUrl(image, 10, 10));
    }
  }, [image]);

  // Calculate optimal image dimensions based on viewport
  const optimizedWidth = width || Math.min(1920, window.innerWidth);
  const optimizedHeight = height || Math.round((optimizedWidth / image.width) * image.height);

  // Format image URL with optimal dimensions and quality
  const imageUrl = formatImageUrl(image, optimizedWidth, optimizedHeight);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900">
          <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Image */}
      <Image
        src={imageUrl}
        alt={image.alt_description || image.description || 'Unsplash image'}
        width={optimizedWidth}
        height={optimizedHeight}
        priority={priority}
        className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        placeholder={blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={blurDataUrl || undefined}
        onClick={onClick}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError('Failed to load image');
        }}
      />
    </div>
  );
} 