import { useQuery } from '@tanstack/react-query';
import { UnsplashImage, unsplashClient } from './client';

interface UseUnsplashImagesOptions {
  page?: number;
  perPage?: number;
  query?: string;
}

export function useUnsplashImages(options: UseUnsplashImagesOptions = {}) {
  const { page = 1, perPage = 20, query } = options;

  return useQuery<UnsplashImage[], Error>({
    queryKey: ['unsplash-images', page, perPage, query],
    queryFn: async () => {
      try {
        if (query) {
          const response = await unsplashClient.search.getPhotos({
            query,
            page,
            perPage,
            orientation: 'landscape'
          });
          console.log('Search API Response:', response);
          return response.response?.results as UnsplashImage[];
        } else {
          const response = await unsplashClient.photos.list({
            page,
            perPage
          });
          console.log('List API Response:', response);
          return response.response?.results as UnsplashImage[];
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
      }
    }
  });
} 