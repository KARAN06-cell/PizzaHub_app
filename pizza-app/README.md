# 🍕 Pizza Delivery App — MERN Stack

A full-stack pizza delivery app (MongoDB, Express, React, Node) with:

- **Customer side**: browse the menu/inventory, add pizzas (with size) to cart, checkout, and get the order **confirmed instantly** — Cash on Delivery, **no payment gateway / API key required**.
- **Owner side**: the same inventory, but with full control — add/edit/delete pizzas, adjust stock, toggle availability, and manage every incoming order's status (Pending → Confirmed → Preparing → Out for Delivery → Delivered).
- Shared inventory: whatever the owner adds/edits in their dashboard is exactly what customers see on the menu (same `Pizza` collection, different permissions).

## Project structure

```
pizza-app/
├── backend/            Express + MongoDB (Mongoose) API
│   ├── config/db.js
│   ├── models/         User, Pizza, Order
│   ├── middleware/auth.js
│   ├── routes/          auth, pizzas, orders
│   ├── utils/seedData.js
│   └── server.js
└── frontend/           React (Vite) app
    └── src/
        ├── api/axios.js
        ├── context/    AuthContext, CartContext
        ├── components/ Navbar, PizzaCard, ProtectedRoute
        └── pages/
            ├── Login.jsx, Register.jsx
            ├── customer/  Menu, Cart, Checkout, OrderSuccess, MyOrders
            └── owner/     Inventory, OwnerOrders
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pizza-app
JWT_SECRET=some_long_random_string
CLIENT_URL=http://localhost:5173
```

You need a running MongoDB instance — either install MongoDB locally, or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection string into `MONGO_URI`.

Seed sample pizzas + a demo owner account:

```bash
npm run seed
```

This creates 6 sample pizzas and an owner login: **owner@pizza.com / owner123**.

Start the API:

```bash
npm run dev      # with nodemon, or:
npm start
```

Server runs on `http://localhost:5000`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs on `http://localhost:5173` and talks to the API at the URL in `VITE_API_URL` (`http://localhost:5000/api` by default).

## 3. Using the app

- Go to `/register` and create a **Customer** account to browse the menu, add items to your cart, and check out.
- Log in as the seeded **Owner** account (`owner@pizza.com` / `owner123`), or register a new account with "Owner (store admin)" selected, to manage inventory (`/owner/inventory`) and orders (`/owner/orders`).
- Checkout has **no payment gateway integration** — clicking "Confirm Order" places the order directly as **Cash on Delivery** and instantly marks it `Confirmed`, so no Razorpay/Stripe API key is needed anywhere in this project.

## Notes

- Stock is decremented automatically when a customer places an order, and the owner can also adjust it manually from the Inventory page.
- JWT auth is used for both roles; `middleware/auth.js` has a `protect` guard (must be logged in) and an `ownerOnly` guard (must be an owner) used on all inventory-write and all-orders routes.
- This backend doesn't require Mongo replica-set transactions — it works with a plain local `mongod` install.
