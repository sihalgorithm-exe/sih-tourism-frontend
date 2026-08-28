/**
 * Extracts a useful, user-facing message from an Axios error without
 * fabricating success or hiding what actually happened.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  if (error.response) {
    const { status, data } = error.response;

    // Backend error bodies aren't guaranteed to have a fixed shape across
    // endpoints, so check a few common fields before falling back.
    const backendMessage =
      (data && (data.message || data.error || data.detail)) || null;

    if (backendMessage) return backendMessage;

    switch (status) {
      case 400:
        return 'That request was invalid. Please check the details and try again.';
      case 401:
        return 'You need to be logged in to do that.';
      case 403:
        return "You don't have permission to do that.";
      case 404:
        return 'We couldn\u2019t find what you were looking for.';
      case 409:
        return 'That already exists or conflicts with existing data.';
      default:
        return `Request failed (status ${status}).`;
    }
  }

  if (error.request) {
    return 'Could not reach the server. Check your connection and that the backend is running.';
  }

  return error.message || fallback;
}
