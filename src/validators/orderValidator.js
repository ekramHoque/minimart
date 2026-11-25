const Joi = require('joi');

const orderSchema = Joi.object({
    items: Joi.array()
        .min(1)
        .unique('productId')
        .items(
            Joi.object({
                productId: Joi.string()
                    .guid({ version: ['uuidv4'] })
                    .required(),

                quantity: Joi.number()
                    .integer()
                    .min(1)
                    .required()
            })
        )
        .required()
});

module.exports = {
    orderSchema
};