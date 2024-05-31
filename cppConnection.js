require("dotenv").config();
const net = require("net");

const cppServerPort = process.env.CPP_SERVER_PORT || 5000;
const cppServerHost = process.env.CPP_SERVER_HOST || "127.0.0.1";

let client = new net.Socket();
let isConnected = false;
let reconnectTimeout = null;
let reconnectCallback = null;

const connectToCppServer = (callback) => {
  reconnectCallback = callback;

  return new Promise((resolve, reject) => {
    if (isConnected) {
      return resolve(); // Already connected
    }

    client.connect(cppServerPort, cppServerHost, () => {
      console.log("Connected to C++ server");
      isConnected = true;
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
      if (reconnectCallback) {
        reconnectCallback(); // Call the callback function after connecting
      }
      resolve();
    });

    client.on("data", (data) => {
      console.log("Received data:", data.toString());
    });

    client.on("error", (err) => {
      console.error("Connection error:", err.message);
      isConnected = false;
      cleanupAndReconnect();
      reject(err);
    });

    client.on("close", () => {
      console.log("Connection to C++ server closed");
      isConnected = false;
      cleanupAndReconnect();
    });
  });
};

const cleanupAndReconnect = () => {
  client.destroy();
  client = new net.Socket();
  if (!reconnectTimeout) {
    reconnectTimeout = setTimeout(
      () => connectToCppServer(reconnectCallback),
      5000
    );
  }
};

const communicateWithCppServer = (message) => {
  return new Promise((resolve, reject) => {
    if (!isConnected) {
      return reject(new Error("Not connected to C++ server"));
    }

    console.log("Sending message:", message);
    client.write(message);

    client.once("data", (data) => {
      console.log("Received data:", data.toString());
      resolve(data.toString());
    });
  });
};

module.exports = { connectToCppServer, communicateWithCppServer };
