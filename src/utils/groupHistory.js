const STORAGE_KEY = 'knownGroupIds';

export function getKnownGroupIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function rememberGroupId(id) {
  const ids = getKnownGroupIds();
  if (!ids.includes(id)) {
    const next = [id, ...ids].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
