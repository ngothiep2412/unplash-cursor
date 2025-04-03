import axios, { AxiosInstance } from 'axios';

// Types
export interface UnsplashImage {
  id: string;
  width: number;
  height: number;
  color: string;
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
    download_location: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
    };
  };
}

export interface SearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

// Rate limiting configuration
const RATE_LIMIT_PER_HOUR = 50;
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds

class UnsplashClient {
  private client: AxiosInstance;
  private requestCount: number;
  private lastReset: number;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.unsplash.com',
      headers: {
        'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
    });

    this.requestCount = 0;
    this.lastReset = Date.now();

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        this.updateRateLimit();
        return response;
      },
      (error) => {
        if (error.response) {
          // Handle rate limiting errors
          if (error.response.status === 429) {
            console.error('Rate limit exceeded');
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          // Handle other API errors
          throw new Error(error.response.data.errors?.[0] || 'An error occurred with the Unsplash API');
        }
        throw error;
      }
    );
  }

  private updateRateLimit(): void {
    const now = Date.now();
    if (now - this.lastReset >= RATE_LIMIT_WINDOW) {
      this.requestCount = 0;
      this.lastReset = now;
    }
    this.requestCount++;

    if (this.requestCount >= RATE_LIMIT_PER_HOUR) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Get a random wallpaper
  async getRandomWallpaper(options: { query?: string; orientation?: string } = {}): Promise<UnsplashImage> {
    return this.makeRequest<UnsplashImage>('/photos/random', {
      ...options,
      topics: 'wallpapers',
      content_filter: 'high',
    });
  }

  // Search for wallpapers
  async searchWallpapers(query: string, page = 1, perPage = 30): Promise<SearchResponse> {
    return this.makeRequest<SearchResponse>('/search/photos', {
      query,
      page,
      per_page: perPage,
      content_filter: 'high',
    });
  }

  // Get a specific wallpaper by ID
  async getWallpaper(id: string): Promise<UnsplashImage> {
    return this.makeRequest<UnsplashImage>(`/photos/${id}`);
  }

  // Track a download
  async trackDownload(downloadLocation: string): Promise<void> {
    await this.client.get(downloadLocation);
  }
}

// Export a singleton instance
export const unsplashClient = new UnsplashClient();

// Export the class for testing purposes
export default UnsplashClient; 