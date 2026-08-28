import React from 'react';

const paths = {
  destination: 'M13 4C9.13 4 6 7.13 6 11c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7Z',
  food: 'M7 3v7a2 2 0 0 0 2 2h0v9M7 3v6M9 3v6M11 3v6M17 3c-2 0-3.5 1.8-3.5 4.5S15 11 15 11v10',
  hotel: 'M3 21V7l7-4 7 4v14M3 21h18M9 21v-6h4v6M13 9h.01M9 9h.01',
  shopping: 'M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Zm3 0V6a3 3 0 0 1 6 0v2',
  transport: 'M4 17h16M6 17v2M18 17v2M5 17l1.2-6.4A2 2 0 0 1 8.16 9h7.68a2 2 0 0 1 1.96 1.6L19 17M8 13h8',
};

export default function CategoryIcon({ type = 'destination', className = '', bg = 'bg-teal-600' }) {
  const d = paths[type] || paths.destination;
  return (
    <span className={`pin-badge ${bg} w-9 h-9 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={d} stroke="#FAF9F6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
