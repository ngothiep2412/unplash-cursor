import { useQuery, useMutation } from '@tanstack/react-query';
import { unsplashClient, type UnsplashImage, type SearchResponse } from '@/lib/unsplash/client';

export function useRandomWallpaper(options?: { query?: string; orientation?: string }) {
  return useQuery({
    queryKey: ['randomWallpaper', options],
    queryFn: () => unsplashClient.getRandomWallpaper(options),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
}

export function useSearchWallpapers(query: string, page = 1, perPage = 30) {
  return useQuery({
    queryKey: ['searchWallpapers', query, page, perPage],
    queryFn: () => unsplashClient.searchWallpapers(query, page, perPage),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0, // Only run query if search term is provided
  });
}

export function useWallpaper(id: string) {
  return useQuery({
    queryKey: ['wallpaper', id],
    queryFn: () => unsplashClient.getWallpaper(id),
    staleTime: 30 * 60 * 1000, // Consider data stale after 30 minutes
  });
}

export function useTrackDownload() {
  return useMutation({
    mutationFn: (downloadLocation: string) => unsplashClient.trackDownload(downloadLocation),
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