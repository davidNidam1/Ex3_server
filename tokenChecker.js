const tokenService = require('../services/token');


const tokenChecker = async (req) => {
    // Check if token is valid:
    // TODO: check that if:
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        // Token is missing or not provided in the correct format
        return { error: 'Missing or invalid token' };
    }

    const token = await req.headers.authorization.split(' ')[1];
    const affirmedToken = await tokenService.verifyToken(token);

    // affirmedToken = username
    return affirmedToken;
};

module.exports = { tokenChecker }
