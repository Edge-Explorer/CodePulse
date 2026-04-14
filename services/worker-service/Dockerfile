# Stage 1: The Builder
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy 
WORKDIR /app

RUN --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Stage 2: The Runtime
FROM python:3.12-slim-bookworm 

# INSTALL GIT: The worker needs this to clone repos!
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY . .

# Launch the worker!
CMD ["python", "-m", "src.main"]