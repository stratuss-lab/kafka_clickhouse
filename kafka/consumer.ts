import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "dummy-event-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "dummy-event-consumer-group",
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

      console.log("Received event:");
      console.log(value);
    },
  });
}

main().catch((error) => {
  console.error("Consumer failed:", error);
  process.exit(1);
});