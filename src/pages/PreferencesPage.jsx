import React, { useEffect, useState } from 'react';
import { getMyPreferences, updateMyPreferences } from '../api/preferences.js';
import { LoadingState, ErrorState } from '../components/StateViews.jsx';
import { getErrorMessage } from '../utils/apiError.js';

const BUDGET_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];

export default function PreferencesPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    interests: '',
    budgetLevel: '',
    preferredCategory: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMyPreferences()
      .then((data) => {
        if (cancelled) return;
        // API.md: "If the user has not configured preferences yet, no
        // preference record is returned." Treat any falsy response as
        // "not set up yet" rather than an error.
        if (data) {
          setForm({
            interests: data.interests || '',
            budgetLevel: data.budgetLevel || '',
            preferredCategory: data.preferredCategory || '',
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      const saved = await updateMyPreferences(form);
      setForm({
        interests: saved.interests || '',
        budgetLevel: saved.budgetLevel || '',
        preferredCategory: saved.preferredCategory || '',
      });
      setSaved(true);
    } catch (err) {
      setSaveError(getErrorMessage(err, 'Could not save your preferences.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-16">
        <LoadingState label="Loading your preferences…" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-16">
        <ErrorState message={loadError} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-teal-700 mb-1">Your preferences</h1>
      <p className="text-teal-400 mb-8">
        Used to personalize your recommendations. Saving updates them immediately.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="block">
          <span className="text-sm font-medium text-teal-700">Interests</span>
          <input
            type="text"
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="heritage, food, nature"
            className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <span className="mt-1 block text-xs text-teal-400">Comma-separated.</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-teal-700">Budget level</span>
          <select
            name="budgetLevel"
            value={form.budgetLevel}
            onChange={handleChange}
            className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">Not set</option>
            {BUDGET_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-teal-700">Preferred category</span>
          <input
            type="text"
            name="preferredCategory"
            value={form.preferredCategory}
            onChange={handleChange}
            placeholder="Heritage"
            className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </label>

        {saveError && (
          <p className="text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{saveError}</p>
        )}
        {saved && (
          <p className="text-sm text-teal-600 bg-sage-100 rounded-lg px-3 py-2">Preferences saved.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving…' : 'Save preferences'}
        </button>
      </form>
    </div>
  );
}
