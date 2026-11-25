class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    placeOrder = (req, res, next) => {
        try {
            const order = this.orderService.placeOrder(req.body.items);

            res.location(`/api/orders/${order.id}`);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    };

    getAllOrders = (req, res, next) => {
        try {
            const orders = this.orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    };

    getOrderById = (req, res, next) => {
        try {
            const order = this.orderService.getOrderById(req.params.id);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = OrderController;