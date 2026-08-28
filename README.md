# Wayfare — Tourism Frontend

React + Vite + JavaScript (no TypeScript) frontend for the existing Spring Boot
tourism backend at `sihalgorithm-exe/sih-tourism-backend`. Built strictly
against `API.md` — no endpoints, fields, or auth behavior were invented.

## Setup

```bash
npm install
cp .env.example .env
# edit .env: set VITE_API_BASE_URL to your running backend, e.g.
# VITE_API_BASE_URL=http://localhost:8080/api
npm run dev
```

The app runs at `http://localhost:5173` by default. Make sure the backend is
running and reachable at the URL you set in `.env`, and that its CORS
configuration allows requests from the frontend's origin (this frontend does
not and should not attempt to modify backend CORS config).

## Project structure

```
src/
  api/            one file per resource, thin wrappers around axios calls
                  matching API.md exactly (auth, destinations, food, hotels,
                  shopping, transport, groups, recommendations, preferences)
  context/        AuthContext — owns the JWT + user, persists to localStorage
  components/     shared UI (Navbar, cards, form field, state views, icons)
  hooks/          useApiData (loading/error/data), useGeolocation
  pages/          one page per route; ListingPage/DetailPage are generic
                  and reused by destinations/food/hotels/shopping/transport
  utils/          apiError (user-facing error messages), fields (defensive
                  field access for entity objects), groupHistory (local
                  convenience list of visited group IDs — not backend data)
```

## Auth

- JWT is stored in `localStorage` under `authToken`; user summary under
  `authUser`.
- Every request through `src/api/axiosClient.js` attaches
  `Authorization: Bearer <token>` automatically when a token is present.
- A `401` response anywhere clears the stored session and surfaces a
  "session expired" message on next visit to `/login`.
- The frontend never sends a user ID to endpoints that derive identity from
  the JWT (groups, locations, alerts, recommendations, preferences) — this
  matches API.md's explicit note that the client must not do this.

## Data model safety

`API.md` doesn't pin down the exact fields on `Destination`, `FoodPlace`,
`Hotel`, `ShoppingPlace`, or `TransportOption` beyond "an object of this
type." Rather than guessing a schema and risking `undefined` rendering
everywhere, `src/utils/fields.js` reads a small set of plausible key names
per concept (e.g. `name`/`title`/`placeName`) and simply omits the UI
element if none are present. If your backend's actual field names don't
match what's tried there, the fix is to add the real key name to the
relevant `pick(...)` list in `fields.js` — nothing else needs to change.

**Action needed from you:** once you run this against the live backend,
check the Network tab for one real response per resource type and tell me
the actual field names if they differ from what's covered — I'll update
`fields.js` precisely rather than guessing further.

## Groups feature

API.md exposes create/get-by-id for groups but no "list my groups"
endpoint. So:
- `/groups` lets you create a new group (navigates to its detail page) or
  open an existing one by ID.
- Recently created/opened group IDs are remembered in `localStorage`
  (`utils/groupHistory.js`) purely as a navigation convenience — this is
  not backend data and is never presented as such.
- On a group's detail page, the "Add member," and "Safety alerts" sections
  only render for the user identified as leader (`group.leaderId === user.userId`
  from the JWT-derived session) — this is a UX convenience only. The actual
  authorization boundary is enforced server-side per API.md (403 responses
  are surfaced as-is, not hidden).

## What was not implemented / needs your input

- **Google Maps Platform**: an env var (`VITE_GOOGLE_MAPS_API_KEY`) is
  wired up as a placeholder, but no live Maps JS SDK embed was added since
  I can't test API-key-gated network calls in this environment. Detail
  pages currently link out to Google Maps search using lat/lng if the
  backend returns coordinates. If you want an embedded interactive map
  instead, share your Maps API key setup and I'll wire it in.
- **Not tested against a running backend** — I don't have network access
  in this environment. Please run through the verification checklist
  (register → login → JWT sent → each listing loads → recommendations →
  preferences GET/PUT → group create/access → location submit → alerts)
  and report back the exact endpoint/status/response for anything that
  fails, per your instructions — I will not guess at backend behavior to
  "fix" a mismatch.
