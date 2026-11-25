const express = require('express');
const helmet = require('helmet');
const requestId = require('./middleware/requestId');
const { logger, requestLogger } = require('./middleware/requestLogger');
const errorMiddleware = require('./middleware/errorMiddleware');

const ProductRepository = require('./repositories/productRepository');
const OrderRepository = require('./repositories/orderRepository');

const ProductService = require('./services/productService');
const OrderService = require('./services/orderService');

const ProductController = require('./controllers/productController');
const OrderController = require('./controllers/orderController');

const createProductRoutes = require('./routes/productRoutes');
const createOrderRoutes = require('./routes/orderRoutes');

const config = require('./config');

const app = express();

// Create repositories
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();

// Create services and inject their dependencies
const productService = new ProductService(productRepository, logger);

const orderService = new OrderService(
    orderRepository,
    productRepository,
    config.maxOrderQuantity,
    logger
);

// Create controllers
const productController = new ProductController(productService);
const orderController = new OrderController(orderService);

// Middleware
app.use(requestId);
app.use(requestLogger);
app.use(helmet());
app.use(express.json());

// Connect routes
app.use('/api/products', createProductRoutes(productController));
app.use('/api/orders', createOrderRoutes(orderController));

// Welcome route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to MiniMart API'
    });
});

// Handle unknown routes
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.name = 'NotFoundError';
    next(error);
});

// Centralized error handler (must be last)
app.use(errorMiddleware);

module.exports = app;