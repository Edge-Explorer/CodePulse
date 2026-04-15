# CodePulse

> **Learning Project Notice:** This is my first microservices project. I am actively learning Docker, Kubernetes, and event-driven architecture while building this. The code is functional and the cluster runs locally, but I am still deepening my understanding of how every piece fits together. This README documents both what I built and what I learned along the way.

---

CodePulse is an AI-powered DevOps platform that automates code review, security analysis, and repository health assessment. I built this to understand what a production-grade backend architecture actually looks like — moving away from single-folder monolith FastAPI apps into a properly structured, containerized, and orchestrated microservices system.

## What I Learned While Building This

Coming from writing simple single-file FastAPI applications, this project taught me:

- **Why microservices?** Instead of one large application crashing entirely when one feature breaks, each service (API Gateway, Worker) runs independently. If one pod crashes, Kubernetes restarts it while the other keeps serving traffic.
- **Why Kafka?** The API Gateway does not perform the heavy AI analysis itself. It publishes a message to a Kafka topic, and the Worker Service picks it up asynchronously. This means thousands of users can submit requests without the API server becoming a bottleneck.
- **Why Docker?** Instead of environment-specific bugs, Docker packages the application and its entire runtime environment into a portable container image that behaves identically everywhere.
- **Why Kubernetes?** Docker runs a single container. Kubernetes manages a fleet of containers — restarting crashed ones, load-balancing traffic across replicas, and scaling based on demand.
- **Why replicas?** Running 2 copies of the API Gateway means if one pod crashes, users are instantly routed to the second one. No downtime. This is called High Availability.

## Current Status

All services are successfully deployed in a local Kubernetes cluster running on Docker Desktop.

| Service | Status | Description |
|---|---|---|
| API Gateway | Running (2 replicas) | FastAPI, handles auth and project submission |
| Worker Service | Running | Consumes Kafka tasks, runs Gemini AI scans |
| Kafka Broker | Running | Message queue between the API and Worker |
| Zookeeper | Running | Coordination layer for Kafka |

## What It Does

**GitHub OAuth Login** — Users authenticate with their GitHub account. The platform issues a signed JWT for subsequent API requests.

**Submit a Repository** — The user POSTs a GitHub repository URL. The API validates the request, persists the project to PostgreSQL, and publishes a scan task to Kafka.

**Asynchronous AI Scan** — The Worker Service consumes the task from Kafka, clones the repository, reads the source files, and sends them to Google Gemini 2.0 Flash for a structured security and architecture analysis.

**Retrieve the Report** — The user requests the scan report via the API. The structured JSON report is returned from PostgreSQL.

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| API Framework | FastAPI | Async HTTP server for all client-facing endpoints |
| Event Streaming | Apache Kafka | Decouples API from heavy AI processing |
| Database | PostgreSQL (Neon) | Stores users, projects, and scan reports |
| AI Provider | Google Gemini 2.0 Flash | Code analysis and report generation |
| Containerization | Docker | Reproducible, portable service images |
| Orchestration | Kubernetes | Container lifecycle management and scaling |
| Auto-scaling | KEDA | Scales workers based on Kafka consumer lag |
| Package Manager | uv | Fast, reproducible Python dependency management |

## Repository Structure

```
CodePulse/
├── services/
│   ├── api-gateway/       FastAPI application, authentication, project endpoints
│   └── worker-service/    Kafka consumer, AI scanning engine
├── k8s/
│   ├── api-gateway/       Kubernetes Deployment and Service for the API Gateway
│   ├── worker/            Kubernetes Deployment and KEDA ScaledObject for the Worker
│   ├── kafka-broker.yaml  Zookeeper and Kafka deployed inside the cluster
│   └── secrets.yaml       Kubernetes Secret template (never committed with real values)
└── .env                   Local environment variables (gitignored)
```

## Deployment Journey

Getting this cluster running taught me the kind of problems that real DevOps work involves:

1. **Image Pull Failures** — `bitnami/kafka:latest` could not be resolved. Learned that image tags can be deprecated. Fix: switched to `wurstmeister/kafka:latest` and `wurstmeister/zookeeper:latest` which are stable and widely used for local development.
2. **Hardcoded Hostnames** — The Python Kafka producer had `localhost:9092` hardcoded. Inside a Kubernetes pod, `localhost` means that specific pod, not the Kafka service. Fix: moved the broker address to a `pydantic-settings` config field and injected `kafka-service:9092` via a Kubernetes environment variable.
3. **Image Cache** — After rebuilding the Docker image, Kubernetes was still using the old cached version. Fix: tagged the new image as `v2` and updated the deployment manifest to force a rollout.
4. **`imagePullPolicy: Never`** — Required for local development so Kubernetes uses the locally built image instead of attempting to pull from Docker Hub.

## Running Locally

```bash
# Apply secrets (fill in real values first)
kubectl apply -f k8s/secrets.yaml

# Deploy internal Kafka infrastructure
kubectl apply -f k8s/kafka-broker.yaml

# Deploy the API Gateway
kubectl apply -f k8s/api-gateway/

# Deploy the Worker Service
kubectl apply -f k8s/worker/

# Verify all pods are running
kubectl get pods
```

## Planned Next Steps

- Frontend dashboard using React and Vite
- End-to-end test: submit a scan and retrieve the AI report via the API
- Production cloud deployment to GKE or EKS
- Additional microservice projects to deepen Kubernetes and distributed systems understanding
