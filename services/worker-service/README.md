# Worker Service

The Worker Service is a headless, event-driven background process that performs AI-powered code analysis on GitHub repositories. It listens to the `project_scans` Kafka topic, clones the target repository, runs a security and architecture scan using Google Gemini, and persists the resulting report to PostgreSQL.

This was my first time building a purely event-driven service with no HTTP endpoints. There is no web server here — the service starts, connects to Kafka, and just waits for messages. When a message arrives, it executes the full scan pipeline and then waits again. Understanding this pattern of building a consumer-only service was a major learning milestone on this project.

## Responsibilities

- Consuming scan task messages from the Kafka `project_scans` topic
- Cloning the target GitHub repository to a temporary directory
- Reading and aggregating source code files for AI analysis
- Sending the aggregated code to Google Gemini 2.0 Flash for structured analysis
- Persisting the JSON report to the `scan_reports` table in PostgreSQL
- Cleaning up cloned repository data after each scan

## Technology Stack

| Component | Library |
|---|---|
| Kafka Client | aiokafka |
| AI Model | google-genai (Gemini 2.0 Flash) |
| Database ORM | SQLAlchemy (async) + asyncpg |
| HTTP Client | httpx |
| Configuration | python-dotenv + os.getenv |
| Runtime | Python 3.12 (asyncio) |

## Project Structure

```
services/worker-service/
├── src/
│   ├── config.py         Settings loaded from environment variables
│   ├── database.py       Async SQLAlchemy engine and session factory
│   ├── models.py         ScanReport ORM model
│   ├── scanner.py        Core AI scanning logic using the Gemini API
│   └── main.py           Kafka consumer loop and task orchestration
├── Dockerfile            Multi-stage production image using uv (includes git)
├── pyproject.toml        Project metadata and dependencies
└── uv.lock               Locked dependency manifest for reproducible builds
```

## Scan Pipeline

Each incoming Kafka message triggers the following sequence:

1. **Receive Task** — Deserializes the JSON message containing `project_id`, `repo_url`, and `language`.
2. **Clone Repository** — Uses `git clone` to download the repository to a temporary directory inside the container.
3. **Read Source Files** — Iterates through code files and aggregates their content for the AI prompt.
4. **Run AI Analysis** — Sends the aggregated code to Gemini 2.0 Flash with a structured prompt requesting a security and architecture report in JSON format.
5. **Persist Report** — Saves the structured JSON response to the `scan_reports` table, linked to the originating `project_id`.
6. **Cleanup** — Removes the temporary cloned directory to free disk space.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Async PostgreSQL connection string (asyncpg) |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker address (e.g. `kafka-service:9092` in K8s) |
| `GEMINI_API_KEY` | API key for the Google Gemini service |

## Autoscaling with KEDA

The Worker Service is configured to autoscale via a KEDA `ScaledObject` defined in `k8s/worker/scaledobject.yaml`. KEDA monitors the consumer lag on the `project_scans` Kafka topic and adds or removes worker replicas accordingly.

With a `lagThreshold` of 5, one additional replica is spawned for every 5 unprocessed messages in the queue. The worker scales between a minimum of 1 and maximum of 10 replicas. This means the system can absorb sudden spikes in scan requests without manual intervention.

## Running Locally

Ensure a Kafka broker is accessible before starting the worker.

```bash
# Install dependencies
uv sync

# Start the worker
uv run python -m src.main
```

## Building the Docker Image

The image includes `git` as a system dependency because the worker needs to clone repositories at runtime.

```bash
docker build -t codepulse-worker:latest ./services/worker-service
```
