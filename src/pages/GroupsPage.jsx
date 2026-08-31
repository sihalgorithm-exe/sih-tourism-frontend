import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../api/groups.js';
import { getKnownGroupIds, rememberGroupId } from '../utils/groupHistory.js';
import { getErrorMessage } from '../utils/apiError.js';

export default function GroupsPage() {
  const navigate = useNavigate();
  const knownIds = getKnownGroupIds();

  const [form, setForm] = useState({ name: '', radiusMeters: 500 });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [joinId, setJoinId] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'radiusMeters' ? Number(value) : value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      const group = await createGroup(form);
      rememberGroupId(group.groupId);
      navigate(`/groups/${group.groupId}`);
    } catch (err) {
      setCreateError(getErrorMessage(err, 'Could not create the group.'));
    } finally {
      setCreating(false);
    }
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!joinId.trim()) return;
    rememberGroupId(joinId.trim());
    navigate(`/groups/${joinId.trim()}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-teal-700 mb-1">Travel groups</h1>
      <p className="text-teal-400 mb-10">
        Keep your group together and get alerted if someone wanders off.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-teal-700 mb-4">Create a group</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <label className="block">
              <span className="text-sm font-medium text-teal-700">Group name</span>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Weekend Trip"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-teal-700">Safety radius (meters)</span>
              <input
                type="number"
                name="radiusMeters"
                required
                min={10}
                value={form.radiusMeters}
                onChange={handleChange}
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono"
              />
              <span className="mt-1 block text-xs text-teal-400">
                Members are alerted if they move beyond this distance from you.
              </span>
            </label>

            {createError && (
              <p className="text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{createError}</p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 disabled:opacity-60 transition-colors"
            >
              {creating ? 'Creating…' : 'Create group'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-teal-700 mb-4">Open a group</h2>
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <label className="block">
              <span className="text-sm font-medium text-teal-700">Group ID</span>
              <input
                type="text"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                placeholder="e.g. 4"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-sage-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono"
              />
              <span className="mt-1 block text-xs text-teal-400">
                Ask your group leader for the group ID to join.
              </span>
            </label>
            <button
              type="submit"
              className="py-2.5 rounded-full font-semibold bg-gold-500 text-teal-700 hover:bg-gold-600 transition-colors"
            >
              Open group
            </button>
          </form>

          {knownIds.length > 0 && (
            <div className="mt-6 pt-6 border-t border-sage-300">
              <p className="text-xs font-medium text-teal-400 mb-2">Recently visited:</p>
              <div className="flex flex-wrap gap-2">
                {knownIds.map((id) => (
                  <button
                    key={id}
                    onClick={() => navigate(`/groups/${id}`)}
                    className="text-sm font-mono px-3 py-1.5 rounded-full bg-sage-100 text-teal-600 hover:bg-sage-300 transition-colors"
                  >
                    #{id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
