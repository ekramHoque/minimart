function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const validationError = new Error('Validation failed');

            validationError.name = 'ValidationError';
            validationError.status = 422;

            validationError.details = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return next(validationError);
        }

        req.body = value;
        next();
    };
}

module.exports = validate;