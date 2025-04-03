'use client';

import { useUnsplashImages } from '@/lib/unsplash/hooks';
import Gallery from '@/components/Gallery';
import { useState } from 'react';
import { UnsplashImage } from '@/lib/unsplash/client';

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const { data: images, isLoading, error } = useUnsplashImages({ page });

  // Log data khi nó thay đổi
  console.log('Gallery Images:', images);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Error loading images: {error.message}</p>
      </div>
    );
  }

  if (isLoading && !images) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
          MacWall Gallery
        </h1>
        <Gallery 
          images={safeImages} 
          onImageSelect={(image) => {
            console.log('Selected image:', image);
          }}
        />
        
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            className="rounded bg-primary px-4 py-2 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
} 