class ProductRepository {
    constructor() {
        this.products = new Map();
    }

    save(product) {
        this.products.set(product.id, product);
        return product;
    }

    findAll() {
        return Array.from(this.products.values());
    }

    findById(id) {
        return this.products.get(id) || null;
    }

    deleteById(id) {
        return this.products.delete(id);
    }
}

module.exports = ProductRepository;