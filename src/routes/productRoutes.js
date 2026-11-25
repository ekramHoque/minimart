const express = require('express');
const validate = require('../middleware/validate');
const { productSchema } = require('../validators/productValidator');

function createProductRoutes(productController) {
    const router = express.Router();

    router.post('/', validate(productSchema), productController.createProduct);
    router.get('/', productController.getAllProducts);
    router.get('/:id', productController.getProductById);
    router.put('/:id', validate(productSchema), productController.updateProduct);
    router.delete('/:id', productController.deleteProduct);

    return router;
}

module.exports = createProductRoutes;