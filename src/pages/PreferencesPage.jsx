import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMyPreferences, updateMyPreferences } from '../api/preferences.js';
import { getErrorMessage } from '../utils/apiError.js';
import { getStates, getCitiesByState } from '../api/destinations.js';

const INTERESTS = [
  'Nature', 'Adventure', 'History', 'Culture', 'Food', 'Photography',
  'Wildlife', 'Shopping', 'Spirituality', 'Architecture', 'Beaches',
  'Mountains', 'Art', 'Local Experiences', 'Relaxation',
];

const MOODS = [
  'Peaceful', 'Adventurous', 'Relaxing', 'Exciting', 'Romantic',
  'Cultural', 'Spiritual', 'Social',
];

const TRAVELING_WITH = [
  { value: 'SOLO', label: 'Solo' },
  { value: 'FRIENDS', label: 'Friends' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'COUPLE', label: 'Couple' },
];

const BUDGETS = [
  { value: 'LOW', label: 'Budget' },
  { value: 'MEDIUM', label: 'Moderate' },
  { value: 'HIGH', label: 'Premium' },
];

function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
        selected
          ? 'bg-teal-600 text-base border-teal-600'
          : 'bg-white text-teal-600 border-sage-300 hover:bg-sage-100',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

export default function PreferencesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const isRequired = Boolean(location.state?.required);

  const [interests, setInterests] = useState([]);
  const [mood, setMood] = useState([]);
  const [travelingWith, setTravelingWith] = useState('');
  const [budget, setBudget] = useState('');
    const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [preferredState, setPreferredState] = useState('');
  const [preferredCity, setPreferredCity] = useState('');
  const [citiesLoading, setCitiesLoading] = useState(false);

  useEffect(() => {
    getStates()
      .then((data) => setStates(data || []))
      .catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (!preferredState) {
      setCities([]);
      return;
    }
    let cancelled = false;
    setCitiesLoading(true);
    getCitiesByState(preferredState)
      .then((data) => {
        if (!cancelled) setCities(data || []);
      })
      .catch(() => {
        if (!cancelled) setCities([]);
      })
      .finally(() => {
        if (!cancelled) setCitiesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [preferredState]);

  function handleStateChange(value) {
    setPreferredState(value);
    setPreferredCity(''); // reset city whenever state changes
  }

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getMyPreferences()
      .then((data) => {
        if (cancelled || !data) return;
        setInterests(data.interests ? data.interests.split(',').filter(Boolean) : []);
        setMood(data.mood ? data.mood.split(',').filter(Boolean) : []);
        setTravelingWith(data.travelingWith || '');
        setBudget(data.budgetLevel || '');
        setPreferredState(data.preferredState || '');
        setPreferredCity(data.preferredCity || '');
      })
      .catch(() => {
        // No existing preferences (or fetch failed) - start from a blank survey.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(list, setList, value) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function validate() {
    if (interests.length === 0) return 'Please select at least one interest.';
    if (mood.length === 0) return 'Please select at least one mood.';
    if (!travelingWith) return 'Please select who you\u2019re traveling with.';
    if (!budget) return 'Please select a budget.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationMsg = validate();
    setValidationError(validationMsg);
    if (validationMsg) return;

    setSubmitting(true);
    setError('');
    try {
      await updateMyPreferences({
        interests: interests.join(','),
        mood: mood.join(','),
        travelingWith,
        budgetLevel: budget,
        preferredState: preferredState || null,
        preferredCity: preferredCity || null,
      });
            navigate('/recommendations', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save your preferences. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-teal-400">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-teal-700 mb-1">
        Tell us how you like to travel
      </h1>
      <p className="text-teal-400 mb-8">
        {isRequired
          ? 'Complete this quick survey so we can personalize your recommendations.'
          : 'Update your preferences any time your trip plans change.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <section>
          <h2 className="font-display font-semibold text-teal-700 mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={interests.includes(item)}
                onClick={() => toggle(interests, setInterests, item)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-semibold text-teal-700 mb-3">Mood</h2>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={mood.includes(item)}
                onClick={() => toggle(mood, setMood, item)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-semibold text-teal-700 mb-3">Traveling with</h2>
          <div className="flex flex-wrap gap-2">
            {TRAVELING_WITH.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={travelingWith === opt.value}
                onClick={() => setTravelingWith(opt.value)}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-semibold text-teal-700 mb-3">Budget</h2>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={budget === opt.value}
                onClick={() => setBudget(opt.value)}
              />
            ))}
          </div>
        </section>

                <section>
          <h2 className="font-display font-semibold text-teal-700 mb-3">
            Preferred state (optional)
          </h2>
          <select
            value={preferredState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full sm:w-72 rounded-lg border border-sage-300 px-3 py-2 text-sm text-teal-700 bg-white"
          >
            <option value="">Any state</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </section>

        <section>
          <h2 className="font-display font-semibold text-teal-700 mb-3">
            Preferred city (optional)
          </h2>
          <select
            value={preferredCity}
            onChange={(e) => setPreferredCity(e.target.value)}
            disabled={!preferredState || citiesLoading}
            className="w-full sm:w-72 rounded-lg border border-sage-300 px-3 py-2 text-sm text-teal-700 bg-white disabled:opacity-50"
          >
            <option value="">
              {!preferredState ? 'Select a state first' : citiesLoading ? 'Loading…' : 'Any city'}
            </option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </section>

        {validationError && (
          <p className="text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{validationError}</p>
        )}
        {error && (
          <p className="text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="self-start px-6 py-3 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Saving…' : 'Save preferences'}
        </button>
      </form>
    </div>
  );
}