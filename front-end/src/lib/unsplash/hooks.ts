import { useQuery } from '@tanstack/react-query';
import { UnsplashImage, unsplashClient } from './client';
import { OrderBy, SearchOrderBy } from 'unsplash-js';

interface UseUnsplashImagesOptions {
  page?: number;
  perPage?: number;
  query?: string;
  orientation?: 'landscape' | 'portrait' | 'squarish';
  orderBy?: OrderBy | SearchOrderBy;
}

export interface UseUnsplashImagesResult {
  images: UnsplashImage[];
  total: number;
}

export function useUnsplashImages(options: UseUnsplashImagesOptions = {}) {
  const { page = 1, perPage = 20, query, orientation, orderBy = 'latest' } = options;

  return useQuery<UseUnsplashImagesResult, Error>({
    queryKey: ['unsplash-images', page, perPage, query, orientation, orderBy],
    queryFn: async () => {
      try {
        if (query) {
          const response = await unsplashClient.search.getPhotos({
            query,
            page,
            perPage,
            orientation,
            orderBy: orderBy as SearchOrderBy
          });
          console.log('Search API Response:', response);
          
          // Ensure we have a valid response with results
          if (!response.response?.results || !Array.isArray(response.response.results)) {
            console.warn('Search returned no results or invalid response:', response);
            return { images: [], total: 0 };
          }
          
          return {
            images: response.response.results.map(photo => ({
              id: photo.id,
              width: photo.width,
              height: photo.height,
              color: photo.color,
              blur_hash: photo.blur_hash,
              description: photo.description,
              alt_description: photo.alt_description,
              urls: photo.urls,
              links: photo.links,
              user: photo.user
            })) as UnsplashImage[],
            total: response.response.total || 0
          };
        } else {
          const response = await unsplashClient.photos.list({
            page,
            perPage,
            orderBy: orderBy as OrderBy
          });
          console.log('List API Response:', response);
          
          // Ensure we have a valid response
          if (!response.response || !Array.isArray(response.response)) {
            console.warn('List returned no results or invalid response:', response);
            return { images: [], total: 0 };
          }
          
          // For list endpoint, we don't get a total count, so we'll use a large number
          // to indicate there are more images available
          return {
            images: response.response.map(photo => ({
              id: photo.id,
              width: photo.width,
              height: photo.height,
              color: photo.color,
              blur_hash: photo.blur_hash,
              description: photo.description,
              alt_description: photo.alt_description,
              urls: photo.urls,
              links: photo.links,
              user: photo.user
            })) as UnsplashImage[],
            total: 1000 // Use a large number for list endpoint
          };
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
} 