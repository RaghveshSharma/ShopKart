# 🛍️ ShopKart — Full-Stack MERN E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ShopKart%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://shopkart-sigma-ruby.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646C9A?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-02042B?style=for-the-badge&logo=razorpay&logoColor=00BAF2)](https://razorpay.com/)

<br />

**ShopKart** is a responsive full-stack e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). It features secure cookie-based JWT authentication, real-time product search and category filtering, persistent cart and wishlist, Razorpay checkout with server-side signature verification, and complete order tracking.

---

## 🌐 Live Deployment

- **Live Application URL:** [https://shopkart-sigma-ruby.vercel.app](https://shopkart-sigma-ruby.vercel.app)
- **GitHub Repository:** [https://github.com/RaghveshSharma/ShopKart](https://github.com/RaghveshSharma/ShopKart)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Accounts:** Registration and login with `bcrypt` password encryption.
- **Secure Sessions:** JWT tokens issued as `httpOnly`, `sameSite: none`, and `secure` cookies to protect against XSS and cross-site vulnerabilities.
- **Protected Routes:** Dynamic client-side route guards ensuring cart, wishlist, checkout, and order history are accessible only to authenticated users.

### 📦 Product Catalog & Search
- **Product Browsing:** Responsive product grid displaying images, categories, descriptions, price, and stock levels.
- **Search & Category Filters:** Real-time text search and category-based filtering.
- **Sorting:** Sort products by price (Low to High / High to Low) or newest arrivals.
- **Product Details:** Dedicated product view with detailed specifications and instant add-to-cart/wishlist triggers.

### 🛒 Cart & ❤️ Wishlist
- **Database Persistence:** Cart and wishlist items are linked to the user's MongoDB record, keeping state consistent across devices and logins.
- **Live Cart Operations:** Increment, decrement, and remove items with immediate subtotal recalculations.
- **Wishlist Toggle:** Save items to wishlist and transfer them directly into the cart.

### 💳 Checkout & Razorpay Payment Integration
- **Address Validation:** Form validation for recipient name, address, 10-digit mobile number, and 6-digit postal code.
- **Razorpay Modal:** Official Razorpay Checkout integration for accepting card, UPI, and net banking payments.
- **Cryptographic Signature Verification:** Server-side HMAC-SHA256 signature verification preventing payment tampering.
- **Automated Stock & Cart Updates:** Stock quantities decrement automatically in MongoDB upon successful payment confirmation, and the user's cart is cleared.

### 📋 Order Management & Tracking
- **Order History:** Overview of previous orders with real-time status indicators (`PENDING_PAYMENT`, `PLACED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`).
- **Order Receipts:** Detailed order invoices displaying item breakdown, pricing, delivery address, order date, and transaction reference IDs.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM (v7), Axios
- **Backend:** Node.js (ES Modules), Express.js 5, CORS, Cookie-Parser
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcrypt`
- **Payment Gateway:** Razorpay Node SDK & Razorpay Checkout JS
- **Deployment:** Vercel (Frontend with Single Page Application rewrites)

---

## 📂 Project Structure

```text
ShopKart/
├── backend/
│   ├── config/
│   │   └── razorpay.js           # Razorpay client instance
│   ├── controllers/
│   │   ├── cart.controller.js     # Cart CRUD logic
│   │   ├── customer.controller.js # Auth (register, login, me, logout)
│   │   ├── order.controller.js    # Order generation & payment verification
│   │   ├── product.controller.js  # Product listing, search, and filters
│   │   └── wishlist.controller.js # Wishlist toggle and retrieval
│   ├── middlewares/
│   │   └── auth.middleware.js     # JWT cookie authentication guard
│   ├── models/
│   │   ├── customer.model.js      # User schema (with cart & wishlist references)
│   │   ├── order.model.js         # Order schema with items, status, address
│   │   └── product.model.js       # Product schema
│   ├── routes/
│   │   ├── cart.routes.js
│   │   ├── customer.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   └── wishlist.routes.js
│   ├── utils/
│   │   └── generateToken.js       # JWT creation & cookie setter
│   ├── index.js                   # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/            # Navbar, ProductCard, SearchBar
│   │   ├── context/               # CartContext (Auth & Cart state)
│   │   ├── pages/                 # Home, Products, ProductDetails, Cart,
│   │   │                          # Checkout, Orders, OrderDetails, Login, Register
│   │   ├── services/              # Axios API instances and service calls
│   │   ├── App.jsx                # Routing and route protection
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind and styling
│   ├── vercel.json                # SPA routing rewrites for Vercel
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup & Installation Instructions

Follow these steps to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) database connection URI
- [Razorpay](https://razorpay.com/) test account (for Test Key ID and Key Secret)

---

### 1. Clone the Repository
```bash
git clone https://github.com/RaghveshSharma/ShopKart.git
cd ShopKart
```

---

### 2. Backend Configuration & Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside the `backend` directory:
   ```env
   PORT=8082
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the backend server:
   ```bash
   # Development mode:
   npm run dev

   # Production mode:
   npm start
   ```
   *The backend server will run on `http://localhost:8082`.*

---

### 3. Frontend Configuration & Setup

1. Open a second terminal window and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8082
   ```

4. Launch the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be accessible at `http://localhost:5173`.*

---

## 📡 API Endpoints Reference

### 👤 Authentication & User (`/customers`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/customers/register` | Register new user account | Public |
| `POST` | `/customers/login` | Authenticate user & issue HttpOnly JWT cookie | Public |
| `GET` | `/customers/me` | Retrieve authenticated user profile | Protected |
| `POST` | `/customers/logout` | Invalidate session cookie | Protected |

### 🏷️ Products (`/products`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/products` | List all products (supports `?search=`, `?category=`, `?sort=`) | Public |
| `GET` | `/products/:id` | Get individual product details | Public |
| `POST` | `/products` | Add a new product to database | Admin / Public |

### 🛒 Cart (`/cart`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/cart` | Get current user's cart | Protected |
| `POST` | `/cart/:productId` | Add product to cart | Protected |
| `PATCH` | `/cart/:productId` | Update item quantity (`action: "increase" \| "decrease"`) | Protected |
| `DELETE` | `/cart/:productId` | Remove product from cart | Protected |

### ❤️ Wishlist (`/wishlist`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/wishlist` | Retrieve user wishlist | Protected |
| `POST` | `/wishlist/:productId` | Add item to wishlist | Protected |
| `PATCH` | `/wishlist/:productId/toggle`| Toggle item in/out of wishlist | Protected |
| `DELETE` | `/wishlist/:productId` | Remove item from wishlist | Protected |

### 💳 Orders & Payments (`/orders`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/orders/create-payment-order` | Validate cart stock, create order, generate Razorpay order ID | Protected |
| `POST` | `/orders/verify-payment` | Verify HMAC signature, mark order as PAID, deduct stock, empty cart | Protected |
| `GET` | `/orders` | Retrieve list of all past orders for logged-in user | Protected |
| `GET` | `/orders/:id` | Fetch specific order details and invoice | Protected |

---

## 🔒 Security Notes
- **No secrets in repository:** Actual `.env` files are excluded via `.gitignore`.
- **Cross-Domain Authentication:** JWT tokens are served over secure cross-origin cookies (`sameSite: "none"`, `secure: true`) enabling cross-domain deployment (e.g. Vercel frontend communicating with cloud backend).

---

## 👨‍💻 Author

**Raghvesh Sharma**
- GitHub: [@RaghveshSharma](https://github.com/RaghveshSharma)
- Project: [ShopKart](https://github.com/RaghveshSharma/ShopKart)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
