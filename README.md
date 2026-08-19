# Kafka → ClickHouse Real-Time Event Pipeline

A real-time event streaming pipeline built with **Apache Kafka** and **ClickHouse Cloud**. Events are published to a Kafka topic and consumed in real-time, then inserted into ClickHouse for analytics.

## Architecture

```
Producer → Kafka (test-events topic) → Consumer → ClickHouse Cloud
```

## Tech Stack

- **Apache Kafka** - event streaming (Docker, KRaft mode)
- **ClickHouse Cloud** - real-time analytics database (free tier)
- **KafkaJS** - Kafka client for Node.js
- **TypeScript** - language

## Project Structure

```
kafka_clickhouse/
├── kafka/
│   ├── producer.ts          # publishes events to Kafka
│   └── consumer.ts          # consumes events and inserts into ClickHouse
├── clickhouse/
│   └── 02_events_table.sql  # ClickHouse table definition
├── docker-compose.yml        # Kafka broker setup
├── .env                      # ClickHouse Cloud credentials (not committed)
└── package.json
```

## Event Schema

```json
{
  "event_name": "POST_VIEW",
  "user_id": "user-123",
  "post_id": "post-456",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Setup

### 1. Prerequisites

- [Docker](https://www.docker.com/) installed
- [Node.js](https://nodejs.org/) installed
- [ClickHouse Cloud](https://clickhouse.cloud) account (free tier)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the project root:

```env
CLICKHOUSE_HOST=https://<your-host>.clickhouse.cloud:8443
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=your_password_here
```

### 4. Start Kafka

```bash
docker-compose up -d
```

### 5. Create ClickHouse table

Run this in your ClickHouse Cloud SQL Console:

```sql
CREATE TABLE events (
  event_name String,
  user_id    String,
  post_id    String,
  timestamp  DateTime
) ENGINE = MergeTree()
ORDER BY timestamp;
```

## Running

**Terminal 1 - Start the consumer:**

```bash
npx tsx kafka/consumer.ts
```

**Terminal 2 - Publish an event:**

```bash
npx tsx kafka/producer.ts
```

## Verify in ClickHouse

```sql
SELECT * FROM events;
```

Expected output:

```
POST_VIEW | user-123 | post-456 | 2025-01-01 00:00:00
```
