CREATE TABLE events (
  event_name String,
  user_id    String,
  post_id    String,
  timestamp  DateTime
) ENGINE = MergeTree()
ORDER BY timestamp;
