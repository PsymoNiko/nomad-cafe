# TON Cafe App

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/alis-projects-babca186/v0-ton-cafe-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/jYRgBNvOgLU)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/alis-projects-babca186/v0-ton-cafe-app](https://vercel.com/alis-projects-babca186/v0-ton-cafe-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/jYRgBNvOgLU](https://v0.app/chat/jYRgBNvOgLU)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## API Documentation

This project includes comprehensive API documentation using Swagger/OpenAPI 3.0.

### Accessing the Documentation

- **Interactive Swagger UI**: Visit `/api-docs` to explore the API using an interactive interface
- **OpenAPI Specification**: The OpenAPI JSON spec is available at `/api/swagger`

### Available Endpoints

#### Cafes
- `GET /api/cafes/nearest` - Get nearest cafes by location
  - Query params: `lat`, `lng`, `limit` (optional)
  - Returns an array of cafes sorted by distance

#### Orders
- `POST /api/orders` - Create a new order
  - Request body: `{ items: [{menu_item_id, qty, price_ton}] }`
  - Returns order details and TON payment information

#### Payments
- `POST /api/payments/submit` - Submit payment proof
  - Request body: `{ order_id, tx_boc, from }`
  - Returns payment verification status

### Features

- ✅ Complete API documentation following OpenAPI 3.0 standards
- ✅ Interactive testing interface with Swagger UI
- ✅ Request/response schemas with examples
- ✅ Parameter validation documentation
- ✅ Response codes and error handling documentation

### Development

To run the project locally with API documentation:

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000/api-docs` to view the API documentation.
