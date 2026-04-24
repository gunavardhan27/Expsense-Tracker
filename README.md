# Expense Tracker

A full-stack TS application for tracking expenses.

## Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Run Backend
```bash
cd backend
npm run dev
```

### 3. Run Frontend
In a separate terminal:
```bash
cd frontend
npm run dev
```

## API Docs

### `POST /expenses`
Create a new expense.
```bash
curl -X POST http://localhost:3001/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "idempotency_key": "123e4567-e89b-12d3-a456-426614174000",
    "amount": "120.50",
    "category": "Food",
    "description": "Lunch",
    "date": "2026-04-24"
  }'
```

### `GET /expenses`
List expenses. Supports `category` and `sort` query params.
```bash
curl "http://localhost:3001/expenses?sort=date_desc"
```

## Key Design Decisions

- **Money Handling**: Money is stored as integer minor units (rupees) in MongoDB to strictly avoid float arithmetic errors. Validation ensures precision and safe ranges, while pure utilities in the shared package handle summation with BigInt safely.
- **Shared Package**: The `shared` folder contains domain definitions, constants, and pure logic utilities used by both frontend and backend.
- **Idempotency**: `idempotency_key` is generated on the client side per logical submission to prevent double-charging or duplicate entries on retries.
- **Retry Logic**: Network errors on the frontend are retried with exponential backoff on `fetch` network failures.

## Trade-offs and Omissions
- No User Authentication.
- Pagination is omitted for simplicity.
- Editing and Deleting expenses are not implemented.
