# ISA Drill Room

[![CI](https://github.com/gaboeremita/isa-drill-room/actions/workflows/ci.yml/badge.svg)](https://github.com/gaboeremita/isa-drill-room/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A spoken drill trainer for the **LanguageLine Interpreter Skills Assessment (ISA)**, English ⇄ Spanish.
You hear a provider or patient line, say your rendition out loud before the ring runs out, and the app checks it
against the exact glossary wording.

## Features

- **An 8-rung ladder**, from short terms with the text on screen to a boss call with audio only, less time and
  three lives. Each rung opens once you score 80% on the one before.
- **Real speech in both directions.** Prompts are read aloud with the browser's voices, and the microphone
  transcribes your answer and grades it against every accepted wording.
- **Unit scoring for long turns.** Consecutive turns are graded by the pieces a rater checks (numbers, negations,
  times, register), pre-ticked from what you said.
- **Leitner review boxes.** Misses come back sooner; "Redo my misses" drills only what you got wrong last time.
- **XP, combos and a daily streak** to keep short sprints rewarding.
- **Protocol quiz and script recall** for the interpretation protocol part of the exam.
- **Progress saved in MongoDB**, tied to an anonymous id stored in your browser.
- Light and dark themes that follow your system setting.

## Tech stack

| Layer    | Tools                                                                 |
| -------- | --------------------------------------------------------------------- |
| Client   | React 19, TypeScript, Vite, Tailwind CSS 4, Web Speech API            |
| Server   | Node.js 22, Express 5, TypeScript, Zod, Mongoose                      |
| Database | MongoDB 8                                                             |
| Quality  | ESLint, Prettier, Vitest, Supertest, GitHub Actions, Dependabot       |
| Delivery | Multi-stage Dockerfile and Docker Compose (the API serves the client) |

## Project structure

```
isa-drill-room/
├── client/                 React app (Vite)
│   ├── src/
│   │   ├── api/            HTTP calls to the server
│   │   ├── components/     UI pieces; components/ui holds the styled primitives
│   │   ├── context/        React context for progress and drill content
│   │   ├── domain/         Ladder levels, item bank and sprint picking (pure logic)
│   │   ├── hooks/          Countdown, keyboard, bootstrap and context hooks
│   │   ├── lib/            Text matching and small helpers (pure logic)
│   │   ├── services/       Text-to-speech and microphone wrappers
│   │   ├── styles/         Tailwind entry point and theme tokens
│   │   └── views/          One component per tab or screen
│   └── tests/
├── server/                 Express API
│   ├── src/
│   │   ├── content/        Glossary data, item building and the content catalog
│   │   ├── progress/       Progress rules, service, repository and routes
│   │   ├── http/           Validation and error handling
│   │   ├── config/ db/     Environment and MongoDB connection
│   │   ├── app.ts          Builds the Express app from its dependencies
│   │   └── index.ts        Starts the server
│   └── tests/
└── shared/                 Types shared by client and server (the API contract)
```

The server follows a layered design: routes validate input and call a service; the service holds the rules
(Leitner boxes, XP, streaks) and talks to a `ProgressRepository` interface. MongoDB is one implementation of that
interface, and the tests use an in-memory one, so the rules are tested without a database.

## Getting started

### Requirements

- Node.js 22.12 or newer (`nvm use` picks the version from `.nvmrc`)
- MongoDB, either local or through Docker
- Chrome, Edge or Safari for the speech features

### Run it locally

```bash
npm install
cp .env.example .env
docker compose up -d mongo   # or point MONGODB_URI at your own MongoDB
npm run dev
```

Open <http://localhost:5173>. Vite serves the client and forwards `/api` calls to the server on port 3001.

### Run it with Docker

```bash
docker compose up --build
```

Open <http://localhost:3001>. In production the server serves the built client itself.

## Scripts

Run from the repository root.

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Starts the server and the client with live reload  |
| `npm run build`     | Builds the client and compiles the server          |
| `npm start`         | Runs the compiled server (serves the built client) |
| `npm test`          | Runs the client and server test suites             |
| `npm run typecheck` | Type-checks every workspace                        |
| `npm run lint`      | Lints with ESLint                                  |
| `npm run format`    | Formats with Prettier (sorts Tailwind classes too) |

The MongoDB repository test runs only when `TEST_MONGODB_URI` is set. CI sets it against a MongoDB service.

## Environment variables

| Variable       | Default    | Description                                                         |
| -------------- | ---------- | ------------------------------------------------------------------- |
| `PORT`         | `3001`     | Port the API listens on                                             |
| `MONGODB_URI`  | (required) | MongoDB connection string                                           |
| `CORS_ORIGINS` | empty      | Comma-separated origins allowed to call the API from another origin |

## API

All endpoints are under `/api`. `:learnerId` is a UUID.

| Method   | Path                              | Description                                         |
| -------- | --------------------------------- | --------------------------------------------------- |
| `GET`    | `/health`                         | Health check                                        |
| `GET`    | `/content`                        | Every drill item and quiz question                  |
| `GET`    | `/learners/:learnerId/progress`   | The learner's progress (empty if nothing saved yet) |
| `DELETE` | `/learners/:learnerId/progress`   | Resets scores and boxes, keeps scripts and settings |
| `POST`   | `/learners/:learnerId/sessions`   | Records a finished sprint and returns the outcome   |
| `PATCH`  | `/learners/:learnerId/settings`   | Updates some settings                               |
| `PUT`    | `/learners/:learnerId/scripts`    | Saves the learner's protocol scripts                |
| `PUT`    | `/learners/:learnerId/unlock-all` | Unlocks or relocks every rung                       |

Request and response shapes live in [`shared/src/index.d.ts`](shared/src/index.d.ts). Invalid input gets a `422`
with the list of problems.

## Privacy

There are no accounts. Progress is stored against a random id kept in your browser's local storage; clearing site
data starts you fresh. Speech recognition runs in the browser: Chrome sends audio to Google to transcribe it and
Safari uses Apple's service. Recordings of your answers never leave the page.

## Content sources

The terminology comes from the LanguageLine L4 Core Terminology list and the IMIA Pain Description Glossary.
Those lists belong to their publishers and are included for personal exam practice. The practice lines and
protocol quiz were written for this app. Sources for the exam facts are linked in the app's **Game plan** tab.

The L4 list leaves 33 terms without a Spanish translation (for example "cystitis" and "prognosis"). Their
translations are standard medical Spanish written for this app and live in
[`server/src/content/data/l4-supplement.json`](server/src/content/data/l4-supplement.json), apart from the official
list. Check them against your course materials and edit that file if your school uses different wording.

## License

The code is released under the [MIT License](LICENSE). The glossary content is not covered by that license.
