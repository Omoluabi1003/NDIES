# NDIES — Nigeria Diaspora Intelligence & Engagement System

NDIES is a polished MVP showing how Nigeria can identify, map, understand, and engage Nigerians in the diaspora through GIS, AI-assisted intelligence, data infrastructure, and executive dashboards.

## Product scope

- Landing page with strategic narrative and consultant attribution.
- Executive dashboard with KPI cards, filters, and map-first operational interface.
- Global diaspora map using ArcGIS Maps SDK patterns for `FeatureLayer`, clustering, and `HeatmapRenderer` styling.
- Diaspora profiles registry with cards, table fields, search/filter UI, sector scores, and engagement categories.
- AI Intelligence Lab with strict JSON profile classification and database logging.
- Scenario Planning route and interface for country/sector/goal-based mission planning.
- Engagement Strategy page mapping diaspora segments to programs.
- Governance & Trust page for consent, GDPR-aware design, ethical AI, audit logs, and role-based access.

## Architecture

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS v4.
- **Backend:** Next.js Route Handlers under `src/app/api/**`.
- **Database:** Prisma ORM with a PostgreSQL provider and PostGIS-ready latitude/longitude fields.
- **GIS:** ArcGIS Maps SDK for JavaScript client component with feature-layer source graphics, clustering, and heatmap renderer patterns.
- **AI:** OpenAI API structured JSON schema at `/api/ai/classify-profile`; deterministic schema-compatible fallback when `OPENAI_API_KEY` is not configured.

## API endpoints

- `GET /api/profiles`
- `POST /api/profiles`
- `GET /api/profiles/:id`
- `GET /api/map/diaspora-points`
- `GET /api/map/heatmap`
- `POST /api/ai/classify-profile`
- `POST /api/scenario`
- `GET /api/dashboard/metrics`
- `GET /api/engagement/recommendations`

## Database setup

Create a PostgreSQL database and set:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
```

Then run:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

The app can still render MVP sample data without a live database because API/data services fall back to bundled demo data.

## AI setup

Optional environment variables:

```bash
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
```

When configured, the AI route uses strict structured outputs matching the NDIES classification schema.

## Seed data coverage

Sample profiles include Nigerians in Houston, Atlanta, New York, Dallas, London, Manchester, Toronto, Calgary, Ottawa, Berlin, Munich, Johannesburg, Cape Town, Dubai, and Abu Dhabi across healthcare, technology, academia, finance, engineering, public policy, creative economy, and entrepreneurship.

## Roadmap

1. Add authenticated role-based workspaces for executives, analysts, program managers, and compliance officers.
2. Connect managed PostgreSQL with PostGIS geometry columns and spatial indexing.
3. Add participant self-service registry and consent workflows.
4. Add audit-log dashboards and human-review queues for AI-generated classifications.
5. Integrate authoritative diaspora organization datasets and ArcGIS hosted feature services.
6. Add program CRM workflows, outreach tracking, and impact measurement dashboards.
