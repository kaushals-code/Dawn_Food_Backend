# 🌅 DAWN - Food Ordering Backend API

A scalable and secure backend for a food ordering application built with **Node.js**, **Express.js**, and **MongoDB**. DAWN provides REST APIs for user authentication, food management, cart operations, and order processing.

---

## 🚀 Features

* 🔐 JWT-based Authentication
* 👤 User Registration & Login
* 🍔 Food Item Management
* 🛒 Shopping Cart APIs
* 📦 Order Placement and Tracking
* ❤️ Favorite Food Management
* 🔎 Search and Filter Foods
* 🗂 Category-wise Food Listing
* 🛡 Protected Routes using Middleware
* 📄 RESTful API Architecture

---

## 🛠 Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime Environment   |
| Express.js | Backend Framework     |
| JWT        | Authentication        |
| bcrypt     | Password Hashing      |
| dotenv     | Environment Variables |
| Nodemon    | Development Server    |

---

## 📂 Project Structure

```
DAWN/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── config/
├── server.js
├── package.json
├── .env
└── README.md
```

---

## ⚙ Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/DAWN.git
cd DAWN
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Start Development Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/auth/register` | Register a user |
| POST   | `/api/auth/login`    | User login      |

### Foods

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/api/foods`                    | Get all foods         |
| GET    | `/api/foods/:id`                | Get food by ID        |
| GET    | `/api/foods/category/:category` | Get foods by category |

### Cart

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | `/api/cart/add`        | Add item to cart |
| GET    | `/api/cart`            | View cart        |
| DELETE | `/api/cart/remove/:id` | Remove item      |

### Orders

| Method | Endpoint      | Description     |
| ------ | ------------- | --------------- |
| POST   | `/api/orders` | Place order     |
| GET    | `/api/orders` | Get user orders |

---

## 🔒 Authentication

Protected routes require a JWT token:

```http
Authorization: Bearer <your_token>
```

---

## 🗄 Database Models

* User
* Food
* Category
* Cart
* Order

---

## 📖 Example Response

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "684fa8d17bc2",
    "totalAmount": 499
  }
}
```

---

## 🎯 Future Enhancements

* Payment Gateway Integration
* Admin Dashboard APIs
* Image Upload Support
* Restaurant Management
* Order Status Tracking
* Coupon System
* Reviews and Ratings
* Real-Time Notifications

---

## 👨‍💻 Author

**Kaushal Singh Thakur**

* GitHub: https://github.com/kaushals-code
* LinkedIn: https://www.linkedin.com/in/kaushal-singh-thakur-788705356

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

> **DAWN — Delivering delicious experiences, one API at a time.**
