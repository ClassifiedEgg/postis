const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {

    // Get token from the header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized" });
    }

    // Verify token
    try {

        const decodedMsg = jwt.decode(token, 'mysecretkey');

        req.user = decodedMsg.user;

        next();

    } catch (err) {
        res.status(401).json({ msg: "Not a valid token" });
    }
}