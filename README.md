# Courtly

Mobile app for browsing sports facilities and booking courts. Built with Expo for the Hyge take home test (Software Engineer, App & Web Focused).

This boilerplate currently covers onboarding and auth (register, login, secure token storage, protected routing). Facility browsing, availability, and bookings are built next on top of this foundation.

## Tech stack

- Expo SDK 57, React Native, TypeScript strict mode
- Expo Router for file based navigation and protected route handling
- Axios for HTTP, wrapped in a shared client factory
- TanStack Query for all server state
- Zustand for auth state only (token, current user)
- React Hook Form and Zod for form handling and validation

## Prerequisites

- Node.js 20 or newer, npm
- Xcode (for iOS Simulator) on macOS, or Android Studio (for the Android emulator) on any platform
- A physical device with Expo Go is also fine for quick checks, but native modules used here (`expo-secure-store`, `expo-haptics`) need a development build to fully work, Expo Go covers most of it for iteration

## Setup

```bash
npm install
cp .env.example .env
```

`.env` holds `EXPO_PUBLIC_COURTLY_API_URL`, the API base URL. It is gitignored, `.env.example` is the tracked template. The default value already points at the take home test API, only change it if the API moves.

## Running the app

### Start Metro

```bash
npx expo start
```

This opens the Expo CLI dev server. From there:

- Press `i` to launch iOS Simulator (macOS only, needs Xcode installed)
- Press `a` to launch an Android emulator (needs Android Studio with at least one AVD created, see below)
- Scan the QR code with the Expo Go app on a physical device for the fastest iteration loop

If you edit `.env`, stop Metro and restart with `npx expo start --clear`, environment variables are read once at startup and cached.

### iOS Simulator, first time setup

```bash
xcrun simctl list devices available   # see what is already installed
```

If nothing suitable is listed, open Xcode, go to Settings (Cmd+,) then Components, and download an iOS Simulator runtime that matches the SDK your Xcode ships (`xcodebuild -showsdks` shows it under `iOS Simulator SDKs`). A runtime mismatch here is the most common reason `expo run:ios` fails with `Unable to find a destination matching the provided destination specifier`, Xcode only offers physical devices as build targets if no simulator runtime matches its bundled SDK.

Once a runtime is installed, `npx expo start` then pressing `i` boots a simulator and installs the app automatically.

### Android emulator, first time setup

Install Android Studio, then under More Actions > Virtual Device Manager create a device (any recent Pixel profile with a current API level works).

The Expo and React Native CLIs need `ANDROID_HOME` set to find the SDK, `adb`, and the `emulator` binary. If `npx expo run:android` or pressing `a` in `expo start` fails with `No Android connected device found, and no emulators could be started automatically` even though a device exists in Android Studio, this env var is almost always the reason. Add it to your shell profile (`~/.zshrc` on macOS with zsh):

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
```

Restart the terminal (or `source ~/.zshrc`), then confirm it worked:

```bash
adb devices          # should run without error, empty list is fine if nothing is booted yet
emulator -list-avds  # shows the device names you created in Android Studio
```

Start a specific emulator by name, or just let Expo boot one automatically:

```bash
emulator -avd <your_avd_name>
```

With the emulator running (or even without, once `ANDROID_HOME` is set Expo can boot one itself), `npx expo start` then pressing `a` installs and opens the app.

## Building a development client

The Expo Go app cannot load custom native modules configured through config plugins in some cases, and this project also needs a real native build for release testing. To build and install a debug development client directly to a connected simulator or emulator:

```bash
npx expo run:ios       # builds native iOS project under ./ios, installs to Simulator
npx expo run:android   # builds native Android project under ./android, installs to emulator or device
```

Both commands run `expo prebuild` under the hood the first time, generating the `ios/` and `android/` native folders (both gitignored, regenerate with `npx expo prebuild --clean` if they get into a bad state). This is a managed workflow project, native folders are not committed, `app.json` and the Expo config plugins are the source of truth.

### Android build needs Java 17 or 21, not newer

If `npx expo run:android` fails during `configureCMakeDebug` with `WARNING: A restricted method in java.lang.System has been called`, the Gradle build is running on a JDK newer than what the Android Gradle Plugin and NDK toolchain support (Java 25 reproduces this, Java 21 does not). Check what is active and point `JAVA_HOME` at a supported version just for the build if your default `java` is newer:

```bash
java -version                        # check what's currently active
brew install openjdk@21              # if not already installed

JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home" \
PATH="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home/bin:$PATH" \
npx expo run:android
```

This does not change your global `java`, it only overrides the JDK for that one command.

## Building the Android APK

The brief requires an internal Android build committed at `releases/courtly-android.apk`, no Expo Go links, no QR codes.

### Option A: EAS Build (recommended, builds in the cloud)

```bash
npm install -g eas-cli
eas login
eas build:configure          # first time only, creates eas.json
eas build --platform android --profile preview
```

Add a `preview` profile to `eas.json` that produces an APK rather than an AAB, EAS defaults to AAB for Android which is not directly installable:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

When the build finishes, download the artifact and place it at `releases/courtly-android.apk`:

```bash
eas build:download --platform android --profile preview --output releases/courtly-android.apk
```

### Option B: local Gradle build (no EAS account needed)

```bash
npx expo prebuild --platform android    # generates ./android if not already there
cd android
./gradlew assembleRelease
```

The unsigned or debug-signed APK lands at `android/app/build/outputs/apk/release/app-release.apk` (or `debug/app-debug.apk` for a debug build). Copy it into the repo:

```bash
cp android/app/build/outputs/apk/release/app-release.apk ../releases/courtly-android.apk
```

A release build needs a signing config (`android/app/build.gradle` plus a keystore) to install cleanly on devices with Play Protect, a debug build skips that and is fine for an internal take home submission.

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
  /api            typed API clients, one HTTP client per backend service
/store            Zustand auth store
```

Server state goes through TanStack Query exclusively. Client state (auth token, current user) goes through Zustand, kept minimal so server data never leaks into it.

### API client

The HTTP layer is split so a new backend service can be added without touching the existing one:

- `services/api/http-client.ts`, exports `createHttpClient(config)`, a factory that builds one configured Axios instance (base URL, request interceptor for auth header injection, response interceptor that normalizes every error into a typed `ApiError`).
- `services/api/http.ts`, exports `createHttpMethods(instance)`, wraps a given Axios instance with `get` / `post` / `put` / `patch` / `del` helpers.
- `services/api/courtly-client.ts`, the only service specific file today. Instantiates `createHttpClient` with `EXPO_PUBLIC_COURTLY_API_URL` and exports `courtly`, the ready to use method set for the Courtly API.
- `services/api/auth.ts`, calls `courtly.post(...)` for the two auth endpoints.

Adding a second backend later means adding one more file like `courtly-client.ts` with its own base URL and auth wiring, not modifying the shared factory.

Error responses vary by status: 401 and 409 include a `code` field, 400 validation errors return `message` as a string array instead of a single string. The client normalizes both into `ApiError.message`.

Expired or invalid tokens are handled centrally: when a request made with `{ auth: true }` comes back 401, the response interceptor calls a registered `onUnauthorized` handler which clears the stored token, and the root layout's `Stack.Protected` guard redirects to login. No screen handles this individually.

### Auth flow

`app/_layout.tsx` hydrates the auth store from `expo-secure-store` on launch, then renders either the `(auth)` or `(app)` route group behind `Stack.Protected`. There is no manual redirect logic scattered through screens, the guard on the stack does it.

## Expo modules used so far

- `expo-secure-store`, stores the JWT and the current user object. Chosen because token storage needs to be secure, not AsyncStorage, this is close to mandatory for the auth requirement.
- `expo-haptics`, feedback on sign in and sign up submit. Small polish, cheap to add.
- `expo-router`, file based navigation with typed routes and the `Stack.Protected` API for auth gated routing.

More modules (`expo-image`, `expo-haptics` on booking actions, possibly `expo-calendar`) get added as the facility and booking features land, documented here as they're introduced per the brief.

## Known constraints

`expo` and `expo-router` are pinned one patch version below the latest release (`57.0.19` and `57.0.18` respectively) because the newest patch versions were published within Yarn's package quarantine window at the time this project was set up. Both are excluded from `expo install --check` version validation in `package.json` for this reason, bump them once the newer patches have aged past quarantine.

## Android build status

Not built yet. The internal Android build will be committed at `releases/courtly-android.apk` once the core flow is complete, no Expo Go links, QR codes, or screen recordings per the brief.
