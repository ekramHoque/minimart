class Order {
    constructor({
        id,
        items,
        totalAmount,
        status = 'PLACED',
        createdAt = new Date().toISOString()
    }) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }
}

module.exports = Order;