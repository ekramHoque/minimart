const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
    console.log(`MiniMart server running on port ${config.port}`);
});