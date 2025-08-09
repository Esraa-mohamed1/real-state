# Financial Management Dashboard - Backend (Node.js/Express/MongoDB)

A backend API for Crystal Power Investments to manage real estate and business finances. Implements Authentication, Payments, Debts, Properties, and Dashboard summary using an MVC structure.

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- CORS, dotenv

## Project Structure
- `config/` - Database connection utility
- `controllers/` - Route handlers (business logic)
- `models/` - Mongoose schemas/models
- `routes/` - Express route definitions
- `middleware/` - Auth guard (JWT)
- `seed/` - Script(s) to seed initial data (admin user)
- `server.js` - App entry point

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` in `backend/`:
   ```env
   MONGO_URI=mongodb://localhost:27017/financial_dashboard
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

3. (Optional) Seed an admin user:
   ```bash
   node seed/createAdmin.js
   ```
   - Default seeded credentials:
     - Email: `esraa@admin.com`
     - Password: `admin1234`
     - Role: `isAdmin: true`

4. Run the server:
   ```bash
   npm start
   ```
   Server runs at `http://localhost:5000`.

## Authentication Mechanism
- Login with email/password → returns a signed JWT (`JWT_SECRET`).
- Send the token on protected routes using the header:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
- Middleware `protect` verifies token and attaches `req.user`.

---

## API Reference
Base URL: `http://localhost:5000`

Common headers for protected endpoints:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Auth
- POST `/api/auth/login`
  - Body:
    ```json
    { "email": "string", "password": "string" }
    ```
  - Response:
    ```json
    {
      "token": "<jwt>",
      "user": { "id": "...", "name": "...", "email": "...", "isAdmin": true }
    }
    ```
  - Curl:
    ```bash
    curl -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"esraa@admin.com","password":"admin1234"}'
    ```

### Dashboard
- GET `/api/dashboard/overview` (protected)
  - Response:
    ```json
    { "totalPayments": 0, "outstandingDebt": 0, "netPosition": 0 }
    ```
  - Curl:
    ```bash
    curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/dashboard/overview
    ```

### Payments
Model fields: `{ amount:number, date:ISODate, payer:string, description?:string, createdBy:ObjectId }`

- POST `/api/payments` (protected)
  - Body:
    ```json
    { "amount": 1000, "date": "2025-08-08", "payer": "Esraa", "description": "Rent" }
    ```
- GET `/api/payments` (protected)
  - Response: `Payment[]`
- GET `/api/payments/summary` (protected)
  - Response:
    ```json
    { "totalPaid": 12345 }
    ```
- GET `/api/payments/:id` (protected)
- PUT `/api/payments/:id` (protected)
  - Body (any subset): `amount, date, payer, description`
- DELETE `/api/payments/:id` (protected)

Examples:
```bash
# Create
curl -X POST http://localhost:5000/api/payments \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"amount":1200,"date":"2025-08-08","payer":"Tenant A","description":"Aug rent"}'

# List
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/payments

# Summary
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/payments/summary
```

### Debts
Model fields: `{ amount:number, date:ISODate, category:'Restaurants'|'Offices'|'Other', description?:string, status:'pending'|'settled', createdBy:ObjectId }`

- POST `/api/debts` (protected)
  - Body:
    ```json
    { "amount": 5000, "date": "2025-08-01", "category": "Offices", "status": "pending", "description": "Furniture" }
    ```
- GET `/api/debts` (protected)
  - Response: `Debt[]`
- GET `/api/debts/breakdown` (protected)
  - Response example:
    ```json
    [
      { "category": "Offices", "count": 2, "totalAmount": 8000, "percentage": "66.67" },
      { "category": "Restaurants", "count": 1, "totalAmount": 4000, "percentage": "33.33" }
    ]
    ```
- GET `/api/debts/summary` (protected)
  - Response:
    ```json
    { "pending": 7000, "settled": 5000 }
    ```
- GET `/api/debts/:id` (protected)
- PUT `/api/debts/:id` (protected)
  - Body (any subset): `amount, date, category, description, status`
- DELETE `/api/debts/:id` (protected)

Examples:
```bash
# Create
curl -X POST http://localhost:5000/api/debts \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"amount":3500,"date":"2025-08-05","category":"Restaurants","status":"pending"}'

# Breakdown
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/debts/breakdown

# Summary
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/debts/summary
```

### Properties
Model fields: 
```json
{
  "name": "string",
  "type": "string",
  "address": "string",
  "units": [ { "number": "A1", "isRented": true, "tenant": "John", "monthlyRent": 1200 } ],
  "incomeHistory": [ { "month": 8, "year": 2025, "amount": 1200 } ]
}
```

- POST `/api/properties` (protected)
  - Body (example):
    ```json
    {
      "name": "Sultan Kayello - Tower 1",
      "type": "apartment",
      "address": "Downtown Street 123",
      "units": [
        { "number": "101", "isRented": true, "tenant": "Ali", "monthlyRent": 1200 },
        { "number": "102", "isRented": false, "tenant": "", "monthlyRent": 1100 }
      ]
    }
    ```
- GET `/api/properties` (protected)
- GET `/api/properties/rented-vacant` (protected)
  - Response: `{ "rented": number, "vacant": number }`
- GET `/api/properties/income-portfolio` (protected)
  - Response: `{ "monthlyIncome": number, "portfolioValue": number }`
- GET `/api/properties/:id` (protected)
- PUT `/api/properties/:id` (protected)
- DELETE `/api/properties/:id` (protected)

Examples:
```bash
# Create property
curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Sultan Kayello","type":"apartment","address":"Cairo","units":[{"number":"1A","isRented":true,"tenant":"Sara","monthlyRent":1500}]}'

# Rented vs Vacant
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/properties/rented-vacant

# Income & Portfolio
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/properties/income-portfolio
```

---

## Quick Test Flow
```bash
# 1) Start server
npm start

# 2) Login (get TOKEN)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"esraa@admin.com","password":"admin1234"}' | jq -r .token)

echo $TOKEN

# 3) Dashboard overview
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/dashboard/overview

# 4) Create/read a payment
curl -X POST http://localhost:5000/api/payments \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"amount":1000,"date":"2025-08-08","payer":"Tenant","description":"Rent"}'

curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/payments
```
> Note: `jq` is used above to parse JSON. If not installed, extract the token manually from the login response and export it.

## Error Responses
- Standard error format:
  ```json
  { "message": "<description>" }
  ```
- Common statuses: `400` (validation), `401` (unauthorized), `403` (forbidden), `404` (not found), `500` (server error)

## Security & Notes
- Do not commit `.env` (already ignored by `.gitignore`).
- Change the default `JWT_SECRET` and admin password in production.
- Ensure MongoDB is reachable via `MONGO_URI`.

---

## License
MIT (or your organization’s license)
