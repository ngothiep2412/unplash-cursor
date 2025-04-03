'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useUnsplashImages } from '@/lib/unsplash/hooks';
import type { UseUnsplashImagesResult } from '@/lib/unsplash/hooks';
import ImageFilters, { ImageFilters as FilterOptions } from '@/components/ImageFilters';
import SearchInput from '@/components/SearchInput';
import Gallery from '@/components/Gallery';
import { OrderBy } from 'unsplash-js';

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('nature'); // Set initial search query
  const [filters, setFilters] = useState<FilterOptions>({
    orientation: 'landscape',
    orderBy: OrderBy.LATEST,
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useUnsplashImages({
    query: debouncedSearchQuery,
    page,
    perPage: 12,
    ...filters,
  });

  const images = data?.images || [];
  const totalPages = Math.ceil((data?.total || 0) / 12);

  useEffect(() => {
    // Reset to the first page whenever the search query or filters change
    setPage(1);
  }, [debouncedSearchQuery, filters]);

  useEffect(() => {
    console.log('Current State:', {
      page,
      searchQuery,
      filters,
      imagesCount: images.length,
      isLoading,
      error: error?.message,
    });
  }, [page, searchQuery, filters, images, isLoading, error]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
        Dream Wall Gallery
        </h1>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <SearchInput
            onSearch={setSearchQuery}
            placeholder="Search for images..."
            className="max-w-2xl mx-auto"
          />
          <ImageFilters
            onFilterChange={(newFilters) => {
              setFilters(prev => ({ ...prev, ...newFilters }));
              setPage(1);
            }}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">Error: {error.message}</p>
          </div>
        )}

        {/* Loading State and Gallery */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <Gallery 
                images={images}
                onImageSelect={(image) => {
                  console.log('Selected image:', image.id);
                  // TODO: Implement image selection handling
                }}
              />

              {/* Pagination - only show if we have images and more than one page */}
              {images.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="flex items-center px-4 font-medium text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={isLoading || page >= totalPages}
                    className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
} 