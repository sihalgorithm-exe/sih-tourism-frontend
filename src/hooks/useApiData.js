import { useEffect, useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/apiError';

/**
 * Runs an async fetcher on mount (and whenever deps change), exposing
 * { data, loading, error, refetch }. Does not fabricate fallback data on
 * failure — `data` stays null and `error` carries the real message.
 *
 * @param {() => Promise<any>} fetcher
 * @param {any[]} deps
 */
export function useApiData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  return { data, loading, error, refetch: load };
}
