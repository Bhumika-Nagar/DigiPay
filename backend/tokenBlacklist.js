const blacklistedTokens = new Map();

function blacklistToken(token, expiresAt) {
    blacklistedTokens.set(token, expiresAt);
}

function isTokenBlacklisted(token) {
    const expiresAt = blacklistedTokens.get(token);

    if (!expiresAt) {
        return false;
    }

    if (expiresAt <= Date.now()) {
        blacklistedTokens.delete(token);
        return false;
    }

    return true;
}

function cleanupExpiredTokens() {
    const now = Date.now();

    for (const [token, expiresAt] of blacklistedTokens.entries()) {
        if (expiresAt <= now) {
            blacklistedTokens.delete(token);
        }
    }
}

setInterval(cleanupExpiredTokens, 60 * 1000).unref();

module.exports = {
    blacklistToken,
    isTokenBlacklisted
};
