# Stage 1: The Builder
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app


# Install dependencies only (makes builds fast!)
RUN --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    uv sync --frozen --no-install-project --no-dev

# Stage 2: The Runtime
FROM python:3.12-slim-bookworm

WORKDIR /app

# Copy the environment we built
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy our code
COPY . . 

# Expose the API port
EXPOSE 8000

# Start the server!
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]