const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),

    description: Joi.string()
        .allow('')
        .optional(),

    price: Joi.number().positive().required(),

    stock: Joi.number().integer().min(0).required()
});

module.exports = {
    productSchema
};