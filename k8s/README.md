# Kubernetes Infrastructure

This directory contains all Kubernetes manifests required to deploy the CodePulse platform on a local cluster. The architecture follows a microservices pattern with separate workloads for the API Gateway, the AI Worker Service, and the internal Kafka message broker.

This was my first time writing Kubernetes YAML from scratch. The structure initially looked overwhelming, but I eventually understood that every manifest follows the same skeleton: `apiVersion`, `kind`, `metadata`, and `spec`. Once you understand what each block does, reading and writing them becomes natural.

## Directory Structure

```
k8s/
├── api-gateway/
│   ├── deployment.yaml     Deployment for the FastAPI API Gateway (2 replicas)
│   └── service.yaml        LoadBalancer Service exposing the API on port 80
├── worker/
│   ├── deployment.yaml     Deployment for the AI Worker Service
│   └── scaledobject.yaml   KEDA ScaledObject for Kafka-based autoscaling
├── kafka-broker.yaml       Zookeeper and Kafka Deployments and Services
└── secrets.yaml            Kubernetes Secret template (never commit real values)
```

## Understanding the YAML Structure

Every Kubernetes manifest I wrote follows this pattern:

```yaml
apiVersion: apps/v1       # Which K8s API version handles this resource
kind: Deployment          # What type of resource this is
metadata:
  name: api-gateway       # The name of this resource in the cluster
spec:                     # What I want Kubernetes to do
  replicas: 2             # How many copies to run
  ...
```

The `selector` and `labels` pair is how Kubernetes links a Deployment to its Pods, and how a Service knows which Pods to send traffic to. Getting this wrong causes the Service to not find any backend pods at all.

## Components

### API Gateway

| Manifest | Kind | Description |
|---|---|---|
| `api-gateway/deployment.yaml` | Deployment | Runs 2 replicas of the FastAPI server for high availability |
| `api-gateway/service.yaml` | Service | Exposes the API externally via a LoadBalancer on port 80 |

Running 2 replicas means if one pod crashes, Kubernetes automatically routes all traffic to the healthy replica while it restarts the failed one. The `Service` acts as the load balancer in front of both pods.

Sensitive credentials (database URL, GitHub OAuth keys, JWT secret) are injected from the `codepulse-secrets` Kubernetes Secret at runtime. They are not baked into the image.

### Worker Service

| Manifest | Kind | Description |
|---|---|---|
| `worker/deployment.yaml` | Deployment | Runs the Kafka consumer and AI scanner |
| `worker/scaledobject.yaml` | ScaledObject | KEDA scales worker count 1-10 based on Kafka lag |

The Worker scales horizontally based on the number of unprocessed messages in the `project_scans` Kafka topic. With a `lagThreshold` of 5, one additional worker replica is spawned for every 5 pending scan jobs. This is called event-driven autoscaling.

### Kafka Broker (`kafka-broker.yaml`)

This manifest deploys both the Zookeeper and Kafka services inside the cluster so the API Gateway and Worker Service can communicate internally without needing an external broker.

| Resource | Kind | Description |
|---|---|---|
| `zookeeper-service` | Service | Internal DNS entry for Kafka's coordination service |
| `zookeeper` | Deployment | Runs the Zookeeper process |
| `kafka-service` | Service | Internal DNS entry so pods can connect via `kafka-service:9092` |
| `kafka` | Deployment | Runs the Kafka broker |

**Key lesson learned:** Inside Kubernetes, pods cannot use `localhost` to reach other services. They must use the Kubernetes Service DNS name (e.g., `kafka-service:9092`). This was the root cause of the `CrashLoopBackOff` issues I debugged during deployment.

### Secrets

A `stringData` Kubernetes Secret template for local cluster deployment. Fill in the values before applying. This file is listed in `.gitignore` and must never be committed with real credentials.

| Key | Description |
|---|---|
| `DATABASE_URL` | Async PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `JWT_SECRET` | Secret key for signing JWT tokens |

## Deploying to a Local Cluster

Ensure Docker Desktop Kubernetes is enabled and your local Docker images have been built.

### Step 1: Install KEDA

KEDA must be installed in the cluster before applying the ScaledObject manifest.

```bash
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda --create-namespace
```

### Step 2: Apply the Secret

```bash
kubectl apply -f k8s/secrets.yaml
```

### Step 3: Deploy Kafka Infrastructure

```bash
kubectl apply -f k8s/kafka-broker.yaml
```

### Step 4: Deploy the API Gateway

```bash
kubectl apply -f k8s/api-gateway/deployment.yaml
kubectl apply -f k8s/api-gateway/service.yaml
```

### Step 5: Deploy the Worker Service

```bash
kubectl apply -f k8s/worker/deployment.yaml
kubectl apply -f k8s/worker/scaledobject.yaml
```

### Step 6: Verify

```bash
kubectl get pods
kubectl get services
```

All pods should show `1/1 Running` status. If a pod shows `CrashLoopBackOff`, check its logs with `kubectl logs <pod-name>`.

## Key Concepts I Learned

- **`imagePullPolicy: Never`** — Required for locally built images. Without this, Kubernetes tries to pull from Docker Hub and fails.
- **Image versioning** — Using `latest` causes Kubernetes to cache the old image. Tagging images as `v1`, `v2`, etc. forces a proper rollout when the code changes.
- **Service DNS** — Every Kubernetes Service gets an internal DNS name matching its `metadata.name`. Pods use this name (not `localhost` or IP addresses) to communicate.
- **Replicas vs autoscaling** — `replicas` sets a fixed count. KEDA's `ScaledObject` dynamically adjusts that count based on real workload signals (Kafka queue depth in this case).
