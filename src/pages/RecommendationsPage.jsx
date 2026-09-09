import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData.js';
import { getMyRecommendations } from '../api/recommendations.js';
import PlaceCard from '../components/PlaceCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import { getId } from '../utils/fields.js';

// TODO: point this at your actual feasibility checker route once it exists.
const FEASIBILITY_CHECKER_ROUTE = 'https://trip-feasibility-checker.onrender.com';

export default function RecommendationsPage() {
  const { data, loading, error, refetch } = useApiData(getMyRecommendations, []);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    navigate(FEASIBILITY_CHECKER_ROUTE, { state: { selectedDestinationIds: selectedIds } });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 pb-28">
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
            {data.map((item, idx) => {
              const id = getId(item);
              return (
                <PlaceCard
                  key={id ?? idx}
                  item={item}
                  basePath="/destinations"
                  type="destination"
                  selectable
                  isSelected={selectedIds.includes(id)}
                  onToggleSelect={toggleSelect}
                />
              );
            })}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-base border-t border-sage-300 shadow-lg">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-teal-700 font-medium">
              {selectedIds.length} destination{selectedIds.length > 1 ? 's' : ''} selected
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}