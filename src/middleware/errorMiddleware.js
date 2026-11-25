function errorMiddleware(err, req, res, next) {
    let status = 500;
    let title = 'Internal Server Error';
    let detail = 'An unexpected error occurred.';

    if (err.name === 'NotFoundError') {
        status = 404;
        title = 'Not Found';
        detail = err.message;
    } else if (err.name === 'ConflictError') {
        status = 409;
        title = 'Conflict';
        detail = err.message;
    } else if (err.name === 'ValidationError') {
        status = 422;
        title = 'Unprocessable Content';
        detail = 'One or more fields contain invalid values.';
    }

    // Log the complete error on the server.
    if (req.log) {
        req.log.error(
            { err, requestId: req.id },
            'Request failed'
        );
    }

    const response = {
        type: 'about:blank',
        title,
        status,
        detail,
        instance: req.originalUrl,
        requestId: req.id
    };

    if (err.name === 'ValidationError') {
        response.errors = err.details;
    }

    res
        .status(status)
        .type('application/problem+json')
        .json(response);
}

module.exports = errorMiddleware;