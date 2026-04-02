# FoodRush — Food Delivery App

**Completed level: Middle**

## Features

### Base
- Shops page — browse shops, view products, add to cart
- Shopping cart page — manage items, change quantities, remove items
- Order form with validation (name, email, phone, address)
- Orders saved to PostgreSQL database

### Middle
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Product filtering by category
- ✅ Product sorting (price asc/desc, name A→Z)
- ✅ Shop filtering by rating range

### Bonus
- ✅ Order history page (find orders by email + phone)
- ✅ Toast notifications when adding to cart

## Tech Stack

**Frontend**: HTML, CSS, Vanilla JavaScript  
**Backend**: Node.js + Express  
**Database**: PostgreSQL  
**Hosting**: Railway (backend + DB) + Vercel (frontend)

## Live Demo

- Frontend: [your-vercel-url.vercel.app]
- Backend API: [your-backend.railway.app]

## Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/delivery-app
cd delivery-app
```

### 2. Set up the database
Install PostgreSQL, then:
```bash
psql -U postgres -c "CREATE DATABASE delivery_db;"
psql -U postgres -d delivery_db -f backend/schema.sql
```

### 3. Configure backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm run dev
```

### 4. Open frontend
Open `frontend/index.html` in a browser, or serve with:
```bash
npx serve frontend
```

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/shops | Get all shops (optional: ?minRating=4&maxRating=5) |
| GET | /api/products?shopId=1 | Get products for a shop |
| GET | /api/products/categories?shopId=1 | Get categories for a shop |
| POST | /api/orders | Create a new order |
| GET | /api/orders?email=...&phone=... | Find orders by email + phone |
