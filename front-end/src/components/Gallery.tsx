'use client';

import { UnsplashImage } from '@/lib/unsplash/client';
import ImageCard from './ImageCard';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryProps {
  images: UnsplashImage[];
  onImageSelect?: (image: UnsplashImage) => void;
}

export default function Gallery({ images, onImageSelect }: GalleryProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ImageCard
                image={image}
                priority={index < 4} // Prioritize loading first 4 images
                onSelect={onImageSelect}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {images.length === 0 && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-lg text-gray-500">No images found</p>
        </div>
      )}
    </div>
  );
} 