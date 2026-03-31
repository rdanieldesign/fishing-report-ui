# Fishing Report UI — Claude Code Guide

## Project Overview

This repo contains an **Angular 12** frontend (current, being migrated) and will contain a **React + TypeScript + Vite** frontend (in progress, at `client-react/`).

The backend lives in a **separate repo**. This repo is frontend-only. All API calls target a REST backend; the base URL is configured via environment/proxy.

---

## Current Directory Structure

```
fishing-report-ui/
├── src/                         # Angular app (source of truth for API contracts)
│   └── app/
│       ├── auth/                # AuthService — token management
│       ├── entries/             # Entry CRUD, filter, list variants
│       ├── friends/             # Friend request/confirm workflow
│       ├── locations/           # Location CRUD
│       ├── my-entries/          # My Reports view service
│       ├── notifications/       # Notification badge / service
│       ├── shared/              # Shared components, interceptor, interfaces
│       ├── side-nav/            # Side navigation
│       ├── header/              # Header bar
│       ├── login/               # Login page
│       ├── signup/              # Signup page
│       └── user/                # User view service + user API service
├── client-react/                # React app (being built — Phase 1+)
│   └── src/
│       ├── api/                 # Axios API client + per-resource functions
│       ├── stores/              # Zustand stores
│       ├── types/               # TypeScript interfaces (copied from Angular as-is)
│       ├── hooks/               # Custom React hooks
│       ├── utils/               # Pure utility functions
│       ├── components/          # Reusable/leaf components
│       │   ├── layout/          # Header, SideNav
│       │   ├── shared/          # FormShell, FileUpload, ConfirmModal, etc.
│       │   ├── entries/         # FilterPanel
│       │   └── locations/       # LocationCreateForm, LocationCreateModal
│       └── pages/               # Route-level page components
└── CLAUDE.md                    # This file
```

---

## Stack (React App — follow exactly)

| Concern | Choice |
|---|---|
| Build tool | Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Server state / data fetching | React Query (`@tanstack/react-query`) |
| Client / shared state | Zustand |
| Forms | React Hook Form |
| HTTP client | Axios |
| Accessible primitives (modals, tabs) | Headless UI |
| Date formatting | Day.js |
| Toast / snackbar | Sonner (or equivalent lightweight lib) |
| Icons | lucide-react |

---

## Stack Modification Rule

**Do not add, remove, or swap any dependency without explicit user approval.**

If a new package would improve an implementation, stop and ask before installing or importing it. Once approved, add it to this table and proceed. Do not use workarounds (e.g. inline SVGs, hand-rolled utilities) to avoid raising the question — raise it and wait.

---

## Critical Rule — Preserve All API Contracts

**Do not modify any API endpoint URL, HTTP method, request payload shape, or response type.**

The existing TypeScript interfaces in `src/app/**/interfaces/` and `src/app/**/**.interface.ts` are the **single source of truth** for all API contracts. Copy them into `client-react/src/types/` unchanged. Never rename fields, change types, or add/remove properties.

### API Endpoints Reference

| Resource | Method | URL |
|---|---|---|
| Auth | POST | `/api/auth/login` |
| Auth | POST | `/api/auth/signup` |
| Reports (all) | GET | `/api/reports` |
| Reports (mine) | GET | `/api/reports/my-reports` |
| Report | GET | `/api/reports/:id` |
| Report | POST | `/api/reports` |
| Report | PUT | `/api/reports/:id` |
| Report | DELETE | `/api/reports/:id` |
| Locations | GET | `/api/locations` |
| Location | GET | `/api/locations/:id` |
| Location | POST | `/api/locations` |
| User (current) | GET | `/api/users/current` |
| User | GET | `/api/users/:id` |
| Users | GET | `/api/users` |
| Friends | GET | `/api/friends` |
| Friend requests | GET | `/api/friends/requests` |
| Pending requests | GET | `/api/friends/pending` |
| Friend options | GET | `/api/friends/options` |
| Friendship | PUT | `/api/friends` |
| Friendship | POST | `/api/friends` |

Auth header: `x-access-token: <token>` (set by Axios request interceptor)
401 responses → clear token + redirect to `/login` (Axios response interceptor)

---

## Migration Phase Tracker

### Phase 1 — Scaffolding ✅
- [x] `client-react/` directory created with Vite + React + TypeScript
- [x] `package.json` with all required dependencies
- [x] `vite.config.ts` (with proxy to backend for dev)
- [x] `tailwind.config.ts` + `postcss.config.ts`
- [x] `tsconfig.json` (strict mode)
- [x] `src/main.tsx` + `src/App.tsx`
- [x] `src/routes.tsx` — all routes wired with placeholder pages
- [x] Placeholder `LoginPage`, `SignupPage`, `EntryListPage`, `EntryCreatePage`, `EntryEditPage`, `EntryDetailPage`, `FriendsListPage`, `FriendsAddPage`
- [x] Placeholder `Header`, `SideNav`
- [x] `npm run dev` starts with no errors; all routes render; Tailwind applies

