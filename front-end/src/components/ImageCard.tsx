'use client';

import { UnsplashImage } from '@/lib/unsplash/client';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageCardProps {
  image: UnsplashImage;
  priority?: boolean;
  onSelect?: (image: UnsplashImage) => void;
}

export default function ImageCard({ image, priority = false, onSelect }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-200 shadow-md transition-shadow hover:shadow-xl"
      onClick={() => onSelect?.(image)}
    >
      <Image
        src={image.urls.regular}
        alt={image.description || 'Wallpaper'}
        fill
        className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
          isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'
        }`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-30" />

      {/* Image Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {image.user.profile_image && (
              <Image
                src={image.user.profile_image.small}
                alt={image.user.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium">{image.user.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">
              {image.width} × {image.height}
            </span>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary-500" />
        </div>
      )}
    </motion.div>
  );
} 