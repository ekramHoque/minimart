const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to MiniMart API'
    });
});

module.exports = app;