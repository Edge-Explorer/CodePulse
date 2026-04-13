# AI DevOps Assistant Platform — Master Implementation Plan

> **Philosophy**: This is a *learning-by-building* plan. Every technology decision is intentional. You will understand *why* before we write *what*. I'm your teacher — you write, I guide.

## ✅ Decisions Locked In

| Question | Decision |
|----------|----------|
| Auth | **GitHub OAuth** (JWT + OAuth2 via GitHub) |
| Repo location | `C:\Projects\ai-devops-assistant` (see note below) |
| Docker Desktop + K8s | ✅ Confirmed |
| Start approach | Session 0 architecture walkthrough first |
| Scaling target | 1k–10k+ concurrent users (KEDA + HPA + connection pooling) |
| Production deploy | Vercel (frontend) + Railway (backend) + Upstash (Redis/Kafka) + Neon (DB) |
| Kafka tooling | Docker + Kafka UI web browser — no desktop app needed |

> [!NOTE]
> **Why `C:\Projects\` not OneDrive Desktop?**
> OneDrive actively syncs everything in `Desktop/`. Python `.venv` folders, `node_modules`, Docker layer caches, and Kafka data directories can have **100,000+ small files**. OneDrive will try to sync all of them → CPU spikes, slow file ops, sync errors. Keeping projects in `C:\Projects\` avoids all of this. Your code still gets version-controlled via Git + GitHub — that's your real backup.

---

## 🎯 Project Vision

A production-grade platform where developers upload a GitHub repo and get:
- AI-powered code review (Gemini 2.0 Flash)
- Async job management (Celery + Redis)
- Event-driven microservice communication (Kafka)
- Full observability and scalability (Docker + Kubernetes)

**Stack**: FastAPI · Celery · Redis · Kafka · PostgreSQL (Neon) · Gemini API · Docker · Kubernetes · React+Vite · uv + pyproject.toml

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **Three Key Design Decisions** — Read before we start:
> 1. **Monorepo Structure**: All services live in one repo. Easier to manage at your level while still being microservices-ready.
> 2. **Phase-based**: We don't add Kafka on day 1. You build with Redis+Celery first, understand it, then upgrade. This is how real engineers work.
> 3. **You write, I explain everything**: Every file, every line — I'll explain the *why* before you write the *what*.

---

## 📚 Learning Map (What You Will Learn Per Phase)

| Phase | Tech | Concepts |
|-------|------|----------|
| 0 | Architecture walkthrough | Mental model, folder setup, tooling |
| 1 | FastAPI, Pydantic, uv | Project structure, async APIs, schema design |
| 2 | PostgreSQL, Neon, Alembic | DB schema, migrations, ORM (SQLAlchemy) |
| 3 | Celery + Redis | Task queues, workers, background jobs |
| 4 | Gemini API | Prompt engineering, AI response parsing |
| 5 | Docker | Containerization, multi-service compose |
| 6 | Kafka | Event streaming, producers/consumers, topics |
| 7 | Kubernetes | Deployments, Services, HPA, ingress |
| 8 | Frontend | React, TanStack Query, WebSockets |

---

## 📁 Final Repository Structure

```
ai-devops-assistant/
│
├── services/
│   ├── api-gateway/          ← FastAPI: routing, auth, request validation
│   │   ├── src/
│   │   │   ├── main.py
│   │   │   ├── routers/
│   │   │   │   ├── auth.py
│   │   │   │   ├── projects.py
│   │   │   │   └── jobs.py
│   │   │   ├── models/       ← SQLAlchemy ORM models
│   │   │   ├── schemas/      ← Pydantic schemas
│   │   │   ├── services/     ← Business logic
│   │   │   └── core/
│   │   │       ├── config.py
│   │   │       ├── database.py
│   │   │       └── security.py
│   │   ├── migrations/       ← Alembic
│   │   ├── pyproject.toml
│   │   └── Dockerfile
│   │
│   ├── worker/               ← Celery workers
│   │   ├── src/
│   │   │   ├── celery_app.py
│   │   │   ├── tasks/
│   │   │   │   ├── analysis.py
│   │   │   │   ├── git_clone.py
│   │   │   │   └── ai_review.py
│   │   │   └── services/
│   │   │       ├── gemini.py
│   │   │       └── repo_parser.py
│   │   ├── pyproject.toml
│   │   └── Dockerfile
│   │
│   └── kafka-consumers/      ← Added in Phase 6
│       ├── src/
│       │   ├── consumers/
│       │   │   ├── job_consumer.py
│       │   │   └── notification_consumer.py
│       │   └── producers/
│       │       └── events.py
│       ├── pyproject.toml
│       └── Dockerfile
│
├── frontend/                 ← React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/            ← TanStack Query hooks
│   │   └── store/            ← Zustand state
│   └── package.json
│
├── k8s/                      ← Kubernetes manifests
│   ├── api-gateway/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── worker/
│   │   ├── deployment.yaml
│   │   └── hpa.yaml
│   ├── kafka/
│   │   └── kafka-cluster.yaml  (Strimzi)
│   ├── redis/
│   │   └── statefulset.yaml
│   └── ingress.yaml
│
├── docker-compose.yml        ← Local dev (all services)
├── docker-compose.kafka.yml  ← Add-on compose for Kafka dev
└── README.md
```

---

## 🗄️ Database Schema (Neon PostgreSQL)

```sql
-- Core tables you'll design and migrate with Alembic

