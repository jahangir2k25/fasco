# FASCO — Fashion eCommerce (MERN + Tailwind)

Pixel-inspired rebuild of the [Authentication — eCommerce Store](https://www.figma.com/design/VgZRTUMx1ciL4c46KFGw8B/Authentication---eCommerce-Store--Copy-?node-id=0-1) Figma UI kit (FASCO brand).

## Stack

- **Client:** React (Vite), React Router, Tailwind CSS v4, Axios
- **Server:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## Pages (from Figma)

1. Sign In  
2. Sign Up / Create Account  
3. Home  
4. Shop (filters + grid)  
5. Product Detail  
6. Shopping Cart  
7. Checkout  

## Setup

### 1. MongoDB

Start MongoDB locally (default URI in `server/.env`):

```
mongodb://127.0.0.1:27017/fasco
```

### 2. Server

```bash
cd server
npm install
npm run dev
```

API: `http://localhost:5000`  
Products auto-seed on first run if the collection is empty.

### 3. Client

```bash
cd client
npm install
npm run dev
```

App: `http://localhost:5173`

## Production deployment

- The production frontend uses `https://fasco-z7zn.onrender.com/api` by default. Set
  `VITE_API_URL` in Vercel to override it; the value should include `/api`.
- Set the Render `CLIENT_URL` environment variable to
  `https://fasco-theta.vercel.app` (without a trailing slash). The server also
  normalizes a trailing slash automatically.
- Set `MONGO_URI` and `JWT_SECRET` in Render. The in-memory fallback is temporary:
  accounts created while MongoDB is disconnected are lost when the server restarts.

## Demo discount code

On checkout, use **`FASCO10`** for 10% off.

## Project structure

```
fasco/
├── client/          # React + Tailwind frontend
└── server/          # Express + MongoDB API
```
