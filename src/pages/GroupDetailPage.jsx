import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import {
  getGroup,
  getGroupMembers,
  submitGroupLocation,
  getGroupAlerts,
} from '../api/groups.js';
import { rememberGroupId } from '../utils/groupHistory.js';
import { LoadingState, ErrorState } from '../components/StateViews.jsx';
import { getErrorMessage } from '../utils/apiError.js';

function RadiusBadge({ radiusMeters }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
      <span className="absolute inset-0 rounded-full bg-gold-100 ring-pulse" />
      <span className="absolute inset-2 rounded-full border-2 border-gold-500" />
      <span className="relative font-mono text-xs font-semibold text-teal-700 text-center leading-tight">
        {radiusMeters}m
      </span>
    </div>
  );
}

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGroup = useCallback(() => {
    setLoading(true);
    setError('');
    getGroup(groupId)
      .then((data) => {
        setGroup(data);
        rememberGroupId(data.groupId ?? groupId);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const isLeader = Boolean(group && user && group.leaderId === user.userId);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <LoadingState label="Loading group…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <ErrorState message={error} onRetry={loadGroup} />
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-4 bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft mb-8">
        <RadiusBadge radiusMeters={group.radiusMeters} />
        <div>
          <h1 className="font-display text-2xl font-semibold text-teal-700">{group.name}</h1>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-sage-100 text-teal-700 text-xs font-medium">✓ You are in this group</div>
          <p className="text-sm text-ink/70 mt-1">
            Led by <span className="font-medium">{group.leaderName}</span>
            {isLeader && <span className="text-teal-600"> (you)</span>}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <LocationShareCard groupId={group.groupId ?? groupId} />
        {isLeader && <MembersCard groupId={group.groupId ?? groupId} />}
        {isLeader && <AlertsCard groupId={group.groupId ?? groupId} />}
      </div>
    </div>
  );
}

function LocationShareCard({ groupId }) {
  const { coords, requestLocation, loading: geoLoading, error: geoError } = useGeolocation();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleShare() {
    setSubmitError('');
    setSubmitted(false);
    setSubmitting(true);
    try {
      const position = await requestLocation();
      await submitGroupLocation(groupId, position);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Could not share your location.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-teal-700 mb-1">Share your location</h2>
      <p className="text-sm text-teal-400 mb-4">
         Share your current location so GroupGuard can track your position relative to the group.
      </p>

      <button
        onClick={handleShare}
        disabled={submitting || geoLoading}
        className="px-5 py-2.5 rounded-full font-semibold bg-teal-600 text-base hover:bg-teal-700 disabled:opacity-60 transition-colors"
      >
        {submitting || geoLoading ? 'Sharing…' : 'Share current location'}
      </button>

      {coords && submitted && !submitError && (
        <p className="mt-3 text-sm text-teal-600 font-mono">
          Shared: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
        </p>
      )}
      {(geoError || submitError) && (
        <p className="mt-3 text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">
          {geoError || submitError}
        </p>
      )}
    </div>
  );
}

function MembersCard({ groupId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMembers = useCallback(() => {
    setLoading(true);
    setError('');

    getGroupMembers(groupId)
      .then(setData)
      .catch((err) =>
        setError(getErrorMessage(err, 'Could not load group members.'))
      )
      .finally(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return (
    <div className="bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft">

      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-lg font-semibold text-teal-700">
          Group members
        </h2>

        <button
          onClick={loadMembers}
          className="text-sm text-teal-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      <p className="text-sm text-teal-400 mb-4">
        See your teammates and their latest known locations.
      </p>

      {loading && <LoadingState label="Loading members…" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={loadMembers} />
      )}

      {!loading &&
        !error &&
        data &&
        Array.isArray(data.members) &&
        data.members.length === 0 && (
          <p className="text-sm text-teal-400 py-6 text-center">
            No members have joined yet.
          </p>
        )}

      {!loading &&
        !error &&
        data &&
        Array.isArray(data.members) &&
        data.members.length > 0 && (
          <ul className="flex flex-col divide-y divide-sage-300">

            {data.members.map((member) => (
              <li
                key={member.membershipId}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-ink">
                    {member.name}

                    {member.leader && (
                      <span className="ml-2 text-xs text-teal-600">
                        Leader
                      </span>
                    )}
                  </p>

                  {member.latitude != null &&
                    member.longitude != null ? (
                    <p className="text-xs text-teal-400 font-mono mt-1">
                      {member.latitude.toFixed(5)}, {member.longitude.toFixed(5)}
                    </p>
                  ) : (
                    <p className="text-xs text-teal-400 mt-1">
                      Location not shared yet
                    </p>
                  )}
                </div>

                <div className="text-right">

                  {member.distanceMeters != null ? (
                    <span className="font-mono text-sm text-teal-700 bg-sage-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {Math.round(member.distanceMeters)}m away
                    </span>
                  ) : member.leader ? (
                    <span className="text-xs text-teal-400">
                      Reference
                    </span>
                  ) : (
                    <span className="text-xs text-teal-400">
                      No distance
                    </span>
                  )}

                  {member.lastUpdated && (
                    <p className="text-xs text-teal-400 mt-1">
                      {new Date(member.lastUpdated).toLocaleTimeString()}
                    </p>
                  )}

                </div>
              </li>
            ))}

          </ul>
        )}
    </div>
  );
}

  return (
    <div className="bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-teal-700 mb-1">Add a member</h2>
      <p className="text-sm text-teal-400 mb-4">Only you, as leader, can add members.</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          className="flex-1 px-3.5 py-2.5 rounded-lg border border-sage-500 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-full font-semibold bg-gold-500 text-teal-700 hover:bg-gold-600 disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          {submitting ? 'Adding…' : 'Add member'}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="mt-3 text-sm text-teal-600 bg-sage-100 rounded-lg px-3 py-2">Member added.</p>
      )}
    </div>
  );


function AlertsCard({ groupId }) {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAlerts = useCallback(() => {
    setLoading(true);
    setError('');
    getGroupAlerts(groupId)
      .then(setAlerts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return (
    <div className="bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-lg font-semibold text-teal-700">Safety alerts</h2>
        <button
          onClick={loadAlerts}
          className="text-sm text-teal-600 hover:underline"
        >
          Refresh
        </button>
      </div>
      <p className="text-sm text-teal-400 mb-4">Members who moved outside the group radius.</p>

      {loading && <LoadingState label="Checking alerts…" />}
      {!loading && error && <ErrorState message={error} onRetry={loadAlerts} />}

      {!loading && !error && Array.isArray(alerts) && alerts.length === 0 && (
        <p className="text-sm text-teal-400 py-6 text-center">No alerts. Everyone's within range.</p>
      )}

      {!loading && !error && Array.isArray(alerts) && alerts.length > 0 && (
        <ul className="flex flex-col divide-y divide-sage-300">
          {alerts.map((alert) => (
            <li key={alert.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{alert.userName}</p>
                <p className="text-xs text-teal-400">
                  {new Date(alert.triggeredAt).toLocaleString()}
                </p>
              </div>
              <span className="font-mono text-sm text-clay-600 bg-clay-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                {Math.round(alert.distanceMeters)}m away
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
