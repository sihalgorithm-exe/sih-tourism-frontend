import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData.js';
import { getMyRecommendations } from '../api/recommendations.js';
import { getAllHotels } from '../api/hotels.js';
import PlaceCard from '../components/PlaceCard.jsx';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import { getId } from '../utils/fields.js';
import {
  buildFeasibilityPayload,
  validateTripInputs,
  redirectToFeasibilityChecker,
} from '../utils/feasibility.js';

export default function RecommendationsPage() {
  const { data, loading, error, refetch } = useApiData(getMyRecommendations, []);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showTripForm, setShowTripForm] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [tripError, setTripError] = useState('');

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    );
  }

  function handleContinueClick() {
    setTripError('');
    setShowTripForm(true);
  }

  async function handleCheckFeasibility(e) {
    e.preventDefault();

    const validationError = validateTripInputs(numberOfDays, hoursPerDay);
    if (validationError) {
      setTripError(validationError);
      return;
    }

    const selectedDestinations = (data || []).filter((item) =>
      selectedIds.includes(getId(item))
    );

    if (selectedDestinations.length === 0) {
      setTripError('Please select at least one destination.');
      return;
    }

    try {
  const hotels = await getAllHotels();

    const payload = buildFeasibilityPayload(
    selectedDestinations,
    numberOfDays,
    hoursPerDay,
    {
      hotels,
      city: selectedDestinations[0]?.city || '',
    }
  );

  redirectToFeasibilityChecker(payload);
} catch (err) {
  console.error(err);
  setTripError('Could not prepare the trip. Please try again.');
}
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

      {selectedIds.length > 0 && !showTripForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-base border-t border-sage-300 shadow-lg">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-teal-700 font-medium">
              {selectedIds.length} destination{selectedIds.length > 1 ? 's' : ''} selected
            </p>
            <button
              type="button"
              onClick={handleContinueClick}
              className="px-6 py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showTripForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-base border-t border-sage-300 shadow-lg">
          <form
            onSubmit={handleCheckFeasibility}
            className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-end gap-4"
          >
            <label className="flex flex-col text-sm text-teal-700 font-medium">
              Number of days
              <input
                type="number"
                min="1"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(e.target.value)}
                className="mt-1 w-32 px-3 py-2 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </label>
            <label className="flex flex-col text-sm text-teal-700 font-medium">
              Hours per day
              <input
                type="number"
                min="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="mt-1 w-32 px-3 py-2 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </label>

            {tripError && (
              <p className="text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{tripError}</p>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 transition-colors"
            >
              Check Trip Feasibility
            </button>
          </form>
        </div>
      )}
    </div>
  );
}