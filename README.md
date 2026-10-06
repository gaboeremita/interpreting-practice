# Interpreting Practice

[![CI](https://github.com/gaboeremita/interpreting-practice/actions/workflows/ci.yml/badge.svg)](https://github.com/gaboeremita/interpreting-practice/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A spoken drill trainer for interpreting practice, English ⇄ Spanish.
You hear a provider or patient line, say your rendition out loud before the ring runs out, and the app checks it
against the exact glossary wording.

## Features

- **An 8-rung ladder**, from short terms with the text on screen to a boss call with audio only, less time and
  three lives. Each rung opens once you score 80% on the one before.
- **Real speech in both directions.** Prompts are read aloud with the browser's voices, and the microphone
  transcribes your answer and grades it against every accepted wording.
- **Unit scoring for long turns.** Consecutive turns are graded by the pieces that carry the meaning (numbers, negations,
  times, register), pre-ticked from what you said.
- **Leitner review boxes.** Misses come back sooner; "Redo my misses" drills only what you got wrong last time.
- **XP, combos and a daily streak** to keep short sprints rewarding.
- **Protocol quiz and script recall** for interpretation protocol.
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
interpreting-practice/
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

Open <http://localhost:5180>. Vite serves the client and forwards `/api` calls to the server on port 4004.

### Run it with Docker

```bash
docker compose up --build
```

Open <http://localhost:4004>. In production the server serves the built client itself.

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

| Variable        | Default    | Description                                                           |
| --------------- | ---------- | --------------------------------------------------------------------- |
| `PORT`          | `4004`     | Port the API listens on                                               |
| `MONGODB_URI`   | (required) | MongoDB connection string                                             |
| `CORS_ORIGINS`  | empty      | Comma-separated origins allowed to call the API from another origin   |
| `PIPER_TTS_URL` | empty      | Base URL of a Piper server for natural voices (see [Voices](#voices)) |

## API

All endpoints are under `/api`. `:learnerId` is a UUID.

| Method   | Path                              | Description                                             |
| -------- | --------------------------------- | ------------------------------------------------------- |
| `GET`    | `/health`                         | Health check                                            |
| `GET`    | `/content`                        | Every drill item and quiz question                      |
| `PUT`    | `/content/items/:itemId/answer`   | Fixes an item's answer with `{ answer }`                |
| `DELETE` | `/content/items/:itemId/answer`   | Restores an item's original answer                      |
| `GET`    | `/learners/:learnerId/progress`   | The learner's progress (empty if nothing saved yet)     |
| `DELETE` | `/learners/:learnerId/progress`   | Resets scores and boxes, keeps scripts and settings     |
| `POST`   | `/learners/:learnerId/sessions`   | Records a finished sprint and returns the outcome       |
| `PATCH`  | `/learners/:learnerId/settings`   | Updates some settings                                   |
| `PUT`    | `/learners/:learnerId/scripts`    | Saves the learner's protocol scripts                    |
| `PUT`    | `/learners/:learnerId/unlock-all` | Unlocks or relocks every rung                           |
| `GET`    | `/voice/piper`                    | Whether Piper is up, and its English and Spanish voices |
| `POST`   | `/voice/speech`                   | Speaks `{ voice, text, rate }` with Piper, as WAV       |

Request and response shapes live in [`shared/src/index.d.ts`](shared/src/index.d.ts). Invalid input gets a `422`
with the list of problems.

## Voices

Prompts are read aloud with the browser's built-in voices unless you run [Piper](https://github.com/OHF-Voice/piper1-gpl),
a free text-to-speech engine that runs on your own computer and sounds far more natural. The API proxies Piper and
caches each clip in memory, so a phrase is only generated once.

Install Piper with [uv](https://docs.astral.sh/uv/) in a folder of its own, and download an English and a Mexican Spanish voice:

```bash
mkdir -p ~/piper-tts && cd ~/piper-tts
uv venv --python 3.12
uv pip install "piper-tts[http]"
uv run python -m piper.download_voices en_US-lessac-high en_US-ryan-high es_MX-claude-high es_MX-ald-medium
```

Start it from that folder (port 5000 is taken by AirPlay on macOS, hence 5050):

```bash
uv run python -m piper.http_server -m es_MX-claude-high --port 5050
```

Set `PIPER_TTS_URL=http://localhost:5050` in `.env` (docker compose points at `host.docker.internal:5050` by
default), then pick **Piper** under **Voices** in Settings. Every voice downloaded into the Piper folder shows up in
the voice lists; browse the rest at [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices). If Piper
stops answering, the app falls back to the browser voices.

## Privacy

There are no accounts. Progress is stored against a random id kept in your browser's local storage; clearing site
data starts you fresh. Speech recognition runs in the browser: Chrome sends audio to Google to transcribe it and
Safari uses Apple's service. Recordings of your answers never leave the page.

## License

The code is released under the [MIT License](LICENSE).
