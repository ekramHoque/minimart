class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

    createProduct = (req, res, next) => {
        try {
            const product = this.productService.createProduct(req.body);

            res.location(`/api/products/${product.id}`);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    };

    getAllProducts = (req, res, next) => {
        try {
            const products = this.productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    };

    getProductById = (req, res, next) => {
        try {
            const product = this.productService.getProductById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    };

    updateProduct = (req, res, next) => {
        try {
            const product = this.productService.updateProduct(
                req.params.id,
                req.body
            );

            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = (req, res, next) => {
        try {
            this.productService.deleteProduct(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ProductController;