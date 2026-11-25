# MiniMart – Mini E-Commerce Management System

## 1. Project Overview

MiniMart is a RESTful backend application built using Node.js and Express.js. It provides basic product management and order placement functionality.

The system supports product CRUD operations and order management. It also includes input validation, centralized error handling, request logging, and automated integration tests.

## 2. Technologies Used

- Node.js – JavaScript runtime
- Express.js – Backend web framework
- Joi – Request data validation
- Pino and pino-http – Application and HTTP request logging
- Helmet – Basic HTTP security headers
- dotenv – Environment variable management
- Supertest – HTTP integration testing
- Node.js built-in test runner – Automated tests

## 3. Features

### Product Management
- Create a product.
- Retrieve all products.
- Retrieve a product by ID.
- Update a product.
- Delete a product.

### Order Management
- Place an order containing one or more products.
- Retrieve all orders.
- Retrieve an order by ID.
- Automatically calculate the order total.
- Automatically reduce product stock after a successful order.

### Business Rules
- Product stock cannot become negative.
- An order cannot exceed the configured maximum quantity.
- An order cannot contain a nonexistent product.
- An order cannot contain duplicate product IDs.
- An order cannot be placed if available stock is insufficient.

## 4. Project Structure

```text
minimart-backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config.js
│   ├── errors.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── domain/
│   ├── middleware/
│   └── validators/
├── tests/
│   ├── api.test.js
│   ├── product.test.js
│   └── order.test.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## 5. Architecture

The application follows a layered architecture.

- **Routes:** Define API endpoints and connect them to controllers.
- **Controllers:** Receive HTTP requests, call services, and return HTTP responses.
- **Services:** Implement application logic and business rules.
- **Repositories:** Handle data storage and retrieval.
- **Domain:** Contains the core Product and Order models and their behavior.
- **Validators:** Validate incoming request data using Joi.
- **Middleware:** Handles request IDs, logging, validation, and centralized errors.

Dependencies are created and connected in `app.js`. The application uses dependency injection so that services receive their repositories and logger through their constructors.

Business rules are kept out of controllers. This makes the application easier to test and maintain.

## 6. Installation

Make sure Node.js and npm are installed.

Clone or download the project, then open a terminal in the project directory.

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
MAX_ORDER_QUANTITY=10
NODE_ENV=development
LOG_LEVEL=info
```

## 7. Running the Application

Start the server:

```bash
npm start
```

The server will run at:

```text
http://localhost:3000
```

For development with automatic restarting:

```bash
npm run dev
```

## 8. API Endpoints

### Products

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create a product |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a product by ID |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get an order by ID |

### Example: Create a Product

Request:

```http
POST /api/products
Content-Type: application/json
```

Body:

```json
{
  "name": "Keyboard",
  "description": "Mechanical keyboard",
  "price": 50,
  "stock": 20
}
```

Expected status: `201 Created`

### Example: Place an Order

Request:

```http
POST /api/orders
Content-Type: application/json
```

Body:

```json
{
  "items": [
    {
      "productId": "YOUR_PRODUCT_UUID",
      "quantity": 2
    }
  ]
}
```

Expected status: `201 Created` if the order is valid and stock is available.

## 9. Error Handling

The application uses centralized error handling and a consistent Problem Details-style JSON response.

Important HTTP status codes:

- `201` – Resource created successfully.
- `200` – Request completed successfully.
- `204` – Resource deleted successfully.
- `404` – Requested resource not found.
- `409` – Business rule conflict, such as insufficient stock.
- `422` – Request validation failed.
- `500` – Unexpected server error.

Detailed errors are logged on the server. Internal stack traces are not exposed in client responses.

Each request receives a request ID, which is returned through the `X-Request-ID` response header.

## 10. Automated Testing

Run all automated tests:

```bash
npm test
```

The project uses Node.js's built-in test runner and Supertest.

The automated tests cover:

- Product creation and retrieval.
- Product deletion.
- Invalid product data.
- Missing products.
- Successful order placement.
- Stock reduction after ordering.
- Insufficient stock.
- Invalid order quantities.
- Nonexistent products in orders.
- Duplicate product IDs.

The current test run reports 13 passing tests and 0 failures.

## 11. Storage

The current application uses in-memory repositories implemented with JavaScript Maps.

This is suitable for demonstrating the backend features, but data is not permanent. Products and orders are lost when the server restarts.

A database can be introduced later by replacing the repository implementations while keeping the service and controller layers largely unchanged.

## 12. Environment and Security

Configuration is managed through environment variables.

The `.env.example` file provides the required variable names. The actual `.env` file is excluded from Git through `.gitignore`.

The `node_modules` directory is also excluded from Git. Dependencies and their versions are recorded in `package.json` and `package-lock.json`.