import { Kafka } from "kafkajs";
// This is a simple Kafka producer that publishes a dummy event to a Kafka topic named "test-events".
const kafka = new Kafka({
  clientId: "dummy-event-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
// Define a dummy event to be published
const event = {
  event_name: "POST_VIEW",
  user_id: "user-123",
  post_id: "post-456",
  timestamp: new Date().toISOString(),
};

async function main() {
  await producer.connect();
// Publish the dummy event to the "test-events" topic
  await producer.send({
    topic: "test-events",
    messages: [
      {
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("Event published successfully!");
  console.log(event);

  await producer.disconnect();
}

main().catch((error) => {
  console.error("Failed to publish event:", error);
  process.exit(1);
});