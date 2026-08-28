import React from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData.js';
import { getMyRecommendations } from '../api/recommendations.js';
import PlaceCard from '../components/PlaceCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';

export default function RecommendationsPage() {
  const { data, loading, error, refetch } = useApiData(getMyRecommendations, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-1">
        <CategoryIcon type="destination" />
        <h1 className="font-display text-3xl font-semibold text-teal-700">Recommended for you</h1>
      </div>
      <p className="text-teal-400 mb-1">
        Based on your saved preferences, or overall popularity if you haven&apos;t set any yet.
      </p>
      <Link to="/preferences" className="text-sm text-teal-600 hover:underline">
        Update your preferences →
      </Link>

      <div className="mt-8">
        {loading && <LoadingState label="Finding recommendations…" />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && Array.isArray(data) && data.length === 0 && (
          <EmptyState
            title="No recommendations yet"
            message="No destinations returned."
          />
        )}

        {!loading && !error && Array.isArray(data) && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item, idx) => (
              <PlaceCard key={item?.id ?? idx} item={item} basePath="/destinations" type="destination" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
