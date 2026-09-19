# RentNest Backend

## 1. Project Overview

RentNest is a rental-property platform that connects tenants with landlords. This repository contains the backend API for property discovery, rental requests, payments, reviews, user accounts, and administrative management.

The backend provides role-based workflows for three main user types:

- **Tenant** — browses available properties, submits rental requests, pays for approved rentals, and reviews completed rentals.
- **Landlord** — creates and manages properties, reviews rental requests, and completes active rentals.
- **Admin** — manages users and categories and can inspect properties and rental requests.

## 2. Features

### Authentication

- User registration
- Login
- JWT access-token authentication
- HTTP-only cookie authentication
- Refresh-token flow
- Role-based authorization for tenants, landlords, and admins
- Blocked-user protection

### Tenant

- Browse available properties
- Search and filter properties
- View available property details
- Submit rental requests
- Prevent duplicate active rental requests for the same property
- View rental history
- Create Stripe Checkout payments for approved requests
- View payment history
- Submit reviews after a rental is completed

### Landlord

- Create properties
- Update properties
- Delete properties
- Manage property availability through the rental/payment lifecycle
- View rental requests for owned properties
- Approve or reject pending requests
- Complete active rentals

### Admin

- View users
- Block or unblock users
- View properties
- View rental requests
- Create, update, and delete categories

### Payment flow

```text
Tenant
  -> Approved rental request
  -> Create Stripe Checkout Session
  -> Complete payment
  -> Stripe checkout.session.completed webhook
  -> Payment: COMPLETED
  -> RentalRequest: ACTIVE
  -> Property: UNAVAILABLE
```

Webhook updates are handled atomically with a Prisma transaction, and repeated webhook delivery is handled idempotently.

## 3. Technology Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT
- HTTP-only cookies

### Payment

- Stripe Checkout
- Stripe webhook signature verification

## 4. Project Structure

```text
src
├── config
├── errors
├── middlewares
├── modules
│   ├── auth
│   ├── user
│   ├── admin
│   ├── category
│   ├── property
│   ├── rental
│   ├── payment
│   └── review
├── utils
└── server.ts
```

Each module contains its route, controller, and service logic. Modules that accept request bodies also contain focused validation functions.

## 5. Installation

Clone the repository using your repository URL:

```bash
git clone <repository-url>
cd rentnest-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Use strong, private values for the JWT and Stripe secrets. Do not commit `.env` or secret values.

## 6. Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the development migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio when you need to inspect or manage local data:

```bash
npx prisma studio
```

## 7. Run Project

Development mode:

```bash
npm run dev
```

Build the TypeScript project:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

The default development port is `5000` unless `PORT` is set in `.env`.

## 8. API Documentation

The API can be tested with Postman. The expected collection file is:

```text
RentNest Backend API.postman_collection.json
```

The API is organized into these groups:

- Auth
- Users
- Properties
- Rentals
- Payments
- Reviews
- Admin
- Categories

Protected endpoints require the authenticated HTTP-only cookies, or the supported access-token authorization header.

## 9. Main API Routes

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
GET  /api/auth/me
```

### Users

```text
GET /api/users/me
PUT /api/users/profile
```

### Properties

```text
POST   /api/landlord/properties
GET    /api/landlord/properties
GET    /api/properties
GET    /api/properties/:id
PATCH  /api/landlord/properties/:id
DELETE /api/landlord/properties/:id
```

Public property listing and detail endpoints expose available properties. Landlord property-management endpoints require the landlord role and ownership checks.

### Rentals

```text
POST  /api/rentals
GET   /api/rentals/my-requests
GET   /api/rentals/landlord
PATCH /api/rentals/:id/status
PATCH /api/rentals/:id/complete
```

Valid rental transitions are:

```text
PENDING -> APPROVED
PENDING -> REJECTED
ACTIVE  -> COMPLETED
```

### Payments

```text
POST /api/payments/create
GET  /api/payments/history
GET  /api/payments/:id
POST /api/payments/webhook
```

### Reviews

```text
POST /api/reviews
GET  /api/reviews/property/:propertyId
```

### Admin

```text
GET   /api/admin/users
PATCH /api/admin/users/:id
GET   /api/admin/properties
GET   /api/admin/rentals
```

### Categories

```text
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

## 10. Stripe Webhook Local Testing

Install and authenticate the Stripe CLI, then forward Stripe events to the local webhook endpoint:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the signing secret printed by Stripe CLI into `STRIPE_WEBHOOK_SECRET` in `.env`, then restart the backend.

After a successful Checkout payment, the webhook completes the rental lifecycle:

```text
Payment:
PENDING -> COMPLETED

RentalRequest:
APPROVED -> ACTIVE

Property:
AVAILABLE -> UNAVAILABLE
```

The webhook requires Stripe signature verification and uses the raw request body. Do not place the webhook route behind `express.json()` processing before signature verification.

## 11. Security Features

- Request-body validation
- Explicit field handling for update operations
- JWT verification
- HTTP-only cookie authentication
- Role-based authorization
- Database-backed blocked-user protection
- Ownership checks for landlord property and rental operations
- Stripe webhook signature verification
- Prisma transactions for related payment lifecycle updates
- Duplicate rental-request prevention
- Duplicate payment prevention
- Prisma and application error handling middleware
- Sensitive user fields excluded from API responses

## 12. Error Response Format

Application errors use the following response shape:

```json
{
  "success": false,
  "message": "Error message",
  "errorDetails": null
}
```

## 13. Admin Demo Credentials

Use local development credentials only:

```text
Email: <admin-email>
Password: <admin-password>
```

Create or configure the admin account securely for your local environment. Do not publish real credentials.

## 14. License

This project is provided for educational purposes.
