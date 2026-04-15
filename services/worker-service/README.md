# Worker Service

The Worker Service is a headless, event-driven consumer that performs AI-powered code analysis on GitHub repositories. It listens to the `project_scans` Kafka topic, clones the target repository, runs a multi-dimensional security and architecture scan using the Google Gemini API, and persists the resulting report to a PostgreSQL database.

## Responsibilities

- Consuming scan task messages from the Apache Kafka `project_scans` topic
- Cloning GitHub repositories to a temporary local directory
- Reading and aggregating source code files for analysis
- Invoking the Gemini 2.0 Flash model to generate structured security and architecture reports
- Writing the AI-generated JSON report to the `scan_reports` table in PostgreSQL
- Cleaning up cloned repository data after each scan

## Technology Stack

| Component       | Library / Tool              |
|-----------------|-----------------------------|
| Messaging       | aiokafka                    |
| AI Model        | google-genai (Gemini 2.0 Flash) |
| Database ORM    | SQLAlchemy (async) + asyncpg|
| HTTP Client     | httpx                       |
| Configuration   | pydantic-settings           |
| Runtime         | Python 3.12 (asyncio)       |

## Project Structure

```
services/worker-service/
├── src/
│   ├── config.py         # Settings loaded from environment variables
│   ├── database.py       # Async SQLAlchemy engine and session factory
│   ├── models.py         # ScanReport ORM model
│   ├── scanner.py        # Core AI scanning logic using the Gemini API
│   └── main.py           # Kafka consumer loop and task orchestration
├── Dockerfile            # Multi-stage production Docker image (uv-based, includes git)
├── pyproject.toml        # Project metadata and dependencies
└── uv.lock               # Locked dependency manifest for reproducible builds
```

## Scan Pipeline

The worker executes the following steps for each incoming Kafka message:

1. **Receive Task**: Deserializes the JSON message containing `project_id`, `repo_url`, and `language`.
2. **Clone Repository**: Uses `git clone` to download the repository to a temporary directory.
3. **Read Source Files**: Iterates through code files and aggregates their content for the AI context window.
4. **Run AI Analysis**: Sends the aggregated code to the Gemini 2.0 Flash model with a structured prompt requesting a security and architecture report.
5. **Persist Report**: Saves the structured JSON response to the `scan_reports` table, linked to the originating `project_id`.
6. **Cleanup**: Removes the temporary cloned directory to free disk space.

## Environment Variables

| Variable                  | Description                                         |
|---------------------------|-----------------------------------------------------|
| `DATABASE_URL`            | Async PostgreSQL connection string (asyncpg)        |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker address (e.g. `127.0.0.1:9092`)       |
| `GEMINI_API_KEY`          | API key for the Google Gemini service               |

## Running Locally

Ensure Docker Compose is running to provide a Kafka broker before starting the worker.

```bash
# Start the Kafka broker
docker-compose up -d

# Install dependencies
uv sync

# Start the worker
uv run python -m src.main
```

## Building the Docker Image

Run the following from the repository root. The image includes `git` as a runtime dependency for repository cloning.

```bash
docker build -t codepulse-worker:latest ./services/worker-service
```
