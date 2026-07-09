# Ruled — Todo frontend

A React + Vite frontend for the FastAPI todo backend, wired up to `/api/auth`
and `/api/todo`.

## Setup

```bash
npm install
cp .env.example .env   # edit VITE_API_URL if your backend isn't on :8000
npm run dev
```

By default this expects the backend at `http://localhost:8000/api`, matching
the backend's `app.include_router(..., prefix="/api/...")` setup. The dev
server runs on `http://localhost:5173` — make sure that origin is in the
backend's CORS `allow_origins` list (it already is, in the fixed backend).

## What changed from the original template

- **Connected to the real backend contract.** `CreateTodo`/`UpdateTodo` on the
  backend accept `priority`, `category`, `due_date`, `tags`, `notes` — the
  create/edit form now actually sends all of them (previously only
  `content`/`is_completed` were sent, everything else was silently dropped).
- **Fixed a crash-on-submit bug in `Register.jsx`**: it called `toast.error(...)`
  on password mismatch without importing `toast` — that would throw instead
  of showing the error.
- **`Dashboard.jsx` no longer duplicates all the todo logic inline.** It now
  actually uses `TodoForm`/`TodoItem`/`TodoList`, which existed in the
  original project but were never imported or rendered anywhere.
- **One consistent header.** The original rendered the global `Navbar` *and*
  a second custom header inside `Dashboard` at the same time. There's one
  `Navbar` now, used everywhere.
- **One consistent visual theme.** The original mixed a light gray-scale
  theme (`Home`, `Register`), a black/zinc glass-and-neon-gradient theme
  (`Login`, `Dashboard`), and unused leftover Vite template CSS. Rebuilt as a
  single "ruled notebook / planner" design system (see below).
- Removed the `console.log` spam on every single API request/response.
- `axios` base URL now reads from `VITE_API_URL` instead of being hardcoded.

## Design

Palette, type, and layout live in `tailwind.config.js` and `src/index.css`.
It leans into a paper/notebook feel — dot-grid background, ruled left-margin
cards, a serif display face (Fraunces) paired with Inter for UI and
JetBrains Mono for meta text (dates, tags, priority) — rather than the
generic dark-glassmorphism-plus-neon-gradient look, on purpose.
