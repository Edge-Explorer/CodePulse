# API Gateway

The API Gateway is the primary entry point for all client-facing requests in the CodePulse platform. It handles user authentication via GitHub OAuth, project management, and asynchronous task delegation to the worker fleet through Apache Kafka.

## Responsibilities

- GitHub OAuth 2.0 authentication flow and JWT session management
- Repository validation against the GitHub REST API
- Project creation and persistence to PostgreSQL via SQLAlchemy (async)
- Publishing scan tasks to the `project_scans` Kafka topic
- Exposing REST endpoints for project listing and AI report retrieval

## Technology Stack

| Component       | Library / Tool              |
|-----------------|-----------------------------|
| Web Framework   | FastAPI                     |
| Database ORM    | SQLAlchemy (async) + asyncpg|
| Migrations      | Alembic                     |
| Messaging       | aiokafka                    |
| HTTP Client     | httpx                       |
| Auth            | python-jose, passlib        |
| Configuration   | pydantic-settings           |
| Server          | Uvicorn                     |

## Project Structure

```
services/api-gateway/
├── src/
│   ├── core/
│   │   ├── config.py         # Settings loaded from environment variables
│   │   ├── database.py       # Async SQLAlchemy engine and session factory
│   │   ├── dependencies.py   # FastAPI dependency injection (current user, db)
│   │   ├── kafka.py          # Kafka producer utility
│   │   └── security.py       # JWT encoding and decoding logic
│   ├── models/
│   │   ├── user.py           # User ORM model
│   │   ├── project.py        # Project ORM model
│   │   └── scan_report.py    # ScanReport ORM model (JSON report column)
│   ├── routers/
│   │   ├── auth.py           # GitHub OAuth routes
│   │   └── projects.py       # Project CRUD and report retrieval routes
│   ├── schemas/
│   │   └── project.py        # Pydantic request/response schemas
│   └── main.py               # FastAPI application factory and startup hooks
├── migrations/               # Alembic migration scripts
├── Dockerfile                # Multi-stage production Docker image (uv-based)
├── pyproject.toml            # Project metadata and dependencies
└── uv.lock                   # Locked dependency manifest for reproducible builds
```

## API Endpoints

| Method | Path                          | Description                                  |
|--------|-------------------------------|----------------------------------------------|
| GET    | `/auth/github/login`          | Redirects the user to GitHub for OAuth       |
| GET    | `/auth/github/callback`       | Handles the OAuth callback and issues a JWT  |
| POST   | `/projects/`                  | Creates a project and submits a scan task    |
| GET    | `/projects/`                  | Lists all projects owned by the current user |
| GET    | `/projects/{id}/report`       | Retrieves the latest AI scan report          |

## Environment Variables

The service reads its configuration from a `.env` file at the repository root. The following variables are required:

| Variable               | Description                                      |
|------------------------|--------------------------------------------------|
| `DATABASE_URL`         | Async PostgreSQL connection string (asyncpg)     |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker address (e.g. `127.0.0.1:9092`)  |
| `GITHUB_CLIENT_ID`     | GitHub OAuth App client ID                       |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret                   |
| `JWT_SECRET`           | Secret key for signing JWT tokens                |

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

Run the following from the repository root:

```bash
docker build -t codepulse-api:latest ./services/api-gateway
```
