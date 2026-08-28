import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData.js';
import { LoadingState, ErrorState } from '../components/StateViews.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import {
  getName,
  getDescription,
  getImage,
  getLocation,
  getCategory,
  getPrice,
  getRating,
  getLatLng,
} from '../utils/fields.js';

/**
 * @param {{ type: string, backLabel: string, backPath: string, fetcher: (id: string) => Promise<any> }} props
 */
export default function DetailPage({ type, backLabel, backPath, fetcher }) {
  const { id } = useParams();
  const { data, loading, error, refetch } = useApiData(() => fetcher(id), [id]);

  const name = getName(data);
  const description = getDescription(data);
  const image = getImage(data);
  const location = getLocation(data);
  const category = getCategory(data);
  const price = getPrice(data);
  const rating = getRating(data);
  const latLng = getLatLng(data);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <Link to={backPath} className="text-sm text-teal-600 hover:underline inline-flex items-center gap-1 mb-6">
        ← {backLabel}
      </Link>

      {loading && <LoadingState label="Loading details…" />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <article className="bg-white rounded-xl2 border border-sage-300 overflow-hidden shadow-soft">
          <div className="relative h-56 sm:h-72 bg-sage-100 flex items-center justify-center">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <CategoryIcon type={type} className="!w-16 !h-16" bg="bg-teal-400" />
            )}
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-teal-700 mb-2">
              {name || 'Untitled'}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {location && (
                <span className="text-sm text-teal-400 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                  {location}
                </span>
              )}
              {category && (
                <span className="text-xs font-medium text-teal-600 bg-sage-100 px-2 py-1 rounded-full">
                  {category}
                </span>
              )}
              {rating !== undefined && (
                <span className="text-xs font-mono text-teal-600">★ {rating}</span>
              )}
              {price !== undefined && (
                <span className="text-xs font-mono text-gold-600 font-medium">{price}</span>
              )}
            </div>

            {description && <p className="text-ink/80 leading-relaxed">{description}</p>}

            {latLng && (
              <div className="mt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${latLng.lat},${latLng.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  );
}
