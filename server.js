const express = require("express");
const axios = require("axios");
const redis = require("redis");
const app = express();

const redisClient = redis.createClient({ url: "redis://localhost:6370" });
redisClient.connect();
const PORT = process.env.PORT || 3020;
const MOCK_API = "https://jsonplaceholder.typicode.com/users/";

app.get("/user/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const response = await axios.get(`${MOCK_API}?email=${email}`);
    const user = response.data;
    console.log("User successfully retrieved from the API");
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/cache/user/:email", async (req, res) => {
  const email = req.params.email;
  /*  const emai = await redisClient.get("email");
  console.log(emai); */
  try {
    console.log("in try");
    const emai = await redisClient.get("email").then(async (response) => {
      if (response) {
        console.log("User successfully retrieved from cache");
        res.status(200).send({ email: response });
      } else {
        const response = await axios.get(`${MOCK_API}?email=${email}`);
        const user = response.data[0].email;
        console.log(user);
        redisClient.set("email", user);
        console.log("User successfully retrieved from the API");
        res.status(200).send(user);
      }
    });
    //console.log(emai);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