users         (id, email, hashed_password, github_token, created_at)
projects      (id, user_id, name, repo_url, github_url, created_at)
jobs          (id, project_id, status, priority, created_at, started_at, completed_at, retry_count)
job_results   (id, job_id, result_type, raw_output, created_at)
ai_logs       (id, job_id, prompt, response, model, tokens_used, created_at)
```

> **Why this design?** — You'll learn: foreign keys, status enums, audit trails, and why AI logs are stored separately (cost tracking, debugging).

---

## 🔄 System Flow Diagrams

### Phase 1–5 Flow (Redis + Celery)
```
User → API Gateway → DB (job created) → Redis Queue → Celery Worker
                                                           ↓
                                              Clone Repo → Parse → Gemini API
                                                           ↓
                                              job_results saved to DB
                                                           ↓
                                              Frontend polls → shows result
```

### Phase 6+ Flow (Kafka Upgrade)
```
User → API Gateway → Kafka Topic: job.requested
                         ↓
              [Consumer: Worker Service]
                         ↓
              Clone Repo → Celery for heavy task
                         ↓
              Kafka Topic: job.completed
                         ↓
              [Consumer: Notification Service] → WebSocket → Frontend
              [Consumer: AI Logging Service]  → ai_logs table
```

> **Key insight**: Kafka decouples services. Adding a new consumer (e.g., billing, analytics) requires zero changes to the producer. That's the power.

---

## 🏗️ Phases (Step-by-Step Build Plan)

---

### 📌 Phase 1: Project Foundation & API Gateway
**Duration**: ~3–4 days | **Goal**: Understand clean FastAPI project structure

**What you'll build**:
- Monorepo setup with `uv` and `pyproject.toml` per service
- `api-gateway` FastAPI app:
  - Health check endpoint
  - **GitHub OAuth2 login** (via `httpx` + GitHub API, returning JWT)
  - User schema + Pydantic models
- `core/config.py` using `pydantic-settings` (env vars, `.env` file)

**Key Learning**:
- Why `uv` over pip? (Speed, lockfiles, reproducibility)
- How `pyproject.toml` replaces `requirements.txt` + `setup.py`
- Why separate `schemas/` from `models/` (API contract vs DB layer)
- JWT tokens — how they work, why we use them

**Tools**: uv, FastAPI, Pydantic v2, python-jose, httpx

**Scaling additions in this phase**:
- `slowapi` for per-user rate limiting (e.g., 100 requests/min)
- Structured JSON logging with `structlog` (parseable in production)
- `/health` endpoint that K8s liveness probes will call

---

### 📌 Phase 2: Database Layer (Neon + SQLAlchemy + Alembic)
**Duration**: ~3–4 days | **Goal**: Production-grade DB setup with migrations

**What you'll build**:
- Connect to **Neon** (free Postgres cloud) via SQLAlchemy async
- All 5 tables as SQLAlchemy ORM models
- Alembic migration setup (`env.py`, `alembic.ini`)
- CRUD operations for users and projects

**Key Learning**:
- Why Alembic? (Never alter DB manually in production)
- Async SQLAlchemy (why `async_session` matters)
- Connection pooling (why it matters at scale)
- Neon's serverless Postgres and why it's free-tier friendly

**Tools**: sqlalchemy[asyncio], alembic, asyncpg, neon (cloud)

---

### 📌 Phase 3: Job Service + Celery + Redis
**Duration**: ~4–5 days | **Goal**: Async job processing — the heart of the system

**What you'll build**:
- `jobs` router in API gateway (create job, get status, list jobs)
- Redis connection setup (free: Redis on Railway or local Docker)
- `worker/` service with Celery app
- First task: `analyze_repo` — stubbed (no AI yet), just status transitions
- Job status flow: `pending → running → completed / failed`
- Retry logic: `max_retries=3`, `autoretry_for=(Exception,)`

**Key Learning**:
- How Celery task queues work (broker vs backend)
- Task states & why idempotency matters
- Redis as both broker AND result backend
- Priority queues in Celery (`queue='high_priority'`)
- Why you should NEVER put large objects in task args

**Tools**: celery, redis-py, kombu

**Scaling additions in this phase**:
- Priority queues: `high_priority`, `default`, `low_priority`
- Connection pool config for Redis (max 20 connections per worker)
- Celery beat for periodic tasks (e.g., clean up stale jobs)

---

### 📌 Phase 4: Gemini Integration (AI Service)
**Duration**: ~3 days | **Goal**: Real AI analysis, prompt engineering

**What you'll build**:
- `worker/services/gemini.py` — Gemini 2.0 Flash API wrapper
- Prompt templates for: code review, security scan, refactor suggestions
- Response parser (structured JSON output from Gemini)
- Cache AI responses in Redis (same prompt = no re-call)
- Save to `ai_logs` table (tokens, cost tracking)

**Key Learning**:
- Prompt engineering for structured output (JSON mode)
- Why caching AI responses saves money and speeds up repeat queries
- Rate limiting Gemini calls (you pay per token)
- Parsing and validating AI output with Pydantic

**Tools**: google-generativeai, redis (for caching)

**Scaling additions in this phase**:
- Cache key = `sha256(repo_url + commit_hash)` — same repo+commit never calls Gemini twice
- Gemini rate limit handling: exponential backoff on 429 errors
- Token counting before request (reject if > model limit)

---

### 📌 Phase 5: Docker & Docker Compose
**Duration**: ~2–3 days | **Goal**: Every service in a container, one command to run all

**What you'll build**:
- `Dockerfile` for `api-gateway` and `worker`
- `docker-compose.yml`:
  - API Gateway
  - Worker (2 replicas)
  - Redis
  - (Neon is cloud, so no local Postgres needed)
- Health checks in compose
- Environment variable management (`.env` files, Docker secrets)
- Multi-stage builds (smaller images)

**Key Learning**:
- Why multi-stage Dockerfile matters (dev vs prod image size)
- Container networking (`depends_on`, service DNS)
- Volume mounts for local development
- Why `.dockerignore` is as important as `.gitignore`

**Tools**: Docker, Docker Compose

**Scaling additions in this phase**:
- Multi-stage Dockerfile (builder stage → slim runtime image)
- Worker replicas via `deploy.replicas: 2` in compose
- Resource limits in compose (`mem_limit`, `cpus`)

---

### 📌 Phase 6: Kafka (Event-Driven Upgrade) 🔥
**Duration**: ~5–6 days | **Goal**: Understand event streaming, decouple services

> This is where the project becomes truly production-grade. Take your time here.

**What you'll build**:
- Kafka + Zookeeper in Docker Compose (`docker-compose.kafka.yml`)
- Topics: `job.requested`, `job.completed`, `job.failed`
- **Producer**: API Gateway emits `job.requested` event (instead of direct Redis push)
- **Consumer 1**: Worker service listens to `job.requested`, starts Celery task
- **Consumer 2**: Notification service listens to `job.completed`, pushes to WebSocket
- Schema: Events use Pydantic models (typed event contracts)

**Key Learning**:
- Kafka vs Redis pub/sub (persistence, replay, consumer groups)
- Consumer groups: why multiple workers can share load
- Topic partitioning: how Kafka scales horizontally
- Event schema design (why breaking changes in events = production disasters)
- `auto.offset.reset` — what happens when a new consumer joins late
- At-least-once vs exactly-once delivery (and why it matters)

**Tools**: confluent-kafka-python, Kafka in Docker (KRaft mode — no Zookeeper), **Kafka UI** (web browser at localhost:8080)

> [!NOTE]
> **No Kafka desktop app needed.** Run `kafka` + `kafka-ui` containers in Docker Compose. Kafka UI gives you full topic inspection, message browsing, and consumer group lag — all in the browser. Free and open-source.

---

### 📌 Phase 7: Kubernetes
**Duration**: ~5–7 days | **Goal**: Deploy everything on K8s like a real SRE

**What you'll build**:
- K8s manifests for each service:
  - `Deployment` + `Service` for API Gateway
  - `Deployment` for Worker (scalable)
  - `StatefulSet` for Redis
  - Kafka via **Strimzi** operator (free, production-grade)
- `ConfigMap` for non-secret env vars
- `Secret` for DB URLs, API keys
- **HPA** (Horizontal Pod Autoscaler) for worker — scales based on CPU/queue length
- `Ingress` for external access (Nginx Ingress Controller)

**Key Learning**:
- Deployment vs StatefulSet vs DaemonSet (when to use which)
- How K8s DNS works (`api-gateway.default.svc.cluster.local`)
- Why HPA + Kafka consumer is a perfect combo for event-driven scaling
- Resource requests vs limits (CPU/memory)
- Rolling updates vs recreate strategy
- Why Strimzi (not manual Kafka setup) in K8s

**Tools**: kubectl, Docker Desktop K8s, Strimzi, Nginx Ingress, **KEDA**

**KEDA (Kubernetes Event Driven Autoscaler)** — the scaling highlight of this phase:
```
Standard HPA: scales on CPU/memory
KEDA:         scales on Redis queue depth OR Kafka consumer lag

