'use client';

import { OrderBy, SearchOrderBy } from 'unsplash-js';

interface ImageFiltersProps {
  onFilterChange: (filters: ImageFilters) => void;
  className?: string;
}

export interface ImageFilters {
  orientation?: 'landscape' | 'portrait' | 'squarish';
  orderBy?: OrderBy | SearchOrderBy;
}

export default function ImageFilters({ onFilterChange, className = '' }: ImageFiltersProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <label htmlFor="orientation" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Orientation:
        </label>
        <select
          id="orientation"
          onChange={(e) => onFilterChange({ orientation: e.target.value as ImageFilters['orientation'] })}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All</option>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="squarish">Square</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="orderBy" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Sort by:
        </label>
        <select
          id="orderBy"
          onChange={(e) => onFilterChange({ orderBy: e.target.value as OrderBy })}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value={OrderBy.LATEST}>Latest</option>
          <option value={OrderBy.POPULAR}>Popular</option>
          <option value={OrderBy.VIEWS}>Most Viewed</option>
          <option value={OrderBy.DOWNLOADS}>Most Downloaded</option>
          <option value={OrderBy.OLDEST}>Oldest</option>
        </select>
      </div>
    </div>
  );
} 