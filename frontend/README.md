# Quiz App (React + Vite + Tailwind v4)

## Features
- Clean responsive UI, single-question flow, Next/Previous/Skip
- Score tracking with results summary and Restart
- Data from Open Trivia DB with local JSON fallback
- 30s timer per question with auto-lock on timeout
- React Router routes: `/quiz`, `/results`
- Tailwind v4 via `@tailwindcss/vite`

## Install & Run
```bash
cd frontend
npm install
npm run dev
```
Open the shown URL (e.g. http://localhost:5173).

## Build & Preview
```bash
npm run build
npm run preview
```

## Project Structure
- `src/data/questions.json` — local fallback questions
- `src/services/questionsService.js` — fetch + normalize API results
- `src/components/QuestionCard.jsx` — question + options UI
- `src/components/Progress.jsx` — progress bar
- `src/pages/Quiz.jsx` — main quiz flow, timer, score, persistence
- `src/pages/Results.jsx` — results summary and restart
- `src/App.jsx` — router
- `vite.config.mjs` — Vite + Tailwind plugin

## Decisions
- Timer per question: 30s with auto-advance if unselected
- Persist state to `localStorage` for refresh resilience
- A11y improvements: labels, focusable buttons, ARIA live for timer

## Deploy
- Vercel/Netlify: build command `npm run build`, output `dist`
- Set project root to `frontend`

## Testing Notes
- Offline: API fails → fallback to local JSON
- Edge cases handled: loading, error, empty data, refresh
- Prevents Next without selection (except Skip)
