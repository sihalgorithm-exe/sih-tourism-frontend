import { useCallback, useState } from 'react';

/**
 * Wraps the browser Geolocation API. Returns a function to request the
 * current position on demand, plus the latest coordinates/error/loading
 * state. Does not poll automatically — callers decide the cadence.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        const message = 'Geolocation is not supported by this browser.';
        setError(message);
        reject(new Error(message));
        return;
      }

      setLoading(true);
      setError('');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoords(next);
          setLoading(false);
          resolve(next);
        },
        (geoError) => {
          const message =
            geoError.code === geoError.PERMISSION_DENIED
              ? 'Location access was denied. Enable it in your browser settings to use this feature.'
              : 'Could not determine your location. Please try again.';
          setError(message);
          setLoading(false);
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  return { coords, error, loading, requestLocation };
}
