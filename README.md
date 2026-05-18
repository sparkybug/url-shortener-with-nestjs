# URL Shortener API

A simple URL shortener REST API built with NestJS. Give it a long URL, get back a short code. Hit the short code, get redirected. Check how many times a link has been clicked. That's it.

Built as a weekend learning project to get hands-on with NestJS fundamentals and test-driven development.

## Tech Stack

| Technology | Why |
|---|---|
| **NestJS** | Opinionated Node.js framework with great structure for building APIs |
| **TypeScript** | Type safety and better DX out of the box |
| **TypeORM** | Decorator-based ORM that pairs well with NestJS modules |
| **SQLite** | Zero-config database, perfect for local dev (swappable to Postgres) |
| **Jest** | Built-in test runner with good mocking support |
| **class-validator** | Declarative DTO validation via decorators |

## Features

- Shorten any valid URL and receive a unique 6-character code
- Redirect to the original URL when the short code is visited
- Track click counts per shortened URL
- Input validation — rejects malformed URLs with a 400 response
- Stats endpoint to check how many times a link has been accessed
- Simple static frontend served at the root path

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit `.env` with your preferred values (see [Environment Variables](#environment-variables) below).

### Running in Development

```bash
npm run start:dev
```

The server starts on `http://localhost:3000` by default (or whatever port you set in `.env`).

### Try It in the Browser

Once the server is running, open [http://localhost:3000/app](http://localhost:3000/app) in your browser. The app serves a frontend where you can shorten URLs, get redirected, and view click stats — no API client needed.

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# End-to-end tests
npm run test:e2e

# Test coverage report
npm run test:cov
```

## API Reference

### POST /shorten

Create a shortened URL.

| Field | Details |
|---|---|
| **Method** | `POST` |
| **Path** | `/shorten` |
| **Body** | `{ "url": "https://example.com/some/long/path" }` |
| **Success** | `201 Created` |

**Example response:**

```json
{
  "shortCode": "a1b2c3"
}
```

**Error (invalid URL):** `400 Bad Request`

---

### GET /:code

Redirect to the original URL.

| Field | Details |
|---|---|
| **Method** | `GET` |
| **Path** | `/:code` |
| **Success** | `302 Found` (redirects to the original URL) |
| **Error** | `404 Not Found` (code doesn't exist) |

---

### GET /stats/:code

Get click statistics for a shortened URL.

| Field | Details |
|---|---|
| **Method** | `GET` |
| **Path** | `/stats/:code` |
| **Success** | `200 OK` |
| **Error** | `404 Not Found` |

**Example response:**

```json
{
  "originalUrl": "https://example.com/some/long/path",
  "clicks": 14
}
```

## Project Structure

```
url-shortener/
├── src/
│   ├── main.ts                    # App entry point, bootstrap + global pipes
│   ├── app.module.ts              # Root module (TypeORM, Config, URL module)
│   ├── app.controller.ts          # Root health/info controller
│   ├── app.service.ts             # Root service
│   └── url/
│       ├── url.module.ts          # URL feature module
│       ├── url.controller.ts      # Route handlers (shorten, redirect, stats)
│       ├── url.service.ts         # Business logic (shorten, resolve, getStats)
│       ├── url.entity.ts          # TypeORM entity definition
│       ├── url.service.spec.ts    # Unit tests for the service layer
│       ├── url.controller.spec.ts # Unit tests for the controller
│       └── dto/
│           └── create-url.dto.ts  # Input validation DTO
├── test/
│   ├── app.e2e-spec.ts           # End-to-end HTTP tests
│   └── jest-e2e.json             # Jest config for e2e tests
├── public/
│   └── index.html                # Simple frontend UI
├── .env                          # Environment variables (not committed)
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `DATABASE_PATH` | Path to the SQLite database file | `db.sqlite` |

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_PATH=db.sqlite
```

## What I Learned

I built this over a weekend to get NestJS concepts into my hands rather than just reading docs. Here's what actually clicked:

- **Modules as boundaries** — NestJS forces you to think about where things live. The `UrlModule` encapsulates everything related to URL shortening, and the root module just wires things together.
- **Dependency injection** — Once I stopped fighting it and let the framework inject services and repositories, testing became trivial. Swapping a real DB for a mock in tests is just one provider override.
- **DTOs and validation pipes** — Declarative validation with `class-validator` means the controller never has to manually check inputs. Invalid requests get rejected before my code even runs.
- **Test-driven development** — Writing the service tests first (with a mocked repository) forced me to think about the interface before the implementation. The e2e tests then confirmed the whole stack works together.
- **TypeORM integration** — The `forRootAsync` pattern for async config loading was confusing at first, but it makes sense once you see how `ConfigService` ties into it.
- **The decorator pattern** — Routes, params, body parsing — everything is a decorator. It felt verbose at first but keeps controllers clean and readable.