import React from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon.jsx';
import {
  getName,
  getDescription,
  getImage,
  getLocation,
  getCategory,
  getPrice,
  getRating,
  getId,
} from '../utils/fields.js';

/**
 * Renders whatever fields the backend actually returned for this object.
 * Nothing is assumed to exist — see utils/fields.js.
 */
export default function PlaceCard({ item, basePath, type }) {
  const id = getId(item);
  const name = getName(item) || 'Untitled';
  const description = getDescription(item);
  const image = getImage(item);
  const location = getLocation(item);
  const category = getCategory(item);
  const price = getPrice(item);
  const rating = getRating(item);

  const content = (
    <div className="group h-full flex flex-col bg-white rounded-xl2 border border-sage-300 overflow-hidden shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <div className="relative h-40 bg-sage-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CategoryIcon type={type} bg="bg-teal-400" />
          </div>
        )}
        {rating !== undefined && (
          <span className="absolute top-2 right-2 bg-base/90 text-teal-600 text-xs font-mono font-medium px-2 py-1 rounded-full">
            ★ {rating}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-teal-700 leading-snug">{name}</h3>
        </div>

        {location && (
          <p className="text-xs text-teal-400 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            {location}
          </p>
        )}

        {description && (
          <p className="text-sm text-ink/70 line-clamp-2">{description}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          {category && (
            <span className="text-xs font-medium text-teal-600 bg-sage-100 px-2 py-1 rounded-full">
              {category}
            </span>
          )}
          {price !== undefined && (
            <span className="text-xs font-mono text-gold-600 font-medium">{price}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (id === undefined) return content;

  return (
    <Link to={`${basePath}/${id}`} className="block h-full">
      {content}
    </Link>
  );
}
