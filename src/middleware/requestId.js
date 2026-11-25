const { randomUUID } = require('crypto');

function requestId(req, res, next) {
    const incomingId = req.get('X-Request-ID');

    req.id = incomingId || randomUUID();

    res.setHeader('X-Request-ID', req.id);

    next();
}

module.exports = requestId;