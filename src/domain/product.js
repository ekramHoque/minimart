const { ConflictError } = require('../errors');


class Product {
    constructor({
        id,
        name,
        description = '',
        price,
        stock,
        createdAt = new Date().toISOString(),
        updatedAt = new Date().toISOString()
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    reduceStock(quantity) {
        if (quantity > this.stock) {
            throw new ConflictError('Not enough stock available');
        }

        this.stock -= quantity;
        this.updatedAt = new Date().toISOString();
    }
}

module.exports = Product;