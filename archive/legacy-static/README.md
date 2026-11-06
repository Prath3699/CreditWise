# Archived static prototype

This folder contains the original static `deploy/` prototype that shipped before the
React + Express application. It is kept for reference only.

- It is **not** part of the build, and nothing imports it.
- It is excluded from ESLint, Prettier, and the CI workflow.
- The live application is built from `src/` (Vite) and `backend/` (Express).

If you need to bring back any design or copy, move the relevant asset into `public/`
or port it into `src/components/` instead of serving this folder directly.
