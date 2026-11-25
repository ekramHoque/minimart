const { randomUUID } = require('crypto');
const Product = require('../domain/product');
const { NotFoundError } = require('../errors');

class ProductService {
    constructor(productRepository, logger) {
    this.productRepository = productRepository;
    this.logger = logger;
    }

    createProduct(data) {
    const product = new Product({ id: randomUUID(), ...data });
    const savedProduct = this.productRepository.save(product);

    if (this.logger) {
        this.logger.info(
            { productId: savedProduct.id },
            'Product created'
        );
    }

    return savedProduct;
}

    getAllProducts() {
        return this.productRepository.findAll();
    }

    getProductById(id) {
        const product = this.productRepository.findById(id);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return product;
    }

    updateProduct(id, data) {
        const existingProduct = this.getProductById(id);

        const updatedProduct = new Product({
            ...existingProduct,
            ...data,
            id: existingProduct.id,
            createdAt: existingProduct.createdAt,
            updatedAt: new Date().toISOString()
        });

        if (this.logger) {
    this.logger.info({ productId: id }, 'Product updated');
}

        return this.productRepository.save(updatedProduct);
    }

    deleteProduct(id) {
        this.getProductById(id);
        this.productRepository.deleteById(id);

        if (this.logger) {
    this.logger.info({ productId: id }, 'Product deleted');
}
    }
}

module.exports = ProductService;