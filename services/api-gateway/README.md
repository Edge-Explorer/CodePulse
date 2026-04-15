# API Gateway

The API Gateway is the single entry point for all client-facing requests in the CodePulse platform. It handles GitHub OAuth authentication, project creation, and delegates AI scan tasks asynchronously to the Worker Service through a Kafka topic.

This was built using FastAPI with a fully asynchronous stack, meaning it can handle thousands of concurrent connections without blocking. Understanding async/await in the context of database access and HTTP calls was one of the key things I learned while building this service.

## Responsibilities

- GitHub OAuth 2.0 authentication flow and JWT session management
- Validating submitted repository URLs against the GitHub REST API
- Persisting project records to PostgreSQL via SQLAlchemy async
- Publishing scan task events to the `project_scans` Kafka topic
- Exposing REST endpoints for project listing and AI report retrieval

## Technology Stack

| Component | Library |
|---|---|
| Web Framework | FastAPI |
| Database ORM | SQLAlchemy (async) + asyncpg |
| Migrations | Alembic |
| Kafka Client | aiokafka |
| HTTP Client | httpx |
| Auth | python-jose, passlib |
| Configuration | pydantic-settings |
| Server | Uvicorn |

## Project Structure

```
services/api-gateway/
├── src/
│   ├── core/
│   │   ├── config.py         Settings loaded from environment variables via pydantic-settings
│   │   ├── database.py       Async SQLAlchemy engine and session factory
│   │   ├── dependencies.py   FastAPI dependency injection (current user, db session)
│   │   ├── kafka.py          AIOKafka producer initialization and message sending
│   │   └── security.py       JWT encoding and decoding
│   ├── models/
│   │   ├── user.py           User ORM model
│   │   ├── project.py        Project ORM model
│   │   └── scan_report.py    ScanReport ORM model
│   ├── routers/
│   │   ├── auth.py           GitHub OAuth routes
│   │   └── projects.py       Project CRUD and report retrieval
│   ├── schemas/
│   │   └── project.py        Pydantic request and response schemas
│   └── main.py               FastAPI application factory and lifespan startup hooks
├── migrations/               Alembic migration scripts
├── Dockerfile                Multi-stage production image using uv
├── pyproject.toml            Project metadata and dependencies
└── uv.lock                   Locked dependency manifest for reproducible builds
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/auth/github/login` | Redirects the user to GitHub for OAuth |
| GET | `/auth/github/callback` | Handles the OAuth callback and issues a JWT |
| POST | `/projects/` | Creates a project and publishes a Kafka scan task |
| GET | `/projects/` | Lists all projects owned by the authenticated user |
| GET | `/projects/{id}/report` | Retrieves the latest AI scan report |

## Environment Variables

All configuration is managed through `pydantic-settings`. The `Settings` class reads values from environment variables, which are injected by Kubernetes Secrets at runtime.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Async PostgreSQL connection string (asyncpg) |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker address (e.g. `kafka-service:9092` in K8s) |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `JWT_SECRET` | Secret key for signing JWT tokens |

## Key Bug I Debugged During Deployment

The Kafka producer in `src/core/kafka.py` originally had the broker address hardcoded as `localhost:9092`. In Kubernetes, `localhost` inside a pod refers to that pod itself, not the Kafka service. The fix was to remove the hardcoded value and read it from `settings.KAFKA_BOOTSTRAP_SERVERS`, which receives `kafka-service:9092` via the K8s deployment manifest.

This was the root cause of persistent `CrashLoopBackOff` errors even after Kafka was running successfully inside the cluster.

## Docker Image Versioning

During local Kubernetes development, rebuilding an image with the same tag (e.g., `latest`) does not trigger a pod rollout because Kubernetes believes the image is unchanged. To force a rollout after a code change, the image must be rebuilt with a new version tag and the deployment manifest must be updated to reference it.

Current production image tag: `codepulse-api:v2`

## Running Locally

```bash
# Install dependencies
uv sync

# Apply database migrations
uv run alembic upgrade head

# Start the development server
uv run uvicorn src.main:app --reload
```

## Building the Docker Image

```bash
docker build -t codepulse-api:v2 ./services/api-gateway
```
