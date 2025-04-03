import { createApi } from 'unsplash-js';

// Types
export interface UnsplashImage {
  id: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export interface SearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

// Create and configure the Unsplash client
export const unsplashClient = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
});

// Export the client type for TypeScript support
export type UnsplashClient = typeof unsplashClient; 