# Architecture & Design

## Overview
The app is a single-page React application (Vite) that fetches questions from Open Trivia DB and falls back to a local JSON dataset. It provides timed multiple-choice questions, progress tracking, and a results summary.

## Frontend (Vite + React + React Router)
- `src/pages/Quiz.jsx`: Main quiz flow, timer, persistence to `localStorage`, difficulty selector.
- `src/pages/Results.jsx`: Displays per-question outcome and allows restart.
- `src/components/Progress.jsx`: Progress bar.
- `src/components/QuestionCard.jsx`: Renders a question and answer options.
- `src/services/questionsService.js`: Fetches from Open Trivia DB with graceful fallback to `src/data/questions.json`.
- Global styles in `src/App.css`.

### State & Persistence
- React state manages current question index, selected option, answers, score, and timer.
- Quiz state is persisted in `localStorage` with key `quiz_state_v2` to allow refresh recovery.

### Data Flow
1. `Quiz.jsx` calls `fetchQuestions(count, difficulty)`.
2. Service tries Open Trivia DB, else imports local JSON.
3. User selections are stored per question; on completion, results are navigated with router state.

### Accessibility & UX
- Buttons are keyboard-focusable with visible focus rings.
- `aria-label`s on navigation controls.
- Timer uses `aria-live` region for screen reader updates.

## Backend (Optional)
The backend folder contains a Node/Express scaffold that can serve questions or proxy external APIs, but the frontend works independently out of the box using the public API and local fallback.

## Build & Deploy
- Build with Vite in `frontend` producing `dist/`.
- Deploy `frontend/dist` to Netlify/Vercel/GitHub Pages.
- Ensure static assets like favicon are placed in `frontend/public/` when deploying.

## Key Decisions
- Use public Open Trivia DB to avoid maintaining a custom API.
- Persist quiz state to avoid accidental loss on refresh.
- Keep components small and focused for clarity and testability.

