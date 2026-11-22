FROM python:3.12-slim AS python-runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /workspace
RUN pip install --no-cache-dir jamo wcwidth requests beautifulsoup4

ENTRYPOINT ["python3"]

FROM python:3.12-slim AS web

WORKDIR /app
COPY web/ ./

EXPOSE 8000

ENTRYPOINT ["python", "serve.py", "--host", "0.0.0.0", "--port", "8000"]
