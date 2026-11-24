class OrderRepository {
    constructor() {
        this.orders = new Map();
    }

    save(order) {
        this.orders.set(order.id, order);
        return order;
    }

    findAll() {
        return Array.from(this.orders.values());
    }

    findById(id) {
        return this.orders.get(id) || null;
    }
}

module.exports = OrderRepository;