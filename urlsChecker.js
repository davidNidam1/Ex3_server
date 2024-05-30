// urlChecker.js

require("dotenv").config();

// Function to check if a URL is blacklisted
async function checkUrlInBlacklist(url) {
    // Retrieve the blacklist URLs from environment variables
    const initialUrls = process.env.INITIAL_URLS.split(",");

    // Check if the URL is in the blacklist
    return initialUrls.includes(url);
}

module.exports = checkUrlInBlacklist;
