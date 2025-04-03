'use client';

import { useRandomWallpaper } from '@/hooks/useUnsplash';
import Image from 'next/image';

export default function Home() {
  const { data: wallpaper, isLoading, error } = useRandomWallpaper();

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg text-red-500">Error: {error.message}</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">MacWall</h1>
      {wallpaper && (
        <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-lg shadow-xl">
          <Image
            src={wallpaper.urls.regular}
            alt={wallpaper.description || 'Random wallpaper'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}
    </main>
  );
}
