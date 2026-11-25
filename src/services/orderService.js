const { randomUUID } = require('crypto');
const Order = require('../domain/order');
const { NotFoundError, ConflictError } = require('../errors');

class OrderService {
    constructor(orderRepository, productRepository, maxOrderQuantity, logger) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.maxOrderQuantity = maxOrderQuantity;
        this.logger = logger;
    }

    placeOrder(items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new ConflictError('An order must contain at least one item');
        }

        const orderItems = [];
        let totalAmount = 0;

        // First, check every item without changing stock.
        for (const item of items) {
            const product = this.productRepository.findById(item.productId);

            if (!product) {
                throw new NotFoundError(
                    `Product ${item.productId} not found`
                );
            }

            if (
                !Number.isInteger(item.quantity) ||
                item.quantity <= 0
            ) {
                throw new ConflictError('Quantity must be a positive integer');
            }

            if (item.quantity > this.maxOrderQuantity) {
                throw new ConflictError(
                    `Maximum order quantity is ${this.maxOrderQuantity}`
                );
            }

            if (item.quantity > product.stock) {
                throw new ConflictError(
                    `Not enough stock for ${product.name}`
                );
            }

            const lineTotal = product.price * item.quantity;

            orderItems.push({
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                lineTotal
            });

            totalAmount += lineTotal;
        }

        // Only change stock after all items have passed the checks.
        for (const item of orderItems) {
            const product = this.productRepository.findById(item.productId);
            product.reduceStock(item.quantity);
            this.productRepository.save(product);
        }

        const order = new Order({
            id: randomUUID(),
            items: orderItems,
            totalAmount
        });

        const savedOrder = this.orderRepository.save(order);

        if (this.logger) {
            this.logger.info(
                { orderId: savedOrder.id, totalAmount: savedOrder.totalAmount },
                'Order placed'
            );
        }

        return savedOrder;
    }

    getAllOrders() {
        return this.orderRepository.findAll();
    }

    getOrderById(id) {
        const order = this.orderRepository.findById(id);

        if (!order) {
            throw new NotFoundError('Order not found');
        }

        return order;
    }
}

module.exports = OrderService;