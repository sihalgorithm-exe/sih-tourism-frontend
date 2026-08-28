/**
 * The backend's exact response fields for Destination / FoodPlace / Hotel /
 * ShoppingPlace / TransportOption are not pinned down in API.md beyond "an
 * object". Rather than guessing a schema, these helpers read a value only if
 * it is actually present on the object, trying a short list of plausible
 * key names for the same concept (common across many REST naming
 * conventions) and returning undefined otherwise. Nothing here invents data.
 */

export function pick(obj, keys) {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return undefined;
}

export function getName(obj) {
  return pick(obj, ['name', 'title', 'placeName']);
}

export function getDescription(obj) {
  return pick(obj, ['description', 'summary', 'details']);
}

export function getImage(obj) {
  export function getImage(obj) {
  const image = pick(obj, ['imgUrl', 'imageUrl', 'image', 'photoUrl', 'thumbnailUrl']);

  if (!image) return undefined;

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

  // Remove /api from the API base URL
  const backendBase = apiBase.replace(/\/api\/?$/, '');

  return `${backendBase}${image.startsWith('/') ? image : `/${image}`}`;
}
}

export function getLocation(obj) {
  return pick(obj, ['location', 'city', 'address', 'region']);
}

export function getCategory(obj) {
  return pick(obj, ['category', 'type', 'preferredCategory']);
}

export function getPrice(obj) {
  return pick(obj, ['price', 'priceLevel', 'cost']);
}

export function getRating(obj) {
  return pick(obj, ['rating', 'popularity', 'score']);
}

export function getLatLng(obj) {
  const lat = pick(obj, ['latitude', 'lat']);
  const lng = pick(obj, ['longitude', 'lng', 'lon']);
  if (lat !== undefined && lng !== undefined) return { lat: Number(lat), lng: Number(lng) };
  return null;
}

export function getId(obj) {
  return pick(obj, ['id']);
}
