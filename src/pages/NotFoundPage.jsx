import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-24 text-center">
      <p className="font-mono text-gold-600 mb-2">404</p>
      <h1 className="font-display text-3xl font-semibold text-teal-700 mb-3">
        This trail doesn&apos;t lead anywhere.
      </h1>
      <p className="text-teal-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
