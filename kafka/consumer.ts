import { Kafka } from "kafkajs";
import { createClient } from "@clickhouse/client";
import * as dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "dummy-event-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "dummy-event-consumer-group",
});

const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
});

async function main() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "test-events",
    fromBeginning: true,
  });

  console.log("Consumer is waiting for events...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value?.toString();
      if (!value) return;

      const event = JSON.parse(value);
      console.log("Received event:", event);

      await clickhouse.insert({
        table: "events",
        values: [event],
        format: "JSONEachRow",
      });

      console.log("Inserted into ClickHouse:", event);
    },
  });
}

main().catch((error) => {
  console.error("Consumer failed:", error);
  process.exit(1);
});
