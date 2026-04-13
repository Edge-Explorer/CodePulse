# Session 0: Architecture Walkthrough
### AI DevOps Assistant Platform — Before We Write A Single Line

> [!NOTE]
> This session is **not** about code. It's about building a mental model so strong that when you write code, you know *exactly* what you're building and *why*. Think of it as reading the blueprint before laying bricks.

---

## Part 1: The Big Picture (30,000 ft View)

Here's the simplest version of what we're building:

```
User (Browser)
    |
    | "analyze my GitHub repo"
    ↓
[API Gateway]  ← FastAPI — the brain, handles all HTTP requests
    |
    | "create a job for this"
    ↓
[Database]     ← Neon (Postgres) — persists everything
    |
    | "queue this job"
    ↓
[Redis]        ← In-memory broker — the message highway
    |
    | "pick up and run this job"
    ↓
[Celery Worker] ← Background job runner — does the heavy lifting
    |
    | "call AI"
    ↓
[Gemini API]   ← AI analysis, returns review + suggestions
    |
    | "save results"
    ↓
[Database]     ← Results stored
    |
    | "job done, notify"
    ↓
[Kafka]        ← (Phase 6) Event bus — tells other services what happened
    |
    ↓
[Frontend]     ← React — shows the user their results
```

This is the **entire system** in one diagram. Every phase we build adds one more row to this chain. Never lose sight of this picture.

---

## Part 2: Why Microservices? (And What It Actually Means)

**A misconception**: Microservices doesn't mean "many separate repos" or "deployed on 10 servers."

**The real definition**: Each service has **one job** and communicates via well-defined contracts (API calls, events, queues). You could run all of them on one machine.

Our services and their **one job**:

| Service | One Job |
|---------|---------|
| `api-gateway` | Accept HTTP requests, validate input, route to right place |
| `worker` | Execute background jobs (clone repo, run analysis) |
| `kafka-consumers` | React to events produced by other services |
| `frontend` | Show UI |

> **Why not one big FastAPI app?** You could. But then scaling means scaling *everything*. With separate workers, when jobs pile up, Kubernetes scales *only the workers* — not the API. That's real scalability.

---

## Part 3: GitHub OAuth Flow (Exactly How It Works)

This is critical to understand before Phase 1. Here's the exact dance:

```
Step 1: User clicks "Login with GitHub" on frontend
        Frontend redirects to → https://github.com/login/oauth/authorize?client_id=...

Step 2: GitHub shows permission screen
        User clicks "Authorize"
        GitHub redirects back to → https://your-api.com/auth/callback?code=xyz123

Step 3: API Gateway receives the callback with `code`
        API calls GitHub internally:
        POST https://github.com/login/oauth/access_token
        body: { client_id, client_secret, code }
        response: { access_token: "gho_xxxx" }

Step 4: API uses GitHub access_token to get user info:
        GET https://api.github.com/user
        Header: Authorization: Bearer gho_xxxx
        response: { id: 12345, login: "yourname", email: "...", avatar_url: "..." }

Step 5: API checks DB — does this GitHub user exist?
        If YES → update their record
        If NO  → create new user row

Step 6: API generates OUR JWT token (not GitHub's)
        JWT payload: { user_id: 45, github_id: 12345, exp: ... }
        This JWT is what the frontend uses for all future requests

Step 7: Frontend stores JWT (in memory / httpOnly cookie)
        All future API calls: Header: Authorization: Bearer <our_jwt>
```

