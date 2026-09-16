import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import {
  getGroup,
  getGroupMembers,
  submitGroupLocation,
  getGroupAlerts,
  getMyGuardStatus,
  submitGuardResponse, } from '../api/groups.js';
import { rememberGroupId } from '../utils/groupHistory.js';
import { LoadingState, ErrorState } from '../components/StateViews.jsx';
import { getErrorMessage } from '../utils/apiError.js';
import { useNavigate } from 'react-router-dom';
import { leaveGroup, terminateGroup } from '../api/groups.js';

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

function GuardPromptCard({ groupId }) {
  const [status, setStatus] = useState(null);
  const [responding, setResponding] = useState(false);
  const [respondError, setRespondError] = useState('');

  const poll = useCallback(() => {
    getMyGuardStatus(groupId)
      .then(setStatus)
      .catch(() => {}); // silent - this is a background poll, not a user-triggered action
  }, [groupId]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 15000); // reuses the same manual-refresh data source, just automated
    return () => clearInterval(interval);
  }, [poll]);

  async function respond(response) {
    setRespondError('');
    setResponding(true);
    try {
      await submitGuardResponse(groupId, response);
      poll();
    } catch (err) {
      setRespondError(getErrorMessage(err, 'Could not send your response.'));
    } finally {
      setResponding(false);
    }
  }

  if (!status || (status.guardStatus !== 'PENDING_RESPONSE' && status.guardStatus !== 'NO_RESPONSE')) {
    return null;
  }

  const canDirectToGroup =
    status.myLatitude != null && status.myLongitude != null &&
    status.leaderLatitude != null && status.leaderLongitude != null;

  return (
    <div className="bg-clay-50 border border-clay-300 rounded-xl2 p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-clay-700 mb-1">Are you lost?</h2>
      <p className="text-sm text-clay-600 mb-4">
        You appear to be outside your group's safe range.
        {status.guardStatus === 'NO_RESPONSE' && ' Your group leader has been notified that you have not responded yet.'}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => respond('SAFE')}
          disabled={responding}
          className="px-4 py-2 rounded-full font-semibold bg-sage-100 text-teal-700 hover:bg-sage-200 disabled:opacity-60"
        >
          I'm Safe
        </button>
        <button
          onClick={() => respond('LOST')}
          disabled={responding}
          className="px-4 py-2 rounded-full font-semibold bg-gold-100 text-teal-700 hover:bg-gold-200 disabled:opacity-60"
        >
          I'm Lost
        </button>
        <button
          onClick={() => respond('NEEDS_HELP')}
          disabled={responding}
          className="px-4 py-2 rounded-full font-semibold bg-clay-600 text-white hover:bg-clay-700 disabled:opacity-60"
        >
          I Need Help
        </button>
      </div>

      {respondError && (
        <p className="mt-3 text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">{respondError}</p>
      )}
    </div>
  );
}

function LostDirectionsCard({ groupId }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getMyGuardStatus(groupId).then(setStatus).catch(() => {});
  }, [groupId]);

  if (!status || status.guardStatus !== 'LOST') return null;
  if (status.myLatitude == null || status.leaderLatitude == null) return null;

  // Reuses the exact same external-Google-Maps-link pattern already used on
  // DetailPage.jsx - the project has no embedded map/directions component,
  // so this is the minimum integration rather than adding a new map system.
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${status.myLatitude},${status.myLongitude}&destination=${status.leaderLatitude},${status.leaderLongitude}`;

  return (
    <div className="bg-white border border-sage-300 rounded-xl2 p-6 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-teal-700 mb-1">Find your way back</h2>
      <p className="text-sm text-teal-400 mb-4">Get directions to your group leader's last known location.</p>
      
       <a href={directionsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-block px-5 py-2.5 rounded-full font-semibold bg-teal-600 text-white hover:bg-teal-700"
      >
        Get directions
      </a>
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
    const navigate = useNavigate();
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  async function handleLeave() {
    if (!window.confirm('Leave this group? You will stop being tracked and lose access to it.')) return;
    setActionError('');
    setActionLoading(true);
    try {
      await leaveGroup(group.groupId ?? groupId);
      navigate('/groups');
    } catch (err) {
      setActionError(getErrorMessage(err, 'Could not leave the group.'));
      setActionLoading(false);
    }
  }

  async function handleTerminate() {
    if (!window.confirm('Terminate this group for everyone? This cannot be undone.')) return;
    setActionError('');
    setActionLoading(true);
    try {
      await terminateGroup(group.groupId ?? groupId);
      navigate('/groups');
    } catch (err) {
      setActionError(getErrorMessage(err, 'Could not terminate the group.'));
      setActionLoading(false);
    }
  }

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
          <p className="text-sm text-teal-400 mt-1"> Group ID: <span className="font-mono font-semibold text-teal-700">{group.groupId}</span> </p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-sage-100 text-teal-700 text-xs font-medium">✓ You are in this group</div>
          <p className="text-sm text-ink/70 mt-1">
            Led by <span className="font-medium">{group.leaderName}</span>
            {isLeader && <span className="text-teal-600"> (you)</span>}
          </p>

                    <div className="mt-3">
            {isLeader ? (
              <button
                onClick={handleTerminate}
                disabled={actionLoading}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-clay-100 text-clay-700 hover:bg-clay-200 disabled:opacity-60 transition-colors"
              >
                {actionLoading ? 'Terminating…' : 'Terminate group'}
              </button>
            ) : (
              <button
                onClick={handleLeave}
                disabled={actionLoading}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-clay-100 text-clay-700 hover:bg-clay-200 disabled:opacity-60 transition-colors"
              >
                {actionLoading ? 'Leaving…' : 'Leave group'}
              </button>
            )}
          </div>
        </div>
      </div>

            {actionError && (
        <p className="mb-6 text-sm text-clay-600 bg-clay-100 rounded-lg px-3 py-2">
          {actionError}
        </p>
      )}

      <div className="grid gap-6">
        <GuardPromptCard groupId={group.groupId ?? groupId} />
        <LostDirectionsCard groupId={group.groupId ?? groupId} />
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
              <div className="flex flex-col items-end gap-1">
                {alert.alertType && alert.alertType !== 'OUT_OF_RANGE' && (
                  <span
                    className={
                      'text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ' +
                      (alert.alertType === 'NEEDS_HELP'
                        ? 'bg-clay-600 text-white'
                        : alert.alertType === 'NO_RESPONSE'
                        ? 'bg-clay-500 text-white'
                        : 'bg-gold-100 text-teal-700')
                    }
                  >
                    {alert.alertType === 'NEEDS_HELP' && 'Needs help'}
                    {alert.alertType === 'LOST' && "Reported lost"}
                    {alert.alertType === 'NO_RESPONSE' && 'No response'}
                  </span>
                )}
                <span className="font-mono text-sm text-clay-600 bg-clay-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {Math.round(alert.distanceMeters)}m away
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
