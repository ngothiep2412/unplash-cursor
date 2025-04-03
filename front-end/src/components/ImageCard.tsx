'use client';

import { UnsplashImage } from '@/lib/unsplash/client';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface ImageCardProps {
  image: UnsplashImage;
  priority?: boolean;
  onSelect?: (image: UnsplashImage) => void;
}

export default function ImageCard({ image, priority = false, onSelect }: ImageCardProps) {
  return (
    <motion.div
      className="group relative aspect-[3/2] w-full overflow-hidden rounded-lg shadow-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <OptimizedImage
        image={image}
        priority={priority}
        className="h-full w-full object-cover"
        onClick={() => onSelect?.(image)}
      />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
        initial={false}
      >
        {/* Photographer info */}
        <div className="flex items-center gap-2">
          <img
            src={image.user.profile_image.small}
            alt={image.user.name}
            className="h-8 w-8 rounded-full"
          />
          <div className="text-white">
            <p className="text-sm font-medium">{image.user.name}</p>
            <p className="text-xs opacity-80">@{image.user.username}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 