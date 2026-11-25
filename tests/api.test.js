const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const createApp = require('../src/app');

let app;
let productId;

// Create a fresh application before each test.
beforeEach(() => {
    app = createApp();
});

// Helper function to create a product.
async function createTestProduct() {
    const response = await request(app)
        .post('/api/products')
        .send({
            name: 'Keyboard',
            description: 'Wireless keyboard',
            price: 25,
            stock: 10
        });

    return response;
}

// Test 1: Create a product
test('POST /api/products should create a product', async () => {
    const response = await createTestProduct();

    assert.equal(response.status, 201);
    assert.equal(response.body.name, 'Keyboard');
    assert.equal(response.body.price, 25);
    assert.ok(response.body.id);

    assert.ok(response.headers.location);
});

// Test 2: List products
test('GET /api/products should return all products', async () => {
    await createTestProduct();

    const response = await request(app)
        .get('/api/products');

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].name, 'Keyboard');
});

// Test 3: Get one product
test('GET /api/products/:id should return a product', async () => {
    const created = await createTestProduct();
    productId = created.body.id;

    const response = await request(app)
        .get(`/api/products/${productId}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.id, productId);
});

// Test 4: Reject invalid product data
test('POST /api/products should reject a negative price', async () => {
    const response = await request(app)
        .post('/api/products')
        .send({
            name: 'Keyboard',
            price: -25,
            stock: 10
        });

    assert.equal(response.status, 422);
    assert.equal(response.body.title, 'Unprocessable Content');
    assert.ok(response.body.errors);
});

// Test 5: Return 404 for an unknown product
test('GET /api/products/:id should return 404 for an unknown product', async () => {
    const response = await request(app)
        .get('/api/products/unknown-id');

    assert.equal(response.status, 404);
    assert.equal(response.body.title, 'Not Found');
});

// Test 6: Place an order successfully
test('POST /api/orders should place an order and reduce stock', async () => {
    const created = await createTestProduct();
    productId = created.body.id;

    const orderResponse = await request(app)
        .post('/api/orders')
        .send({
            items: [
                {
                    productId,
                    quantity: 2
                }
            ]
        });

    assert.equal(orderResponse.status, 201);
    assert.equal(orderResponse.body.totalAmount, 50);

    const productResponse = await request(app)
        .get(`/api/products/${productId}`);

    assert.equal(productResponse.body.stock, 8);
});

// Test 7: Reject an order when stock is insufficient
test('POST /api/orders should return 409 when stock is insufficient', async () => {
    const created = await createTestProduct();
    productId = created.body.id;

    const response = await request(app)
        .post('/api/orders')
        .send({
            items: [
                {
                    productId,
                    quantity: 50
                }
            ]
        });

    assert.equal(response.status, 409);
    assert.equal(response.body.title, 'Conflict');

    // Stock must remain unchanged after a failed order.
    const productResponse = await request(app)
        .get(`/api/products/${productId}`);

    assert.equal(productResponse.body.stock, 10);
});

// Test 8: Delete a product
test('DELETE /api/products/:id should delete a product', async () => {
    const created = await createTestProduct();
    productId = created.body.id;

    const deleteResponse = await request(app)
        .delete(`/api/products/${productId}`);

    assert.equal(deleteResponse.status, 204);

    const getResponse = await request(app)
        .get(`/api/products/${productId}`);

    assert.equal(getResponse.status, 404);
});

// Test 9: Reject an order with zero quantity
test('POST /api/orders should reject zero quantity', async () => {
    const created = await createTestProduct();

    const response = await request(app)
        .post('/api/orders')
        .send({
            items: [
                {
                    productId: created.body.id,
                    quantity: 0
                }
            ]
        });

    assert.equal(response.status, 422);
});

// Test 10: Reject an order with a nonexistent product
test('POST /api/orders should return 404 for an unknown product', async () => {
    const response = await request(app)
        .post('/api/orders')
        .send({
            items: [
                {
                    productId: '00000000-0000-4000-8000-000000000000',
                    quantity: 1
                }
            ]
        });

    assert.equal(response.status, 404);
});

// Test 11: Reject duplicate products in one order
test('POST /api/orders should reject duplicate product IDs', async () => {
    const created = await createTestProduct();
    const id = created.body.id;

    const response = await request(app)
        .post('/api/orders')
        .send({
            items: [
                { productId: id, quantity: 1 },
                { productId: id, quantity: 2 }
            ]
        });

    assert.equal(response.status, 422);
});