### Phase 2 — Shared Layer ✅
- [x] `src/api/apiClient.ts` — Axios instance with auth + 401 interceptors
- [x] `src/api/authApi.ts`
- [x] `src/api/entryApi.ts`
- [x] `src/api/locationApi.ts`
- [x] `src/api/userApi.ts`
- [x] `src/api/friendApi.ts`
- [x] `src/stores/authStore.ts` — Zustand, token persisted to localStorage
- [x] `src/types/auth.types.ts`
- [x] `src/types/entry.types.ts`
- [x] `src/types/location.types.ts`
- [x] `src/types/user.types.ts`
- [x] `src/types/friend.types.ts`
- [x] `src/types/filter.types.ts`
- [x] `src/types/fileUpload.types.ts`
- [x] `src/types/generic.types.ts`
- [x] `src/hooks/useNotifications.ts`
- [x] `src/hooks/useImageSrc.ts`
- [x] `src/utils/filterUtils.ts`
- [x] TypeScript compiles with no errors across the shared layer

### Phase 3 — Leaf Components ✅
- [x] `components/layout/Header.tsx`
- [x] `components/layout/SideNav.tsx`
- [x] `components/shared/FormShell.tsx`
- [x] `components/shared/FileUpload.tsx`
- [x] `components/shared/FooterBreadcrumb.tsx`
- [x] `components/shared/NotificationBadge.tsx`
- [x] `components/shared/ConfirmModal.tsx` — built in Phase 4 (Headless UI Dialog, parent-owned open state)
- [x] `components/entries/FilterPanel.tsx`
- [x] `components/locations/LocationCreateForm.tsx`
- [x] `components/locations/LocationCreateModal.tsx`
- [x] TypeScript compiles with no errors (`tsc --noEmit` → exit 0)

### Phase 4 — Container / Page Components ✅
- [x] `pages/LoginPage.tsx` — form + mutation + redirect
- [x] `pages/SignupPage.tsx` — form + password validation + mutation
- [x] `pages/EntryListPage.tsx` — polymorphic list (all / mine / user / location)
- [x] `pages/EntryDetailPage.tsx` — query + author-gated actions
- [x] `pages/EntryCreatePage.tsx` — form + draft + location modal + mutation
- [x] `pages/EntryEditPage.tsx` — prefill from query + mutation
- [x] `pages/FriendsListPage.tsx` — three queries + tabs + mutations
- [x] `pages/FriendsAddPage.tsx` — query + mutation
- [x] `App.tsx` — Header + SideNav already wired via AppLayout in routes.tsx (Phase 1); no changes needed
- [x] App is fully functional end-to-end (no auth guard yet)

### Phase 5 — Auth and Protected Routes ✅
- [x] `components/auth/RequireAuth.tsx` — redirects to `/login` if no token
- [x] `components/auth/RedirectIfAuth.tsx` — redirects to `/entries` if already authenticated
- [x] Routes updated: login/signup wrapped in `RedirectIfAuth`; all app routes wrapped in `RequireAuth`
- [x] Axios 401 interceptor clears token + navigates to `/login`
  - `window.location.href` removed; `clearToken()` is sufficient — `RequireAuth` reacts to the Zustand store and redirects automatically
- [x] Unauthenticated access to any protected route redirects correctly
- [x] Logout clears token and redirects immediately (wired in `SideNav` since Phase 3)

---

## Notes for Future Sessions

- The Angular app at `src/` is **read-only reference** once migration begins — do not modify it.
- The `EntryListPage` is one component serving four routes; use `useParams` and `useMatch` to determine which data to fetch and which heading/buttons to show.
- The Angular `EntryListViewService` abstraction (polymorphic DI) is replaced entirely by URL-driven conditional logic in `EntryListPage`.
- `FileUpload` is the most complex leaf component — it must handle both **new files** (File objects) and **existing images** (imageURL + imageId from the API) simultaneously, and integrate with React Hook Form via `Controller`.
- Draft saving in `EntryCreatePage`: use React Hook Form `watch()` in a `useEffect` to persist to `localStorage` key `fishing-report-draft`.
- Report images are submitted as `FormData` (multipart). The Axios `Content-Type` header for these requests should be left unset (browser sets it automatically with boundary).
