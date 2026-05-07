# NDIES — Nigeria Diaspora Intelligence & Engagement System

NDIES is a full-stack MVP for identifying, mapping, understanding, and engaging Nigerians in the diaspora through GIS, AI-assisted intelligence, PostgreSQL-backed data infrastructure, and executive dashboards.

## Product scope

- Landing page with strategic narrative and consultant attribution.
- Executive dashboard with KPI cards, filters, and map-first operational interface.
- Global diaspora map using ArcGIS Maps SDK patterns for API-backed `FeatureLayer`, clustering, and `HeatmapRenderer` styling.
- Diaspora profiles registry with cards, table fields, search/filter UI, sector scores, and engagement categories.
- AI Intelligence Lab with strict JSON profile classification and database logging.
- Scenario Planning route and interface for country/sector/goal-based mission planning.
- Engagement Strategy page mapping diaspora segments to programs.
- Governance & Trust page for consent, GDPR-aware design, ethical AI, audit logs, and role-based access.

## Architecture

- **Frontend:** Next.js 15 App Router, React, TypeScript, Tailwind CSS v4.
- **Backend:** Next.js Route Handlers under `src/app/api/**`.
- **Database:** Prisma ORM with PostgreSQL and PostGIS-ready latitude/longitude fields plus geospatial lookup indexes.
- **GIS:** ArcGIS Maps SDK for JavaScript client component loading live point data from `/api/map/diaspora-points`.
- **AI:** OpenAI structured JSON schema at `/api/ai/classify-profile` with production-safe error handling and classification logging.

## Runtime data policy

The production application must not depend on bundled mock intelligence data.

```ts
const isProduction = process.env.NODE_ENV === "production";
const hasDatabase = Boolean(process.env.DATABASE_URL);
```

- If `DATABASE_URL` exists, API routes and server pages use Prisma/PostgreSQL.
- If `DATABASE_URL` is missing in development, bundled demo data may be used for local UI work only.
- If `DATABASE_URL` is missing or database queries fail in production, APIs return controlled errors and server pages surface error states.
- If `OPENAI_API_KEY` exists, AI classification uses OpenAI structured outputs.
- If `OPENAI_API_KEY` is missing in production, AI classification returns a controlled service-configuration error.
- Server-only secrets must never use `NEXT_PUBLIC_` or be read in client components.

## API endpoints

- `GET /api/profiles?page=1&pageSize=50&country=&city=&sector=&engagementCategory=&query=`
- `POST /api/profiles`
- `GET /api/profiles/:id`
- `GET /api/map/diaspora-points`
- `GET /api/map/heatmap?layer=Talent%20Density`
- `POST /api/ai/classify-profile`
- `POST /api/scenario`
- `GET /api/dashboard/metrics`
- `GET /api/engagement/recommendations`

## Local setup

Create `.env.local` from `.env.example` and set server-only secrets:

```bash
cp .env.example .env.local
```

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
```

Then run:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

## Database workflow

For fast MVP or managed database synchronization:

```bash
npm run prisma:push
npm run prisma:seed
```

For production migration discipline after creating migrations locally:

```bash
npm run prisma:migrate:dev -- --name harden-production-data-flow
npm run prisma:migrate:deploy
```

Recommended production sequence:

1. Apply migrations with `npm run prisma:migrate:deploy`.
2. Seed only approved baseline records with `npm run prisma:seed` when needed.
3. Deploy the Next.js application.

## Vercel deployment

Required Vercel environment variables:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional; defaults to `gpt-4o-mini`)

Recommended Vercel settings:

- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output:** Next.js default
- **Prisma generation:** handled by the `postinstall` script (`prisma generate`)
- **Runtime:** Node.js runtime for Route Handlers that use Prisma/OpenAI

Use a pooled PostgreSQL connection string for serverless workloads when your provider supports it. Keep direct migration URLs outside the client bundle and do not expose database or OpenAI secrets with `NEXT_PUBLIC_` prefixes.

## Seed data coverage

The seed script loads baseline records for Nigerians in Houston, Atlanta, New York, Dallas, London, Manchester, Toronto, Calgary, Ottawa, Berlin, Munich, Johannesburg, Cape Town, Dubai, and Abu Dhabi across healthcare, technology, academia, finance, engineering, public policy, creative economy, and entrepreneurship.

## Production readiness checklist

- [ ] `DATABASE_URL` is configured in Vercel production and preview environments.
- [ ] `OPENAI_API_KEY` is configured in Vercel production and preview environments.
- [ ] `npm run prisma:migrate:deploy` or `npm run prisma:push` has been run against the target database.
- [ ] `npm run prisma:seed` has loaded approved baseline records, if required.
- [ ] API routes return database-backed data in production.
- [ ] Production API errors do not inject demo data.
- [ ] ArcGIS map loads `/api/map/diaspora-points` successfully.
- [ ] AI Lab returns schema-compliant JSON and writes `AIClassificationLog` records.
- [ ] Secrets are not committed and are not exposed to client components.
