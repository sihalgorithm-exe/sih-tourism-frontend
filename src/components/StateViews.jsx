import React from 'react';

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-teal-400">
      <div className="relative w-10 h-10">
        <span className="absolute inset-0 rounded-full border-2 border-sage-300" />
        <span className="absolute inset-0 rounded-full border-2 border-t-teal-600 animate-spin" />
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-clay-100 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.32 20h17.36a1.5 1.5 0 0 0 1.21-2.96L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
            stroke="#9E4A50"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-clay-600 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 px-4 py-2 rounded-full text-sm font-semibold bg-teal-600 text-base hover:bg-teal-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center px-4">
      <p className="font-display text-lg text-teal-600">{title}</p>
      {message && <p className="text-sm text-teal-400 max-w-sm">{message}</p>}
      {action}
    </div>
  );
}
