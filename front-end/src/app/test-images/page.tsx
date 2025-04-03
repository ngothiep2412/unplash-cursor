'use client';

import { useRandomWallpaper, useUnsplashImages } from '@/hooks/useUnsplash';
import OptimizedImage from '@/components/OptimizedImage';
import ImageCard from '@/components/ImageCard';
import { useState } from 'react';
import { UnsplashImage } from '@/lib/unsplash/client';

export default function TestImages() {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Test different image loading scenarios
  const { data: randomImage } = useRandomWallpaper();
  const { data: images } = useUnsplashImages({ query: 'landscape', page: 1, perPage: 3 });

  const sizes = {
    small: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Image Optimization Test Page
        </h1>

        {/* Size Controls */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Test Different Sizes
          </h2>
          <div className="flex gap-4">
            {Object.keys(sizes).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size as keyof typeof sizes)}
                className={`rounded px-4 py-2 ${
                  selectedSize === size
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Single Image Test */}
        {randomImage && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Single Image Test (with size control)
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <OptimizedImage
                image={randomImage as UnsplashImage}
                width={sizes[selectedSize].width}
                height={sizes[selectedSize].height}
                priority
              />
            </div>
          </section>
        )}

        {/* Gallery Card Test */}
        {images && (images as UnsplashImage[]).length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Gallery Cards Test (responsive layout)
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(images as UnsplashImage[]).map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  priority={index === 0}
                  onSelect={(img) => console.log('Selected image:', img.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Loading State Test */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Loading State Test
          </h2>
          <div className="h-[400px] w-full rounded-lg border border-gray-200 dark:border-gray-700">
            {randomImage && (
              <OptimizedImage
                image={randomImage as UnsplashImage}
                width={800}
                height={400}
                priority={false} // Force loading state
              />
            )}
          </div>
        </section>

        {/* Error State Test */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Error State Test
          </h2>
          <div className="h-[400px] w-full rounded-lg border border-gray-200 dark:border-gray-700">
            {randomImage && (
              <OptimizedImage
                image={{
                  ...(randomImage as UnsplashImage),
                  urls: { ...(randomImage as UnsplashImage).urls, regular: 'invalid-url' }
                }}
                width={800}
                height={400}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
} 