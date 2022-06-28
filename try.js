const { createClient } = require("redis");

const client = createClient({ url: 'redis://localhost:6379' });

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

client.set("test", "value");
const value = client.get("key");
