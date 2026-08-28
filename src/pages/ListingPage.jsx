import React from 'react';
import { useApiData } from '../hooks/useApiData.js';
import PlaceCard from '../components/PlaceCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';

/**
 * @param {{ title: string, subtitle: string, type: string, basePath: string, fetcher: () => Promise<any[]> }} props
 */
export default function ListingPage({ title, subtitle, type, basePath, fetcher }) {
  const { data, loading, error, refetch } = useApiData(fetcher, [fetcher]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-1">
        <CategoryIcon type={type} />
        <h1 className="font-display text-3xl font-semibold text-teal-700">{title}</h1>
      </div>
      <p className="text-teal-400 mb-8">{subtitle}</p>

      {loading && <LoadingState label={`Loading ${title.toLowerCase()}…`} />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && Array.isArray(data) && data.length === 0 && (
        <EmptyState
          title="Nothing to show yet"
          message="No results returned for this category."
        />
      )}

      {!loading && !error && Array.isArray(data) && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((item, idx) => (
            <PlaceCard key={item?.id ?? idx} item={item} basePath={basePath} type={type} />
          ))}
        </div>
      )}
    </div>
  );
}
