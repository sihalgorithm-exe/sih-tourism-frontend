import React, { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../api/users.js';
import { getErrorMessage } from '../utils/apiError.js';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;
    getMyProfile()
      .then((data) => {
        if (cancelled) return;
        setName(data.name || '');
        setEmail(data.email || '');
        setRole(data.role || '');
        setCreatedAt(data.createdAt || '');
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load your profile.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateMyProfile({ name });
      setName(updated.name);
      setSuccess('Profile updated.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update your profile. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-teal-400">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-teal-700 mb-1">My Profile</h1>
      <p className="text-teal-400 mb-8">Manage your account details.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm text-teal-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-teal-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-lg border border-sage-300 px-3 py-2 text-sm text-teal-400 bg-sage-50"
          />
          <p className="text-xs text-teal-400 mt-1">Email changes aren&apos;t supported yet.</p>
        </div>

        <div className="text-sm text-teal-400">
          <p>Role: {role}</p>
          {createdAt && <p>Member since: {new Date(createdAt).toLocaleDateString()}</p>}
        </div>

        {error && (
          <p className="text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-teal-700 bg-sage-100 rounded-lg px-3 py-2">{success}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="self-start px-6 py-3 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}