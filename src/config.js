require('dotenv').config();

const config = {
    port: Number(process.env.PORT) || 3000,
    maxOrderQuantity: Number(process.env.MAX_ORDER_QUANTITY) || 10,
    environment: process.env.NODE_ENV || 'development'
};

module.exports = config;