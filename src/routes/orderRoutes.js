const express = require('express');
const validate = require('../middleware/validate');
const { orderSchema } = require('../validators/orderValidator');

function createOrderRoutes(orderController) {
    const router = express.Router();

    router.post('/', validate(orderSchema), orderController.placeOrder);
    router.get('/', orderController.getAllOrders);
    router.get('/:id', orderController.getOrderById);

    return router;
}

module.exports = createOrderRoutes;