import { useQuery, useMutation } from '@tanstack/react-query';
import { unsplashClient, type UnsplashImage } from '@/lib/unsplash/client';
import type { Orientation } from 'unsplash-js';

export function useRandomWallpaper(options?: { query?: string; orientation?: Orientation }) {
  return useQuery<UnsplashImage, Error>({
    queryKey: ['randomWallpaper', options],
    queryFn: async () => {
      const response = await unsplashClient.photos.getRandom({
        query: options?.query,
        orientation: options?.orientation || 'landscape',
        count: 1
      });
      const photo = Array.isArray(response.response) ? response.response[0] : response.response;
      if (!photo) throw new Error('No photo found');
      return photo as unknown as UnsplashImage;
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
}

export function useUnsplashImages(options: { page?: number; perPage?: number; query?: string } = {}) {
  const { page = 1, perPage = 30, query } = options;

  return useQuery<UnsplashImage[], Error>({
    queryKey: ['unsplash-images', page, perPage, query],
    queryFn: async () => {
      if (query) {
        const response = await unsplashClient.search.getPhotos({
          query,
          page,
          perPage,
          orientation: 'landscape'
        });
        return (response.response?.results || []) as unknown as UnsplashImage[];
      } else {
        const response = await unsplashClient.photos.list({
          page,
          perPage
        });
        return (response.response || []) as unknown as UnsplashImage[];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWallpaper(id: string) {
  return useQuery<UnsplashImage, Error>({
    queryKey: ['wallpaper', id],
    queryFn: async () => {
      const response = await unsplashClient.photos.get({ photoId: id });
      if (!response.response) throw new Error('Photo not found');
      return response.response as unknown as UnsplashImage;
    },
    staleTime: 30 * 60 * 1000, // Consider data stale after 30 minutes
  });
}

export function useTrackDownload() {
  return useMutation({
    mutationFn: async (downloadLocation: string) => {
      // The download tracking is handled automatically by the unsplash-js client
      // when using the download URL from the photo object
      await fetch(downloadLocation);
    },
  });
}

// Helper function to format image URLs with custom parameters
export function formatImageUrl(image: UnsplashImage, width?: number, height?: number): string {
  let url = image.urls.raw;
  const params = new URLSearchParams();

  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  // Always add auto format and compression
  params.append('auto', 'format,compress');
  params.append('q', '80'); // Good balance between quality and size

  return `${url}${params.toString() ? '&' + params.toString() : ''}`;
} 