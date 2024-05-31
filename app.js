require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const customEnv = require("custom-env");
const mongoose = require("mongoose");
const {
  connectToCppServer,
  communicateWithCppServer,
} = require("./cppConnection");

customEnv.env(process.env.NODE_ENV, "./config");

console.log("MongoDB Connection String:", process.env.CONNECTION_STRING);
console.log("Server Port:", process.env.PORT);
console.log("Initialize Bloom Filter:", process.env.INITIALIZE_BLOOM_FILTER);
console.log("Initial URLs:", process.env.INITIAL_URLS);

mongoose.connect(process.env.CONNECTION_STRING);

const app = express();

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json({ limit: "100mb" }));
app.use(cors());
app.use(express.static("public"));

const initializeCppServer = async () => {
  const urls = process.env.INITIAL_URLS.split(",");
  console.log("Initializing Bloom filter with URLs");

  try {
    for (const url of urls) {
      console.log("Adding URL to Bloom filter:", url);
      let addMessage = `1 ${url}`; // Command 1 to add URL
      await communicateWithCppServer(addMessage);
    }
    return true;
  } catch (err) {
    console.error("Failed to initialize C++ server:", err);
    return false;
  }
};

const init = async () => {
  if (process.env.INITIALIZE_BLOOM_FILTER === "true") {
    try {
      await connectToCppServer(initializeCppServer);
      const isInitialized = await initializeCppServer();
      if (isInitialized) {
        console.log("C++ server initialized with URLs.");
      }
    } catch (err) {
      console.error("Failed to initialize C++ server:", err);
    }
  }
};

init(); // Call the initialization function

app.post("/sendToCppServer", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await communicateWithCppServer(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Other routes and middleware
const post = require("./routes/post");
const user = require("./routes/user");
const token = require("./routes/token");

app.use("/api/users", user);
app.use("/api/tokens", token);
app.use("/api/posts", post);

app.listen(process.env.PORT, () => {
  console.log(`Node.js server running on port ${process.env.PORT}`);
});
