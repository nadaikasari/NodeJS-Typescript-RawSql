# 🛠️ Node.js + TypeScript Starter Project

This project uses **Node.js**, **TypeScript**, and **PostgreSQL**. It supports API development with a modular architecture using services, repositories, and external integrations.

---

## 📦 Prerequisites

- **Node.js** v18 or higher  
- **PostgreSQL** installed and running  
- A terminal with `bash`, `npm`, or `yarn`

---

## 🚀 Installation & Setup

```bash
# 1. Initialize project
npm init -y

# 2. Install dependencies
npm install express pg dotenv axios

# 3. Install development dependencies
npm install -D typescript tsx @types/node @types/express

# 4. Initialize TypeScript
npx tsc --init
```

## ⚙️ Environment Configuration
```bash
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
PORT=3000
```

## 🧱 PostgreSQL Schema
```sql
-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  product_code VARCHAR(20) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- Additional columns for PRODUCTS
ALTER TABLE products
ADD COLUMN status_product VARCHAR(255) DEFAULT 'NEW', 
ADD COLUMN expired_date DATE;

-- ORDERS TABLE
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  ordered_by INTEGER NOT NULL REFERENCES users(id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- ORDER DETAILS TABLE
CREATE TABLE order_details (
  detail_id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  product_id INTEGER NOT NULL REFERENCES products(product_id),
  quantity INTEGER NOT NULL,
  sub_total NUMERIC(12, 2) NOT NULL
);

```
## How to Run
Start the main Node server
```bash
npx tsx watch src/app.ts
```
Run cron job (scheduler)
```bash
npx tsx src/scheduler.ts
```

## 📚 API Endpoints

### 🔐 Authentication

| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| POST   | `/api/register` | Register a new user |
| POST   | `/api/login`    | Login and get token |

---

### 📦 Products

| Method | Endpoint        | Description        |
|--------|------------------|--------------------|
| POST   | `/api/products` | Create a product   |

**Sample Payload**:
```json
{
  "name": "Produk Baru",
  "price": 4000,
  "expired_date": "2025-07-12"
}
```
---

### 📅 Public Holidays
this 
| Method | Endpoint                       | Description             |
|--------|--------------------------------|-------------------------|
| GET    | `/api/public-holidays`         | Fetch public holidays   |

---

### 🧾 Orders

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| POST   | `/api/orders` | Create a new order |
**Sample Payload**:
```json
{
  "orderBy": 1,
  "orderDate": "2025-05-09",
  "items": [
    { "productId": 9, "quantity": 2 },
    { "productId": 8, "quantity": 3 }
  ]
}
```
---

### 🏆 Reports

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | `/api/top-customers` | Get top 10 customers this month |

