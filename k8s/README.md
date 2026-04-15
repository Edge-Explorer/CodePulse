# Kubernetes Infrastructure

This directory contains all Kubernetes manifests required to deploy and orchestrate the CodePulse platform on a Kubernetes cluster. The architecture follows a microservices model, with separate workloads for the API Gateway and the AI Worker Service.

## Directory Structure

```
k8s/
├── api-gateway/
│   ├── deployment.yaml     # Deployment for the FastAPI API Gateway (2 replicas)
│   └── service.yaml        # LoadBalancer Service exposing the API on port 80
├── worker/
│   ├── deployment.yaml     # Deployment for the AI Worker Service (starts at 1 replica)
│   └── scaledobject.yaml   # KEDA ScaledObject for event-driven autoscaling via Kafka
└── secrets.yaml            # Kubernetes Secret template (never commit with real values)
```

## Components

### API Gateway (`api-gateway/`)

| Manifest          | Kind        | Description                                                  |
|-------------------|-------------|--------------------------------------------------------------|
| `deployment.yaml` | Deployment  | Runs 2 replicas of the FastAPI server for high availability  |
| `service.yaml`    | Service     | Exposes the API externally via a LoadBalancer on port 80     |

The deployment injects all sensitive credentials (database URL, GitHub OAuth keys, JWT secret) directly from the `codepulse-secrets` Kubernetes Secret at runtime. No credentials are baked into the image.

### Worker Service (`worker/`)

| Manifest            | Kind         | Description                                                       |
|---------------------|--------------|-------------------------------------------------------------------|
| `deployment.yaml`   | Deployment   | Runs the Kafka consumer and AI scanner as a Kubernetes workload   |
| `scaledobject.yaml` | ScaledObject | KEDA configuration to scale workers 1-10 based on Kafka lag       |

The worker scales horizontally based on the number of unprocessed messages in the `project_scans` Kafka topic. With a `lagThreshold` of 5, one additional worker replica is added for every 5 pending scan tasks.

### Secrets (`secrets.yaml`)

A `stringData` Kubernetes Secret template for local cluster deployment. Fill in the placeholder values before applying. This file is listed in `.gitignore` and must never be committed with real credentials.

| Key                    | Description                                    |
|------------------------|------------------------------------------------|
| `DATABASE_URL`         | Async PostgreSQL connection string (asyncpg)   |
| `GEMINI_API_KEY`       | Google Gemini API key                          |
| `GITHUB_CLIENT_ID`     | GitHub OAuth App client ID                     |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret                 |
| `JWT_SECRET`           | Secret key used for signing JWT tokens         |

## Deploying to a Local Cluster

Ensure Docker Desktop Kubernetes or Minikube is running, and that your local Docker images are available to the cluster.

### Step 1: Install KEDA

KEDA must be installed in the cluster before applying the ScaledObject manifest.

```bash
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda --create-namespace
```

### Step 2: Apply the Secret

Fill in your real credentials in `secrets.yaml`, then apply:

```bash
kubectl apply -f k8s/secrets.yaml
```

### Step 3: Deploy the API Gateway

```bash
kubectl apply -f k8s/api-gateway/deployment.yaml
kubectl apply -f k8s/api-gateway/service.yaml
```

### Step 4: Deploy the Worker Service

```bash
kubectl apply -f k8s/worker/deployment.yaml
kubectl apply -f k8s/worker/scaledobject.yaml
```

### Step 5: Verify the Deployment

```bash
kubectl get pods
kubectl get services
```

## Secret Management in Production

For production environments, storing secrets directly in `secrets.yaml` is not recommended. The following alternatives should be evaluated:

- **HashiCorp Vault** with the Vault Agent Injector for dynamic secret injection
- **AWS Secrets Manager** or **GCP Secret Manager** with the External Secrets Operator
- **Sealed Secrets** for encrypted secret manifests that are safe to commit to version control
