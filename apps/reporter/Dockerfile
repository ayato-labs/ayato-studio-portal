# --- Stage 1: Builder ---
FROM python:3.12-slim AS builder

WORKDIR /app

# Install system dependencies needed for build
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

# Install dependencies (Max caching efficiency)
COPY pyproject.toml uv.lock ./
RUN uv pip compile pyproject.toml -o requirements.txt && \
    uv pip install --system --no-cache -r requirements.txt

# --- Stage 2: Runtime ---
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/src

# Install minimal runtime libraries for lxml
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy production code
COPY . .

# Run the batch orchestration layer (Cloud Run Job default, AI-specialized)
CMD ["python", "main.py", "--engine", "tech"]