**What you need from GitHub** (we'll set this up in Phase 1):
- Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
- `Homepage URL`: `http://localhost:3000`
- `Callback URL`: `http://localhost:8000/auth/callback`
- You get: `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` → goes in `.env`

> **Key insight**: We never store the user's GitHub password. We never even see it. GitHub handles auth, we just get back "this is user X" and issue our own token. This is OAuth.

---

## Part 4: How `uv` Changes Your Python Workflow

You've used pip. Here's the mental model shift:

**Old way (pip)**:
```
pip install fastapi          → installs globally or in venv, no lockfile
requirements.txt             → manually maintained, versions can drift
python -m venv venv          → manual venv creation
pip install -r requirements.txt → slow, resolves dependencies each time
```

**New way (uv)**:
```
uv init                      → creates pyproject.toml and .python-version
uv add fastapi               → installs + auto-updates pyproject.toml + uv.lock
uv run python main.py        → auto-activates venv, runs script
uv sync                      → installs exact deps from lockfile (reproducible)
```

**`pyproject.toml` — one file to rule them all**:
```toml
[project]
name = "api-gateway"
version = "0.1.0"
requires-python = ">=3.12"

dependencies = [
    "fastapi>=0.110.0",
    "uvicorn[standard]>=0.27.0",
    "pydantic-settings>=2.0.0",
]

[tool.uv]
dev-dependencies = [
    "pytest>=8.0.0",
    "httpx>=0.26.0",   # for testing async endpoints
]
```

**Why this matters for our project**: Each service (`api-gateway`, `worker`, `kafka-consumers`) has its own `pyproject.toml`. They can have different dependencies and different Python versions if needed. No global pollution.

---

## Part 5: The Database — Why 5 Tables?

Let's understand *why* before we design:

```
users           → "Who is using the system?"
projects        → "What repos have they registered?"
jobs            → "What analysis tasks are running/done?"
job_results     → "What did the analysis find?"
ai_logs         → "What did we send to / get from Gemini?"
```

**Why `ai_logs` is separate** (this is a great interview answer):
1. **Cost tracking**: You pay per token on Gemini. You want to know who's using how many tokens.
2. **Debugging**: When AI gives a weird answer, you replay the exact prompt.
3. **Caching**: Before calling Gemini, check if same prompt+repo hash was already analyzed.
4. **Compliance**: In enterprise, you need an audit log of every AI decision.

**Why `job_results` is separate from `jobs`**:
- A job can produce *multiple* results (security scan result + code review result + refactor suggestions)
- Result can be very large (AI output for a large repo = thousands of chars)
- Queries on jobs (status, timing) should stay fast — no giant BLOBs in the way

---

## Part 6: Celery + Redis — The Mental Model

Think of it like a pizza restaurant:

```
Redis = The order board on the wall
Celery = The cooks in the kitchen
API Gateway = The cashier at the counter

1. Customer orders pizza (user submits repo for analysis)
2. Cashier writes the order on a ticket → hangs it on the board (API → Redis)
3. Cook sees the ticket → takes it → starts cooking (Celery worker picks task)
4. Cook doesn't tell cashier — cashier can take more orders (async!)
5. Cook finishes → writes result in the results notebook (saves to DB)
6. Customer can check their order status at any time (poll API)
```

**What Redis actually stores (broker mode)**:
```
Queue: "default"
[
  { task: "analyze_repo", args: [job_id=123], eta: now },
  { task: "analyze_repo", args: [job_id=124], eta: now },
  { task: "analyze_repo", args: [job_id=125], priority: HIGH },
]
```

**Why not just use a database as a queue?** (Asked in interviews)
- Polling a DB table is expensive (locks, indexes)
- Redis is in-memory = microsecond pops
- Redis has built-in sorted sets perfect for priority queues
- Redis pub/sub lets multiple workers coordinate without a central lock

---

## Part 7: Kafka — Why It's Different From Redis Queue

This is the Phase 6 upgrade. The key difference:

**Redis Queue (Celery)**:
```
Producer → [Queue] → Consumer (message DELETED after consumed)
```
- One consumer per message
- Message gone after processing
- Great for: task execution

**Kafka**:
```
Producer → [Topic/Log] → Consumer Group A (reads at their own pace)
                       → Consumer Group B (reads at their own pace)
                       → Consumer Group C (can replay from 1 hour ago)
```
- Multiple consumer groups, each gets ALL messages
- Messages persist (configurable — 7 days, forever, etc.)
- Can replay events (imagine: "re-run AI analysis on all repos from last month")
- Great for: events, audit logs, triggering multiple downstream actions

**Concrete example in our system**:
```
API publishes → Kafka topic: "job.completed"

Consumer A (Notification Service): "send user a WebSocket update"
Consumer B (Analytics Service):    "increment user's job count"
Consumer C (Billing Service):      "record this job for billing"

→ All three happen independently, API doesn't know or care about any of them
```

Without Kafka: API would have to call Notification, Analytics, and Billing directly. Add a fourth service? Change the API. With Kafka: add a new consumer, zero changes to API. **That's decoupling.**

---

## Part 8: Docker — What Each Container Is

```
Container 1: api-gateway
  └── FastAPI app + uvicorn
  └── Exposed port: 8000
  └── Talks to: Redis, Neon DB (cloud), Kafka

Container 2: worker
  └── Celery app (same codebase as api-gateway, different entrypoint)
  └── No exposed port (it's internal)
  └── Talks to: Redis (for tasks), Neon DB (to save results), Gemini API

Container 3: redis
  └── Official Redis image
  └── Port: 6379 (only accessible inside Docker network)

Container 4: kafka (Phase 6)
  └── Bitnami Kafka (KRaft mode — no Zookeeper needed)
  └── Port: 9092

Container 5: frontend (Phase 8)
  └── Node + Vite dev server
  └── Port: 3000
```

**Key concept — Docker Networks**:
All containers in the same `docker-compose.yml` share a network. They talk to each other by **service name**, not IP:
- Worker calls Redis: `redis://redis:6379` (not `redis://localhost:6379`)
- API calls Kafka: `kafka:9092`
- This is why Docker Compose is powerful for local dev.

---

## Part 9: Kubernetes — The Step Up

When you go from Docker Compose → Kubernetes, here's the mental model shift:

| Docker Compose concept | Kubernetes equivalent |
|------------------------|----------------------|
| Service in compose | Deployment + Service |
| Port mapping | Service (ClusterIP / NodePort) |
| `scale: 2` | `replicas: 2` in Deployment |
| Health check | `livenessProbe` + `readinessProbe` |
| Environment variables | ConfigMap (non-secret) + Secret (sensitive) |
| Volume | PersistentVolumeClaim |
| "auto-scale if busy" | HorizontalPodAutoscaler (HPA) |

**Why HPA + Kafka is the killer combo**:
```
Kafka topic has 1000 pending events
HPA sees: Worker pods are at 80% CPU
HPA action: Scale workers from 2 → 8 pods
8 Celery workers now drain the queue in parallel
Queue drops → HPA scales back down to 2
```
This is **real auto-scaling**. This is what companies run in production.

---

## Part 10: How Our Sessions Will Work

Every session from here:

```
1. CONCEPT (5-10 min)
   └── I explain the thing we're about to build and WHY
   └── You ask questions until it makes sense

2. STRUCTURE (5 min)
   └── I show you the file structure for this session
   └── Exactly what files, what each one does

3. BUILD (30-60 min)
   └── I give you one file at a time
   └── I explain every non-obvious line before you write it
   └── You write it, confirm it's done

4. TEST (10-15 min)
   └── We test together (curl / pytest / browser)
   └── I explain what a passing test proves

5. RECAP (5 min)
   └── What we just built, how it fits the big picture
   └── What's next
```

> [!IMPORTANT]
> **The rule**: If anything is unclear — stop and ask. I'd rather spend 20 minutes making sure you understand WHY we're doing something than have you copy-paste code you don't own. You should be able to explain every file in this repo in an interview.

---

## Part 11: Repo Setup Commands (Do This Now)

Here's what you'll run to create the repo scaffold. **Don't run yet — just read through it first.**

```powershell
# Create the project root (outside OneDrive)
mkdir C:\Projects\ai-devops-assistant
cd C:\Projects\ai-devops-assistant

# Initialize git
git init
echo "# AI DevOps Assistant Platform" >> README.md

# Create the folder structure
mkdir services\api-gateway
mkdir services\worker
mkdir services\kafka-consumers
mkdir frontend
mkdir k8s\api-gateway
mkdir k8s\worker
mkdir k8s\kafka
mkdir k8s\redis

# Create root-level files
New-Item docker-compose.yml
New-Item .gitignore
New-Item README.md -Force

# Initialize uv project for api-gateway
cd services\api-gateway
uv init --no-workspace
cd ..\..

# Initialize uv project for worker
cd services\worker
uv init --no-workspace
cd ..\..
```

> [!NOTE]
> **`--no-workspace`** is important here. By default `uv init` inside a parent directory that has `pyproject.toml` will try to make it a uv workspace. We want each service to be fully independent. We'll revisit uv workspaces later — they're a more advanced pattern.

---

## Part 12: What The `.gitignore` Should Cover

This monorepo needs one root `.gitignore` that handles Python, Node, and Docker artifacts:

```gitignore
# Python
__pycache__/
*.py[cod]
.venv/
*.egg-info/
dist/
.pytest_cache/

# uv
uv.lock         # DON'T ignore this — lockfile should be committed
.python-version # Keep this too

# Environment
.env
.env.*
!.env.example   # DO commit the example

# Docker
*.log

# Node / Frontend
node_modules/
.next/
dist/

# Kubernetes secrets (never commit real secrets)
k8s/**/secret.yaml

# OS
.DS_Store
Thumbs.db
```

---

---

## Part 13: Kafka Tooling — What You Actually Need

**Short answer**: Just Docker. No desktop app.

Your local Kafka setup runs two containers:
```
kafka     → the broker (KRaft mode — no Zookeeper needed)
kafka-ui  → a web app at localhost:8080 that shows:
              - All topics
              - Messages in each topic (browse them like a feed)
              - Consumer group lag (how far behind are your consumers?)
              - Producer/consumer throughput graphs
```

Kafka UI (open-source, by Provectus) is exactly what Conduktor or Offset Explorer gives you — but free, runs in Docker, no account needed.

---

## Part 14: Scaling Architecture (1k–10k+ Users)

Here's how the system handles scale at every layer:

```
Incoming Traffic (1k-10k users)
        ↓
[Nginx Ingress] → load balances across API Gateway pods
        ↓
K8s HPA: scales API pods (2 → 20) based on CPU/requests
        ↓
[FastAPI] → async, non-blocking → 1 pod handles ~500 concurrent requests
        ↓
[Redis Queue] → jobs pile up here (this is the buffer)
        ↓
KEDA watches queue depth:
  • 10 jobs in queue  → 2 worker pods
  • 500 jobs in queue → 25 worker pods (auto-scaled)
  • 5000 jobs → 50 pods (instant scale-out)
        ↓
[Neon Postgres] → PgBouncer built-in (handles connection storms)
                   max 100 simultaneous DB connections
```

**Per-user rate limiting** (added Phase 1):
```python
# slowapi — 3 lines of code, huge production value
@app.get("/jobs")
@limiter.limit("100/minute")  # per user, per IP
async def get_jobs(...):
```
This prevents one user hammering the API and degrading service for everyone else.

**Cache-first AI calls** (added Phase 4):
```
Same repo + same commit SHA → Redis cache hit → instant (0 Gemini calls)
First-time analysis → Gemini call → result cached for 24h
```
At 10k users, many will analyze popular repos (React, FastAPI, etc.). Caching means Gemini only gets called once per unique repo version.

---

## Part 15: Production Deployment Stack (All Free)

```
┌────────────────────────────────────────────┐
│  LAYER           SERVICE        COST             │
├────────────────────────────────────────────┤
│  Frontend        Vercel         Free             │
│  API Gateway     Railway        $5 credit/mo     │
│  Celery Worker   Railway        same project     │
│  PostgreSQL       Neon           Free (512MB)     │
│  Redis            Upstash        Free (10k/day)   │
│  Kafka            Upstash        Free (10k msg)   │
└────────────────────────────────────────────┘
```

**Why NOT Vercel for backend**: Vercel serverless functions time out at **10 seconds**. A Celery worker job (clone repo + analyze + call Gemini) can take **30–120 seconds**. It would be killed halfway. Railway runs persistent processes — no timeout, just like a real server.

**Upstash** is the hero for free production:
- Upstash Redis: HTTP-based Redis — works perfectly with our `redis-py` client
- Upstash Kafka: Serverless Kafka with a REST API — same `confluent-kafka` client, different config

Switch from local → production is just changing 3 environment variables. No code changes.

---

## ✅ Session 0 Complete — You Now Know:

- [ ] The end-to-end system flow (API → DB → Redis → Celery → Gemini → Kafka → Frontend)
- [ ] Why microservices (scalability, independent deployment)
- [ ] GitHub OAuth flow (6-step dance, what happens server-side)
- [ ] `uv` vs `pip` and what `pyproject.toml` replaces
- [ ] Why 5 tables, and why `ai_logs` and `job_results` are separate
- [ ] Celery + Redis mental model (pizza restaurant analogy)
- [ ] Kafka vs Redis queue — the fundamental difference
- [ ] Docker containers and networking (service names, not localhost)
- [ ] Kubernetes mental model and why HPA + Kafka is powerful
- [ ] Our session structure (Concept → Structure → Build → Test → Recap)

---

## 🚀 What's Next: Phase 1

**First session of Phase 1** will cover:
1. Setting up the `api-gateway` with `uv`:
   - `pyproject.toml` structure
   - FastAPI app skeleton
   - `pydantic-settings` for config
   - GitHub OAuth registration on GitHub.com
   - First endpoint: `GET /health`
   - Second endpoint: `GET /auth/github` → redirect to GitHub
   - Third endpoint: `GET /auth/callback` → exchange code for JWT

**Say "ready for Phase 1" when you're set to go.** 🔥