Example: 5,000 jobs in Redis queue → KEDA scales workers 2 → 50 pods
         Queue drains → KEDA scales back to 2
```
This is production-grade auto-scaling. Free. Industry standard.

---

### 📌 Phase 8: Frontend (React + Vite)
**Duration**: ~3–4 days | **Goal**: Functional UI to interact with your backend

**What you'll build**:
- Auth pages (login/register)
- Dashboard (list projects, jobs)
- Job detail page (show AI review output)
- Real-time job status updates via polling (TanStack Query) or WebSocket
- Simple, clean design (nothing fancy — backend is the star)

**Key Learning**:
- TanStack Query for server state management
- WebSocket in React (for live job updates)
- Zustand for auth state

**Tools**: React, Vite, TanStack Query, Zustand, Axios

**Deployment**: Frontend deploys to **Vercel** (free). Backend deploys to **Railway** (free $5/month credit).

---

## ⚙️ Local Dev Environment Setup (Phase 0)

Before any code, set this up:

```bash
# 1. Install uv (ultra-fast Python package manager)
pip install uv   # or: winget install astral-sh.uv

# 2. Create repo
mkdir ai-devops-assistant && cd ai-devops-assistant
git init

# 3. Per service setup (example for api-gateway)
cd services/api-gateway
uv init
uv add fastapi uvicorn pydantic-settings python-jose

