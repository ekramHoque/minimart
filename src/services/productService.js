const { randomUUID } = require('crypto');
const Product = require('../domain/product');
const { NotFoundError } = require('../errors');

class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    createProduct(data) {
        const product = new Product({
            id: randomUUID(),
            ...data
        });

        return this.productRepository.save(product);
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

        return this.productRepository.save(updatedProduct);
    }

    deleteProduct(id) {
        this.getProductById(id);
        this.productRepository.deleteById(id);
    }
}

module.exports = ProductService;