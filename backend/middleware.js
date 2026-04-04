const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("./tokenBlacklist");

const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "authorization header missing"
        });
    }

    const [scheme, token] = authHeader.split(" ");

    if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
        return res.status(401).json({
            message: "invalid authorization header"
        });
    }

    if (isTokenBlacklisted(token)) {
        return res.status(401).json({
            message: "token has been logged out"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            req.token = token;
            req.tokenExp = decoded.exp ? decoded.exp * 1000 : Date.now();
            return next();
        }

        return res.status(403).json({
            message: "invalid token"
        });
    } catch (err) {
        return res.status(403).json({
            message: "error"
        });
    }
};

module.exports = authmiddleware;
