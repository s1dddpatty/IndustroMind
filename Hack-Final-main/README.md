# ET-Hack-Backend

Industrial knowledge management backend. FastAPI + PostgreSQL/SQLite + Neo4j Aura + Cerebras LLM + SQLAlchemy + JWT Auth + RBAC.

## Architecture

```
backend/
├── api/v1/            # FastAPI route handlers
│   ├── auth.py        # Register, login, refresh, me
│   ├── users.py       # User CRUD
│   ├── organizations.py # Organization CRUD
│   ├── plants.py      # Plant CRUD
│   ├── documents.py   # Upload, list, status, pipeline progress
│   ├── notifications.py # User notifications
│   ├── audit_logs.py  # Audit trail
│   ├── admin.py       # System stats, org dashboard
│   ├── reports.py     # Report generation
│   ├── graph.py       # [P2] Knowledge graph nodes, rels, stats, labels
│   ├── integrity.py   # [P2] Contradiction, drift, mortality scan
│   ├── decisions.py   # [P2] GraphRAG query, decision briefs, expert interview
│   ├── dashboard.py   # [P1+P2] Aggregated alerts from pipeline results
│   ├── mortality.py   # [P2] Locked endpoint: GET /mortality/score
│   └── expert.py      # [P2] Locked endpoint: POST /expert/interview/start
├── core/              # Config, security, dependencies, events, exceptions
├── database/          # SQLAlchemy engine, session, base model
├── models/            # SQLAlchemy ORM models (User, Role, Org, Plant, Document, AuditLog, Notification, Report, PipelineResult)
├── schemas/           # Pydantic request/response schemas
├── services/          # Business logic layer
│   ├── admin/         # Admin dashboard, system stats
│   ├── audit/         # Audit log service
│   ├── auth.py        # Authentication service
│   ├── base.py        # Generic CRUD base
│   ├── document/      # Document upload, status tracking
│   ├── notification/  # Notification dispatch
│   ├── organization/  # Organization service
│   ├── plant/         # Plant service
│   ├── processing.py  # [P2] AI pipeline orchestrator (adapters)
│   ├── report/        # Report generation
│   └── user.py        # User service
├── notifications/     # Notification dispatch
├── workers/           # Background tasks (pipeline processing, reports)
├── utils/             # Helpers
├── agents/            # [P2] AI agents (classification, entity/relationship extraction, expert interview, graphrag)
├── ai/                # [P2] AI services (LLM client, OCR engine, vision parser, embedding generator, graphrag query)
├── graph/             # [P2] Neo4j graph (builder, cypher queries, locked schema)
├── ingestion/         # [P2] Document ingestion pipeline
├── compliance/        # [P2] Contradiction detection, regulatory drift, integrity scan
├── decision/          # [P2] Decision brief generator, knowledge mortality engine
└── main.py            # FastAPI app entry point

frontend/
└── frontend/            # [P3] Next.js 15 Enterprise SaaS Application
    ├── src/
    │   ├── app/         # App router pages (auth, dashboard, onboarding)
    │   │   ├── auth/    # Login & registration flow with conflict resilience
    │   │   ├── onboarding/ai/ # AI knowledge ingestion & demo loader
    │   │   └── dashboard/ # Operational dashboard & sub-modules
    │   │       ├── documents/ # Documents management workspace
    │   │       ├── integrity/ # Contradiction & regulatory drift scanner
    │   │       ├── expert/    # AI-guided expert interview & mortality roster
    │   │       ├── compliance/ # Regulatory compliance mapping
    │   │       ├── graph/     # Neo4j knowledge graph explorer
    │   │       └── decision/  # Decision support briefs
    │   ├── components/  # Reusable UI components & navigation
    │   └── lib/api.ts   # Centralized Axios client with JWT Bearer interceptor
    └── next.config.ts   # API proxy rewrite rules (/api/v1 -> backend:8000)

shared/prompts/        # YAML prompt templates for all AI agents
docker/                # Docker config
scripts/               # Dev utilities (seed_data, setup_db, run_dev, verify_integration, full_backend_test)
alembic/               # DB migrations
```

## Setup

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Configure environment
# Edit .env — defaults use SQLite for local dev, PostgreSQL for production
# Set your CEREBRAS_API_KEY, NEO4J_URI, NEO4J_PASSWORD etc.

# 3. Create database tables + seed demo data
python -m scripts.seed_data

# 4. Start the backend dev server (Terminal 1)
python -m uvicorn backend.main:app --port 8000

# 5. Start the frontend Next.js SaaS server (Terminal 2)
cd frontend/frontend
npm install
npm run dev

# 6. Open Web Application & Swagger docs
# Frontend App: http://localhost:3000
# Backend Swagger API: http://localhost:8000/docs

# 7. Run full integration test suite (31 tests)
python scripts/full_backend_test.py
```

### Troubleshooting

- **No PostgreSQL?** Use SQLite for local dev: set `DATABASE_URL=sqlite+aiosqlite:///./neuroplant.db` in `.env`
- **Port 6379 conflict**: Edit `docker-compose.yml` and change `"6379:6379"` to `"6380:6379"`
- **bcrypt errors**: `pip install bcrypt==4.0.1 && python -m scripts.seed_data`
- **email-validator not found**: `pip install email-validator`
- **pgAdmin**: Connect to `localhost:5432`, user `neuroplant`, password `neuroplant`, database `neuroplant`

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| super_admin | admin@neuroplant.io | admin123 |
| org_admin | orgadmin@demo.org | admin123 |
| editor | editor@demo.org | editor123 |
| viewer | viewer@demo.org | viewer123 |