# 4. Docker Desktop (you already have this)
# Enable Kubernetes in Docker Desktop settings
```

**Free services you'll use**:
| Service | Free Option |
|---------|------------|
| PostgreSQL | Neon (free tier: 512MB, plenty) |
| Redis | Docker (local) |
| Kafka | Docker (local) |
| Kubernetes | Docker Desktop built-in K8s |
| Container Registry | Docker Hub (free) |
| Gemini API | Pay-as-you-go (Gemini 2.0 Flash is cheap) |

---

## 🧪 Testing Strategy

| Type | Tool | When |
|------|------|------|
| Unit | pytest + pytest-asyncio | Each phase |
| Integration | httpx (async test client) | After each endpoint |
| Load | locust (free) | Phase 7 |
| Contract | Pydantic validation | Built-in |

---

## 📊 Observability (Optional but recommended Phase 7+)

- **Prometheus**: Scrape metrics from FastAPI (via `prometheus-fastapi-instrumentator`)
- **Grafana**: Dashboard (free, run in Docker)
- **Structured logging**: `structlog` (JSON logs → easy to parse)

---

## 📋 Daily Workflow (How We'll Work Together)

```
1. I explain the concept (why)
2. I give you the file structure and what each file does
3. You write the code
4. I review and explain what each part does
5. We test it together
6. Move to next piece
```

> [!NOTE]
> **Speed**: Don't rush phases. If Kafka clicks in 3 days — great. If it takes 8 — that's fine. Understanding > speed.

---

## 🔑 Key Architecture Decisions (Explained)

| Decision | Why | Alternative |
|----------|-----|-------------|
| `uv` over pip | 10–100x faster, lockfile, modern | pip + requirements.txt |
| Pydantic v2 | Fastest validation, type-safe | marshmallow |
| Async SQLAlchemy | Non-blocking DB calls | Sync SQLAlchemy |
| Neon (not local PG) | Free cloud, mimics production | Local Docker Postgres |
| Celery + Redis | Proven job queue, simple | Dramatiq, ARQ |
| Kafka (Phase 6) | True decoupling, event replay | RabbitMQ |
| Strimzi (K8s Kafka) | Production-grade, free operator | Manual Kafka StatefulSet |
| KRaft mode (Kafka) | No Zookeeper needed (modern) | Kafka + Zookeeper |

---

## 🚀 What This Project Proves (To Interviewers)

When you finish this, you can confidently talk about:

- ✅ **System Design**: Designed a multi-service async platform from scratch
- ✅ **Event-Driven Architecture**: Kafka producers/consumers, topic design
- ✅ **Distributed Queuing**: Celery workers, priority queues, retries
- ✅ **Database Engineering**: Schema design, Alembic migrations, async ORM
- ✅ **Containerization**: Multi-stage Dockerfiles, compose orchestration
- ✅ **Kubernetes**: Deployments, HPA, StatefulSets, Ingress, Strimzi
- ✅ **AI Integration**: Prompt engineering, caching, structured output parsing
- ✅ **Production Thinking**: Rate limiting, retry logic, error handling, logging

---

## ✅ All Questions Answered — Ready to Build

| # | Question | Answer |
|---|----------|--------|
| Q1 | Auth type | GitHub OAuth ✅ |
| Q2 | Repo location | `C:\Projects\ai-devops-assistant` ✅ |
| Q3 | Docker Desktop | Confirmed ✅ |
| Q4 | Start approach | Session 0 walkthrough first ✅ |

**Next step**: See `walkthrough.md` for the Session 0 Architecture Walkthrough.

