export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1];
    const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));

    if (!payload.exp) return false; 

    const nowInSeconds = Date.now() / 1000;
    return payload.exp < nowInSeconds;
  } catch {
    return true;
  }
}