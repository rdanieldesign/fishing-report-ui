# Fishing Report UI — Claude Code Guide

## Project Overview

This repo is a **React + TypeScript + Vite** frontend for the Fishing Report app.

The backend lives in a **separate repo**. This repo is frontend-only. All API calls target a REST backend; the base URL is configured via environment/proxy.

---

## Stack (React App — follow exactly)

| Concern                              | Choice                                 |
| ------------------------------------ | -------------------------------------- |
| Build tool                           | Vite                                   |
| Language                             | TypeScript (strict)                    |
| Styling                              | Tailwind CSS                           |
| Routing                              | React Router v6                        |
| Server state / data fetching         | React Query (`@tanstack/react-query`)  |
| Client / shared state                | Zustand                                |
| Forms                                | React Hook Form                        |
| HTTP client                          | Axios                                  |
| Accessible primitives (modals, tabs) | Headless UI                            |
| Date formatting                      | Day.js                                 |
| Toast / snackbar                     | Sonner (or equivalent lightweight lib) |
| Icons                                | lucide-react                           |

---

## Stack Modification Rule

**Do not add, remove, or swap any dependency without explicit user approval.**

If a new package would improve an implementation, stop and ask before installing or importing it. Once approved, add it to this table and proceed. Do not use workarounds (e.g. inline SVGs, hand-rolled utilities) to avoid raising the question — raise it and wait.

---

## Critical Rule — Preserve All API Contracts

**Do not modify any API endpoint URL, HTTP method, request payload shape, or response type.**

The TypeScript interfaces in `src/types/` are the source of truth for all API contracts. Never rename fields, change types, or add/remove properties.

### API Endpoints Reference

| Resource         | Method | URL                       |
| ---------------- | ------ | ------------------------- |
| Auth             | POST   | `/api/auth/login`         |
| Auth             | POST   | `/api/auth/signup`        |
| Reports (all)    | GET    | `/api/reports`            |
| Reports (mine)   | GET    | `/api/reports/my-reports` |
| Report           | GET    | `/api/reports/:id`        |
| Report           | POST   | `/api/reports`            |
| Report           | PUT    | `/api/reports/:id`        |
| Report           | DELETE | `/api/reports/:id`        |
| Locations        | GET    | `/api/locations`          |
| Location         | GET    | `/api/locations/:id`      |
| Location         | POST   | `/api/locations`          |
| User (current)   | GET    | `/api/users/current`      |
| User             | GET    | `/api/users/:id`          |
| Users            | GET    | `/api/users`              |
| Friends          | GET    | `/api/friends`            |
| Friend requests  | GET    | `/api/friends/requests`   |
| Pending requests | GET    | `/api/friends/pending`    |
| Friend options   | GET    | `/api/friends/options`    |
| Friendship       | PUT    | `/api/friends`            |
| Friendship       | POST   | `/api/friends`            |

Auth header: `x-access-token: <token>` (set by Axios request interceptor)
401 responses → clear token + redirect to `/login` (Axios response interceptor)
