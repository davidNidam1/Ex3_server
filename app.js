require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const customEnv = require("custom-env");
const net = require("net");
const mongoose = require("mongoose");

customEnv.env(process.env.NODE_ENV, "./config");

console.log(process.env.CONNECTION_STRING);
console.log(process.env.PORT);

mongoose.connect(process.env.CONNECTION_STRING); // Removed deprecated options

const app = express();

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json({ limit: "100mb" }));
app.use(cors());
app.use(express.static("public"));

// Function to communicate with the C++ server
const communicateWithCppServer = (message) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const cppServerPort = process.env.CPP_SERVER_PORT || 8080;
    const cppServerHost = process.env.CPP_SERVER_HOST || "127.0.0.1";

    client.connect(cppServerPort, cppServerHost, () => {
      console.log("Connected to C++ server");
      client.write(message);
    });

    client.on("data", (data) => {
      resolve(data.toString());
      client.destroy(); // close the connection
    });

    client.on("error", (err) => {
      reject("Error: " + err.message);
    });

    client.on("close", () => {
      console.log("Connection to C++ server closed");
    });
  });
};

// Function to initialize Bloom filter and add URLs
const initializeCppServer = async () => {
  const urls = process.env.INITIAL_URLS.split(",");

  // Example message to initialize Bloom filter size and hash functions
  let initMessage = "1000 1"; // Example: bloom filter size 1000 and hash function type 1
  await communicateWithCppServer(initMessage);

  // Add URLs to the Bloom filter
  for (const url of urls) {
    let addMessage = `1 ${url}`; // Command 1 to add URL
    await communicateWithCppServer(addMessage);
  }
};

if (process.env.INITIALIZE_BLOOM_FILTER === "true") {
  initializeCppServer()
    .then(() => {
      console.log("C++ server initialized with URLs.");
    })
    .catch((err) => {
      console.error("Failed to initialize C++ server:", err);
    });
}

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
