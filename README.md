# Fishing Report UI

A React + TypeScript frontend for the Fishing Report app. Built with Vite, Tailwind CSS, React Query, and Zustand.

## Stack

| Concern | Library |
|---|---|
| Build tool | Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Server state | React Query (`@tanstack/react-query`) |
| Client state | Zustand |
| Forms | React Hook Form |
| HTTP client | Axios |
| Accessible primitives | Headless UI |
| Date formatting | Day.js |
| Toasts | Sonner |
| Icons | lucide-react |

## Development

Requires the backend API running at `http://localhost:3000`. The dev server proxies all `/api` requests there automatically.

```bash
npm install
npm run dev
```

Navigate to `http://localhost:5173/`.

## Build

```bash
npm run build
```

Output goes to `dist/`. Run `npm run preview` to serve the production build locally.

## Type checking

```bash
npm run typecheck
```
