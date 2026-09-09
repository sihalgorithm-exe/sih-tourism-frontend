import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasCompletedPreferences } from '../api/preferences.js';
import { LoadingState, ErrorState } from '../components/StateViews.jsx';

/**
 * Gatekeeper page: checks whether the logged-in user has saved
 * preferences and redirects accordingly. Renders no persistent UI of
 * its own - it only decides where to send the user.
 */
export default function ForYouPage() {
  const navigate = useNavigate();
  const [checkError, setCheckError] = useState('');

  useEffect(() => {
    let cancelled = false;

    hasCompletedPreferences()
      .then((completed) => {
        if (cancelled) return;
        navigate(completed ? '/recommendations' : '/preferences', { replace: true });
      })
      .catch(() => {
        if (!cancelled) setCheckError('Could not check your preferences right now.');
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (checkError) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-16">
        <ErrorState message={checkError} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-16">
      <LoadingState label="Checking your preferences…" />
    </div>
  );
}