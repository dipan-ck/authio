# Authio

Type-safe authentication for Node.js applications. Modular by design — works with the ORMs, databases, and frameworks you already use.

## Features

- Email and password authentication with optional email verification
- Social providers — Google and GitHub
- Database adapters for Drizzle and Prisma
- Supports PostgreSQL, MySQL, and SQLite
- Framework handler for Express (Hono and Next.js coming soon)
- React client library for session management
- CLI for generating database schemas
- Fully type-safe

## Packages

| Package                    | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| `@dipan-ck/authio-core`    | Core authentication engine (`packages/core`)         |
| `@dipan-ck/authio-drizzle` | Drizzle ORM adapter (`packages/adapters/drizzle`)    |
| `@dipan-ck/authio-prisma`  | Prisma adapter (`packages/adapters/prisma`)          |
| `@dipan-ck/authio-node`    | Node.js / Express handler (`packages/handlers/node`) |
| `@dipan-ck/authio-react`   | React client library (`packages/react`)              |
| `@dipan-ck/authio-cli`     | CLI for schema generation (`packages/cli`)           |

## Quick Start

```bash
pnpm add @dipan-ck/authio-core @dipan-ck/authio-drizzle @dipan-ck/authio-node
```

```ts
import { Authio } from '@dipan-ck/authio-core';
import { drizzleAdapter } from '@dipan-ck/authio-drizzle';
import { db } from './db/index.js';

export const auth = new Authio({
   baseUrl: 'http://localhost:8000',
   emailAndPassword: { enabled: true },
   database: drizzleAdapter({ db, provider: 'postgres' }),
});
```

```ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from '@dipan-ck/authio-node';
import { auth } from './lib/auth.js';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(toNodeHandler(auth));
app.listen(8000);
```

Full documentation at [authio.dev/docs](https://authio.dev/docs).

## Repository Structure

.
├── apps
│ └── node # Express test app
├── landing # Next.js documentation site
├── packages
│ ├── core # authio core
│ ├── adapters
│ │ ├── drizzle # @dipan-ck/authio-drizzle
│ │ └── prisma # @dipan-ck/authio-prisma
│ ├── handlers
│ │ └── node # @dipan-ck/authio-node
│ ├── react # @dipan-ck/authio-react
│ └── cli # @dipan-ck/authio-cli
└── pnpm-workspace.yaml

## Documentation

- [Installation](landing/src/app/docs/installation/page.mdx)
- [Quick Start](landing/src/app/docs/quick-start/page.mdx)
- [Database — Drizzle](landing/src/app/docs/database/drizzle/page.mdx)
- [Database — Prisma](landing/src/app/docs/database/prisma/page.mdx)
- [Email & Password](landing/src/app/docs/authentication/email-password/page.mdx)
- [Google](landing/src/app/docs/authentication/google/page.mdx)
- [GitHub](landing/src/app/docs/authentication/github/page.mdx)
- [CLI](landing/src/app/docs/cli/page.mdx)
- [Configuration](landing/src/app/docs/configuration/page.tsx)

## License

MIT
