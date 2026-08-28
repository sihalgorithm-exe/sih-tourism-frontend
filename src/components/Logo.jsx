import React from 'react';

/**
 * Wordmark + pin glyph. The pin-with-ring motif is the app's signature
 * element, echoed later in the group-safety radius visualization.
 */
export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="13" cy="13" r="12" stroke="#D4A24E" strokeWidth="1.4" opacity="0.5" />
        <path
          d="M13 4C9.13 4 6 7.13 6 11c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7Z"
          fill="#0F3D3E"
        />
        <circle cx="13" cy="11" r="2.6" fill="#FAF9F6" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight text-teal-600">
        Wayfare
      </span>
    </div>
  );
}
