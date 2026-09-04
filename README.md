# Courtly

Mobile app for browsing sports facilities and booking courts. Built with Expo for the Hyge take home test (Software Engineer, App & Web Focused).

This boilerplate currently covers onboarding and auth (register, login, secure token storage, protected routing). Facility browsing, availability, and bookings are built next on top of this foundation.

## Tech stack

- Expo SDK 57, React Native, TypeScript strict mode
- Expo Router for file based navigation and protected route handling
- Axios for HTTP, wrapped in a single shared client
- TanStack Query for all server state
- Zustand for auth state only (token, current user)
- React Hook Form and Zod for form handling and validation

## Getting started

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` to open an Android or iOS simulator.

## Architecture

Feature based structure, not a components or screens split by file type.

```
/app              Expo Router routes, grouped into (auth) and (app)
/features
  /auth           login, register, auth schemas and hooks
/shared
  /components     reusable UI primitives (Button, TextField)
  /constants      theme tokens
  /utils          error helpers
/services
  /api            typed API client, one file per resource
/store            Zustand auth store
```

Server state goes through TanStack Query exclusively. Client state (auth token, current user) goes through Zustand, kept minimal so server data never leaks into it.

### API client

`services/api/client.ts` wraps a single Axios instance. A request interceptor injects the `Authorization` header on any call made with `auth: true`, and a response interceptor normalizes both error shapes the API returns into one typed `ApiError` (a `code` field for auth and conflict errors, an array `message` for validation errors).

Expired or invalid tokens are handled centrally: when an authenticated request comes back 401, the response interceptor calls a registered `onUnauthorized` handler which clears the stored token, and the root layout's `Stack.Protected` guard redirects to login. No screen handles this individually.

### Auth flow

`app/_layout.tsx` hydrates the auth store from `expo-secure-store` on launch, then renders either the `(auth)` or `(app)` route group behind `Stack.Protected`. There is no manual redirect logic scattered through screens, the guard on the stack does it.

## Expo modules used so far

- `expo-secure-store`, stores the JWT and the current user object. Chosen because token storage needs to be secure, not AsyncStorage, this is close to mandatory for the auth requirement.
- `expo-haptics`, feedback on sign in and sign up submit. Small polish, cheap to add.
- `expo-router`, file based navigation with typed routes and the `Stack.Protected` API for auth gated routing.

More modules (`expo-image`, `expo-haptics` on booking actions, possibly `expo-calendar`) get added as the facility and booking features land, documented here as they're introduced per the brief.

## API integration notes

Base URL: `https://courtly-api.hyge.web.id`, Swagger at `/api/docs`.

Error responses vary by status: 401 and 409 include a `code` field, 400 validation errors return `message` as a string array instead of a single string. The client normalizes both into `ApiError.message`.

## Known constraints

`expo` and `expo-router` are pinned one patch version below the latest release (`57.0.19` and `57.0.18` respectively) because the newest patch versions were published within Yarn's package quarantine window at the time this project was set up. Both are excluded from `expo install --check` version validation in `package.json` for this reason, bump them once the newer patches have aged past quarantine.

## Android build

Not built yet. The internal Android build will be committed at `releases/courtly-android.apk` once the core flow is complete, no Expo Go links, QR codes, or screen recordings per the brief.
