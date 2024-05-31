const {
  connectToCppServer,
  communicateWithCppServer,
} = require("./cppConnection");

const checkForCorruptedUrls = async (text) => {
  const message = `2 ${text}`;
  try {
    await connectToCppServer();
    const response = await communicateWithCppServer(message);
    if (response.trim() === "true true") {
      return true;
    }
  } catch (error) {
    console.error(`Error checking for URL in ${text}:`, error);
    throw error;
  }
  return false;
};

module.exports = { checkForCorruptedUrls };