## API & Application Modules

### Person 1 — Application Layer

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/auth/register | Register user + org |
| POST | /api/v1/auth/login | Login |
| POST | /api/v1/auth/refresh | Refresh token |
| GET | /api/v1/auth/me | Current user |
| GET/POST/PATCH/DELETE | /api/v1/organizations | Org CRUD |
| GET/POST/PATCH/DELETE | /api/v1/plants | Plant CRUD |
| GET/POST/PATCH/DELETE | /api/v1/users | User CRUD |
| POST | /api/v1/documents/upload | Upload document |
| GET | /api/v1/documents | List documents |
| GET | /api/v1/documents/{id} | Get document by ID |
| GET | /api/v1/documents/{id}/status | Document pipeline status |
| GET | /api/v1/documents/{id}/pipeline | Detailed pipeline progress |
| POST | /api/v1/documents/{id}/process | Request AI processing |
| GET | /api/v1/notifications | User notifications |
| GET | /api/v1/audit-logs | Audit trail |
| GET | /api/v1/admin/stats | System stats |
| GET | /api/v1/admin/dashboard/{org_id} | Org dashboard |
| POST | /api/v1/reports | Create report |
| GET | /api/v1/dashboard/alerts | Aggregated P2 alerts |

### Person 2 — AI & Intelligence Layer

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/graph/labels | Locked graph schema (13 node labels, 16 rel types) |
| GET | /api/v1/graph/stats | Graph statistics |
| GET | /api/v1/graph/nodes | Query graph nodes |
| GET | /api/v1/graph/relationships | Query graph relationships |
| POST | /api/v1/integrity/scan | Full integrity scan (contradictions + drift + mortality) |
| GET | /api/v1/integrity/contradictions | Detected contradictions |
| GET | /api/v1/integrity/regulatory-drift | Regulatory drift status |
| GET | /api/v1/integrity/mortality | Knowledge mortality score |
| GET | /api/v1/mortality/score | **Locked Day 1 contract** — mortality score |
| POST | /api/v1/decisions/query | GraphRAG query + decision brief |
| POST | /api/v1/decisions/expert/interview/start | Start expert interview |
| POST | /api/v1/decisions/expert/interview/process | Process interview transcript |
| POST | /api/v1/expert/interview/start | **Locked Day 1 contract** — expert interview |
| POST | /api/v1/expert/interview/process | **Locked Day 1 contract** — process interview |

### Person 3 — Frontend SaaS Application (Next.js 15)

| Module | Route / Page | Capabilities & Backend Integration |
|--------|--------------|------------------------------------|
| Authentication | /auth | Multi-step registration/login with 409 Conflict fallback and token storage |
| AI Onboarding | /onboarding/ai | Document upload and 7-stage demo dataset intelligence initialization |
| Operational Dashboard | /dashboard | Knowledge mortality risk score, critical contradiction alerts, and compliance bars |
| Knowledge Documents | /dashboard/documents | Document ingestion workspace with confidence bars, filtering, and upload |
| Knowledge Integrity | /dashboard/integrity | Safety contradiction detection, affected equipment tags, and regulatory drift |
| AI Expert Interview | /dashboard/expert | Retiring SME mortality roster, AI question generation, and Neo4j graph injection |
| Compliance Mapping | /dashboard/compliance | OSHA 1910.119 PSM, API 610, EPA RMP, and ISO 10816 standards tracking |
| Knowledge Graph | /dashboard/graph | Interactive Neo4j node and relationship network explorer |

## Auth

All endpoints except `/auth/register`, `/auth/login`, `/health`, and `/` require a Bearer JWT.

**Roles:** `super_admin`, `org_admin`, `editor`, `viewer`

**Demo users** (from `scripts/seed_data.py`):
- `admin@neuroplant.io` / `admin123` — super_admin
- `orgadmin@demo.org` / `admin123` — org_admin
- `editor@demo.org` / `editor123` — editor
- `viewer@demo.org` / `viewer123` — viewer

## AI Services (Person 2)

| Service | Description | Provider |
|---------|-------------|----------|
| LLM Client | Text generation, classification, extraction | Cerebras (`gpt-oss-120b`) |
| OCR Engine | Scanned document text extraction | PaddleOCR + Tesseract fallback |
| Vision Parser | Drawing/schematic analysis | Cerebras vision |
| Embedding Generator | Vector embeddings for similarity | OpenAI (`text-embedding-3-large`) |
| Knowledge Graph | Entity/relationship storage | Neo4j Aura |
| Contradiction Detector | Cross-document consistency checks | Cerebras LLM |
| Regulatory Drift Engine | Compliance gap analysis | Cerebras LLM |
| Knowledge Mortality Engine | Expert knowledge risk scoring | Cerebras LLM |
| Decision Brief Generator | AI-powered decision support | GraphRAG + Cerebras |
| Expert Interview Agent | Guided knowledge capture | Cerebras LLM |

## Event Bus

Person 1 emits events via `backend/core/events.py` when AI processing is needed.
Person 2 subscribes to these events and implements the actual AI logic.

Events: `document.uploaded`, `document.processing.requested`, `decision.brief.requested`, `expert.interview.requested`

## Testing

```bash
# Full integration suite (31 tests, 10 categories)
python scripts/full_backend_test.py

# Quick integration verification (17 endpoints)
python scripts/verify_integration.py
```

**Test categories:** Health, Auth, CRUD, Document Upload, Knowledge Graph, Integrity & Compliance, Locked Day 1 Contracts, Decisions & Expert Interview, Dashboard & Admin, RBAC & Security.
